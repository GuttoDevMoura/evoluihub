-- Demo email templates for tenant {{TENANT_ID}}
INSERT INTO message_templates (tenant_id, name, channel, subject, body, metadata)
VALUES
  (
    {{TENANT_ID}},
    'auth_invite_user',
    'email',
    'Você foi convidado para o EvoluiHub',
    '<p>Olá,</p><p>Você foi convidado para o EvoluiHub.</p><p>Tenant: {tenantName}</p><p>Acesse: <a href=\"{inviteLink}\">Completar acesso</a></p><p>Aplicativo: {appName}</p>',
    jsonb_build_object('body_text', 'Você foi convidado para o EvoluiHub. Tenant: {tenantName}. Acesse: {inviteLink}. Aplicativo: {appName}', 'status', 'active')
  ),
  (
    {{TENANT_ID}},
    'auth_reset_password',
    'email',
    'Redefinição de senha — EvoluiHub',
    '<p>Olá,</p><p>Recebemos um pedido de redefinição de senha.</p><p>Use o link: <a href=\"{resetLink}\">Redefinir senha</a></p><p>Link expira em {expiresMinutes} minutos.</p>',
    jsonb_build_object('body_text', 'Redefinição de senha. Link: {resetLink}. Expira em {expiresMinutes} minutos.', 'status', 'active')
  ),
  (
    {{TENANT_ID}},
    'auth_login_alert',
    'email',
    'Novo login na sua conta',
    '<p>Um novo login foi detectado.</p><p>IP: {ip}</p><p>User Agent: {userAgent}</p><p>Hora: {time}</p>',
    jsonb_build_object('body_text', 'Novo login detectado. IP: {ip}. UA: {userAgent}. Hora: {time}', 'status', 'active')
  )
ON CONFLICT (tenant_id, name, channel) DO NOTHING;
