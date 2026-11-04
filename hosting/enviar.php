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

$ok = mail($cfg['destino'], '=?UTF-8?B?' . base64_encode($assunto) . '?=', implode("\r\n", $linhas), implode("\r\n", $cab), '-f' . $remetente);
if (!$ok) responder(502, false, 'envio');

$hist[] = $agora;
@file_put_contents($marca, implode(',', $hist), LOCK_EX);
responder(200, true);
