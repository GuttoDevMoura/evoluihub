-- Payments: orders, items, payments, subscriptions, coupons

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT REFERENCES members(id) ON DELETE SET NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_tenant_status_idx ON orders (tenant_id, status);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS order_items_unique ON order_items (order_id, product_id);
CREATE INDEX IF NOT EXISTS order_items_tenant_idx ON order_items (tenant_id);

CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  provider TEXT,
  provider_payment_id TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_unique ON payments (tenant_id, provider, provider_payment_id);
CREATE INDEX IF NOT EXISTS payments_tenant_status_idx ON payments (tenant_id, status);

CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  plan_interval TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  canceled_at TIMESTAMPTZ,
  renews_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_unique ON subscriptions (tenant_id, member_id, product_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions (tenant_id, status);

CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  max_redemptions INT,
  redeemed_count INT NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_unique ON coupons (tenant_id, code);
CREATE INDEX IF NOT EXISTS coupons_validity_idx ON coupons (tenant_id, valid_from, valid_until);
