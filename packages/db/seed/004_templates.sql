-- Transactional message templates and demo webhook

-- Templates
INSERT INTO message_templates (tenant_id, name, channel, subject, body)
VALUES
  ({{TENANT_ID}}, 'enrollment_created', 'email', 'Sua matrícula foi confirmada ✅', 'Olá {{member.name}},\n\nSua matrícula no curso {{product.title}} foi confirmada com sucesso.\n\nAcesse agora:\n{{cta_url}}'),
  ({{TENANT_ID}}, 'enrollment_created', 'inapp', NULL, 'Sua matrícula em {{product.title}} foi confirmada. Clique para começar.'),
  ({{TENANT_ID}}, 'payment_paid', 'email', 'Pagamento aprovado ✅', 'Olá {{member.name}},\n\nRecebemos seu pagamento no valor de {{payment.amount}}.\n\nProduto: {{product.title}}\nObrigado!'),
  ({{TENANT_ID}}, 'password_reset', 'email', 'Redefinição de senha', 'Clique no link abaixo para redefinir sua senha:\n{{reset_url}}')
ON CONFLICT (tenant_id, name, channel) DO NOTHING;

-- Demo webhook endpoint (inactive)
INSERT INTO webhook_endpoints (tenant_id, url, secret, description, status)
VALUES (
  {{TENANT_ID}},
  'https://webhook.site/example-demo',
  'demo_secret_key',
  'Demo Webhook (events: enrollment.created, lesson.completed, purchase.paid)',
  'inactive'
)
ON CONFLICT (tenant_id, url) DO NOTHING;
