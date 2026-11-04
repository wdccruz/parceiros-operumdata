<?php
// Copie para enviar-config.php no servidor (mesma pasta de enviar.php).
// Não vai para o repositório. O .htaccess bloqueia o acesso pela web.
return [
  'destino' => 'parceiros@operumdata.com',
  'remetente' => 'nao-responda@operumdata.com', // usado só sem SMTP
  // Envio autenticado no Titan (recomendado). Sem senha, usa mail() do servidor.
  'smtp' => [
    'host' => 'smtp.titan.email',
    'porta' => 465,
    'usuario' => 'parceiros@operumdata.com',
    'senha' => '', // preencha no servidor, nunca no repositório
  ],
];
