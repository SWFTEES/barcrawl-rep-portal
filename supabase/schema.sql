-- Nevada Senior Bar Crawl - Sales Rep Portal Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Create reps table
CREATE TABLE IF NOT EXISTS reps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ig_handle TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  university TEXT,
  promo_plan TEXT,
  prev_experience TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  ghl_contact_id TEXT
);

-- Enable Row Level Security
ALTER TABLE reps ENABLE ROW LEVEL SECURITY;

-- Public can read approved reps (for leaderboard)
CREATE POLICY "Public can view approved reps" ON reps
  FOR SELECT USING (status = 'approved');

-- Service role can do everything (for n8n writes)
CREATE POLICY "Service role full access" ON reps
  FOR ALL USING (true);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rep_ig_handle TEXT NOT NULL REFERENCES reps(ig_handle),
  sale_type TEXT NOT NULL CHECK (sale_type IN ('shirt', 'ticket')),
  quantity INTEGER DEFAULT 1,
  amount DECIMAL(10,2),
  source TEXT,
  external_order_id TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Public can read all sales (leaderboard is public)
CREATE POLICY "Public can view sales" ON sales
  FOR SELECT USING (true);

-- Service role can insert (for n8n)
CREATE POLICY "Service role full access sales" ON sales
  FOR ALL USING (true);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  r.ig_handle,
  r.full_name,
  COALESCE(SUM(CASE WHEN s.sale_type = 'shirt' THEN s.quantity ELSE 0 END), 0) AS shirts_sold,
  COALESCE(SUM(CASE WHEN s.sale_type = 'ticket' THEN s.quantity ELSE 0 END), 0) AS tickets_sold,
  COALESCE(SUM(CASE WHEN s.sale_type = 'shirt' THEN s.quantity ELSE 0 END), 0) * 2 +
  COALESCE(SUM(CASE WHEN s.sale_type = 'ticket' THEN s.quantity ELSE 0 END), 0) AS total_points,
  COALESCE(SUM(CASE WHEN s.sale_type = 'shirt' THEN s.quantity ELSE 0 END), 0) * 5 +
  COALESCE(SUM(CASE WHEN s.sale_type = 'ticket' THEN s.quantity ELSE 0 END), 0) * 3 AS total_commission,
  COALESCE(SUM(s.quantity), 0) AS total_units
FROM reps r
LEFT JOIN sales s ON r.ig_handle = s.rep_ig_handle
WHERE r.status = 'approved'
GROUP BY r.ig_handle, r.full_name
ORDER BY total_points DESC;

-- Create config table
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Insert default config (only if not exists)
INSERT INTO config (key, value) 
VALUES 
  ('event_name', '"Nevada Senior Bar Crawl — Spring 2026"'),
  ('event_date', '"TBD"'),
  ('commission_shirt', '5'),
  ('commission_ticket', '3'),
  ('points_per_shirt', '2'),
  ('points_per_ticket', '1'),
  ('bonus_tiers', '[{"units": 10, "reward": "Free Shirt"}, {"units": 25, "reward": "$50 Bonus"}, {"units": 40, "reward": "$50 Bonus"}]')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read config" ON config FOR SELECT USING (true);
CREATE POLICY "Service role full access config" ON config FOR ALL USING (true);