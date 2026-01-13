# EvoluiHub — Guia de Deploy (ETAPA 18)

## A) Visão geral dos serviços
- **web-admin** (Next.js) — porta 3000
- **web-member** (Next.js) — porta 3001
- **api** (Fastify/Node) — porta 4000
- **worker** (Node) — sem porta, roda loop de outbox de e-mail

## B) Pré-requisitos (VPS ou similar)
- Node.js LTS (>=20) e `corepack enable` para pnpm
- pnpm 9.12.x
- Postgres acessível via `DATABASE_URL`
- Nginx ou Caddy para reverse proxy + SSL
- Domínio com DNS apontando para o servidor

## C) Passo a passo de deploy
1. `git clone <repo>`
2. `cd evoluihub`
3. `corepack enable && corepack prepare pnpm@9.12.3 --activate`
4. `pnpm -w install`
5. Criar `.env` (ou `.env.production`) com variáveis de produção
6. `pnpm -w db:migrate`
7. (Opcional staging) `pnpm -w db:seed`
8. `pnpm build`
9. `pnpm start` (ou use systemd/supervisor por serviço)
10. Validar healthchecks:
    - `curl http://localhost:4000/health`
    - `curl http://localhost:4000/api/v1/health`
    - Acessar `https://admin.seudominio` e `https://app.seudominio`

## D) Variáveis essenciais
- `DATABASE_URL` — conexão Postgres
- `AUTH_JWT_SECRET` — segredo forte para JWT
- `AUTH_COOKIE_SECURE=true` — obrigatório em produção (HTTPS)
- `AUTH_COOKIE_DOMAIN=seudominio.com` — define domínio do cookie
- `AUTH_COOKIE_SAMESITE=none|lax` — `none` para subdomínios diferentes + HTTPS
- `ALLOWED_ORIGINS=https://admin.seudominio,https://app.seudominio` — CORS
- `EMAIL_RELAY_URL` — endpoint HTTP do relay de e-mail
- `EMAIL_RELAY_API_KEY` — chave do relay (opcional)
- `EMAIL_FROM_EMAIL` — remetente
- `EMAIL_FROM_NAME` — nome do remetente
- `WORKER_OUTBOX_INTERVAL_MS` — intervalo do loop do worker (default 10000)
- `WORKER_OUTBOX_BATCH` — tamanho do lote do worker (default 10)

## E) Exemplo de Nginx (resumo)
```
server {
  listen 80;
  server_name api.seudominio.com;
  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

server {
  listen 80;
  server_name admin.seudominio.com;
  location / { proxy_pass http://127.0.0.1:3000; }
}

server {
  listen 80;
  server_name app.seudominio.com;
  location / { proxy_pass http://127.0.0.1:3001; }
}
```
Use certbot/Let’s Encrypt para HTTPS e redirecione HTTP -> HTTPS.

## F) SSL
- Instalar certbot (`apt install certbot python3-certbot-nginx` ou equivalente)
- `certbot --nginx -d api.seudominio.com -d admin.seudominio.com -d app.seudominio.com`
- Manter renovação automática (`systemctl status certbot.timer`)

## G) Runbook
- Logs:
  - API: `pnpm -C apps/api dev` (dev) ou `journalctl -u evoluihub-api`
  - Worker: `journalctl -u evoluihub-worker`
  - Web: `journalctl -u evoluihub-web-admin|web-member`
- Reiniciar serviços: `systemctl restart evoluihub-*`
- Ver fila de e-mail: `psql "$DATABASE_URL" -c "select id,status,template_name,to_email,last_error from email_outbox order by id desc limit 20;"`
- Reprocessar pendentes: garantir worker rodando ou rodar `pnpm -C apps/api dev` e endpoint `/api/v1/platform/email/test` (somente platform admin)

## H) Checklist final de validação
- Login admin e member (cookies HTTP-only)
- Convite -> gera reset -> fluxo de reset ok
- Worker processa outbox (status muda de pending para sent/failed)
- Endpoints protegidos retornam 403 para quem não tem permissão
- Builds `pnpm build` e `pnpm start` executam sem erro
