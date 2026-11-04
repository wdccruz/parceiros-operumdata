<?php
// Recebe o cadastro de interesse da página (POST JSON) e envia por e-mail.
// Só existe no pacote da HostGator. O destino fica em enviar-config.php,
// que é gerado no servidor e não vai para o repositório.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder($status, $ok, $erro = null) {
  http_response_code($status);
  echo json_encode($erro ? ['ok' => $ok, 'erro' => $erro] : ['ok' => $ok]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, false, 'metodo');

$config = __DIR__ . '/enviar-config.php';
if (!is_file($config)) responder(503, false, 'nao-configurado');
$cfg = require $config; // ['destino' => 'email@dominio', 'remetente' => 'nao-responda@dominio']
if (empty($cfg['destino'])) responder(503, false, 'nao-configurado');

// Mesmo site apenas
$origem = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origem !== '' && parse_url($origem, PHP_URL_HOST) !== $host) responder(403, false, 'origem');

$bruto = file_get_contents('php://input', false, null, 0, 20000);
$d = json_decode($bruto ?: '', true);
if (!is_array($d)) responder(400, false, 'formato');

// Robô: campo oculto preenchido -> finge sucesso e não envia
if (!empty($d['site_url'])) responder(200, true);

// Limite simples por IP: 5 envios por hora
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$marca = sys_get_temp_dir() . '/odp_' . hash('sha256', $ip . __DIR__);
$agora = time();
$hist = [];
if (is_file($marca)) $hist = array_filter(array_map('intval', explode(',', (string) file_get_contents($marca))), fn($t) => $t > $agora - 3600);
if (count($hist) >= 5) responder(429, false, 'limite');

function campo($d, $k, $max = 200) {
  $v = isset($d[$k]) && is_scalar($d[$k]) ? trim((string) $d[$k]) : '';
  $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
  return mb_substr($v, 0, $max);
}

$c = [
  'nome' => campo($d, 'nome'),
  'empresa' => campo($d, 'empresa'),
  'cidade' => campo($d, 'cidade'),
  'uf' => strtoupper(campo($d, 'uf', 2)),
  'ramo' => campo($d, 'ramo'),
  'profissionais' => campo($d, 'profissionais'),
  'whatsapp' => preg_replace('/\D/', '', campo($d, 'whatsapp', 30)),
  'observacoes' => campo($d, 'observacoes', 2000),
];
$consentiu = !empty($d['consentimento']);

foreach (['nome', 'empresa', 'cidade', 'uf', 'ramo', 'profissionais'] as $k) if ($c[$k] === '') responder(422, false, $k);
if (!preg_match('/^\d{10,11}$/', $c['whatsapp'])) responder(422, false, 'whatsapp');
if (!$consentiu) responder(422, false, 'consentimento');

$linhas = [
  'Novo cadastro de interesse — OperumData Parceiros',
  '',
  'Responsável: ' . $c['nome'],
  'Empresa: ' . $c['empresa'],
  'Cidade/UF: ' . $c['cidade'] . ' / ' . $c['uf'],
  'Ramo: ' . $c['ramo'],
  'Profissionais: ' . $c['profissionais'],
  'WhatsApp: ' . $c['whatsapp'] . '  (https://wa.me/55' . $c['whatsapp'] . ')',
  'Observações: ' . ($c['observacoes'] !== '' ? $c['observacoes'] : '-'),
  '',
  'Autorizou contato pelo WhatsApp e declarou ter lido a política de privacidade: sim',
  'Enviado em: ' . gmdate('Y-m-d H:i') . ' UTC',
  'Página: https://' . $host . '/',
];

$assunto = 'Cadastro de interesse: ' . preg_replace('/[\r\n]+/', ' ', $c['empresa']);
$remetente = $cfg['remetente'] ?? ('nao-responda@' . preg_replace('/^parceiros\./', '', $host));
$cab = [
  'From: OperumData Parceiros <' . $remetente . '>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
];

$assuntoMime = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
$corpo = implode("\r\n", $linhas);

// Primeiro tenta o envio autenticado direto no provedor (ex.: Titan). Se não
// houver senha ou o login falhar, usa o mail() do servidor, para nenhum
// cadastro se perder. Falhas do SMTP ficam no error_log do PHP.
$ok = false;
$senha = $cfg['smtp']['senha'] ?? '';
if ($senha !== '' && $senha !== 'COLE_A_SENHA_AQUI') {
  $ok = enviar_smtp($cfg['smtp'], $cfg['destino'], $assuntoMime, $corpo);
  if (!$ok) error_log('enviar.php: SMTP falhou, usando mail()');
}
if (!$ok) {
  $ok = mail($cfg['destino'], $assuntoMime, $corpo, implode("\r\n", $cab), '-f' . $remetente);
}
if (!$ok) responder(502, false, 'envio');

$hist[] = $agora;
@file_put_contents($marca, implode(',', $hist), LOCK_EX);
responder(200, true);

// Cliente SMTP mínimo (SSL na porta 465, AUTH LOGIN). Sem bibliotecas externas.
function enviar_smtp($s, $destino, $assuntoMime, $corpo) {
  $host = $s['host'] ?? 'smtp.titan.email';
  $porta = (int) ($s['porta'] ?? 465);
  $usuario = $s['usuario'];
  $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
  $f = @stream_socket_client("ssl://$host:$porta", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
  if (!$f) return false;
  stream_set_timeout($f, 15);
  $ler = function () use ($f) {
    $r = '';
    while (($l = fgets($f, 515)) !== false) { $r .= $l; if (isset($l[3]) && $l[3] === ' ') break; }
    return $r;
  };
  $cmd = function ($c, $esperado) use ($f, $ler) {
    if ($c !== null) fwrite($f, $c . "\r\n");
    $r = $ler();
    return strpos($r, (string) $esperado) === 0;
  };
  $data = str_replace("\n.", "\n..", str_replace("\r\n", "\n", $corpo));
  $data = str_replace("\n", "\r\n", $data);
  $msg = implode("\r\n", [
    'From: OperumData Parceiros <' . $usuario . '>',
    'To: <' . $destino . '>',
    'Subject: ' . $assuntoMime,
    'Date: ' . date('r'),
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . substr(strrchr($usuario, '@'), 1) . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ]) . "\r\n\r\n" . $data;
  $ok = $cmd(null, 220)
    && $cmd('EHLO ' . ($_SERVER['HTTP_HOST'] ?? 'localhost'), 250)
    && $cmd('AUTH LOGIN', 334)
    && $cmd(base64_encode($usuario), 334)
    && $cmd(base64_encode($s['senha']), 235)
    && $cmd('MAIL FROM:<' . $usuario . '>', 250)
    && $cmd('RCPT TO:<' . $destino . '>', 250)
    && $cmd('DATA', 354)
    && $cmd($msg . "\r\n.", 250);
  @fwrite($f, "QUIT\r\n");
  fclose($f);
  return $ok;
}
