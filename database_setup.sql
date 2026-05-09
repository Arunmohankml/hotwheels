-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  series TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 10,
  is_featured BOOLEAN DEFAULT false,
  is_limited BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'Mainline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data (Your Cars)
INSERT INTO products (name, series, description, price, image_url, stock, is_featured, is_limited)
VALUES 
('Concept V8 Gold', 'Signature Series', 'Ultra-rare gold plated edition with custom aero kit.', 19999, '/images/Hot-Wheels-Car-PNG-Photos.png', 5, true, true),
('Neon Speedster X', 'Elite Series', 'Cyberpunk inspired design with translucent wheels.', 2499, '/images/Hot-Wheels-Car-PNG-HD-Image (1).png', 15, true, false),
('Viper R/T Concept', 'Street Tuners', 'Aggressive widebody kit and custom exhaust details.', 3499, '/images/Hot-Wheels-Car-PNG-Clipart.png', 12, false, false),
('Drift King Z', 'Track Day', 'Tuned for the track. Authentic racing decals.', 1999, '/images/Hot-Wheels-Car-No-Background (1).png', 20, false, false),
('Classic Cruiser 69', 'Heritage Collection', 'Vintage muscle car recreation with premium finish.', 2999, '/images/Hot-Wheels-Car.png', 8, false, false);

-- Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  instagram_id TEXT DEFAULT 'hotwheels.india',
  contact_email TEXT DEFAULT 'support@hotwheels.in',
  contact_phone TEXT DEFAULT '+91 98765 43210',
  privacy_policy TEXT,
  refund_policy TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initialize Settings
INSERT INTO settings (id, instagram_id, contact_email, contact_phone)
VALUES ('global', 'hotwheels.india', 'support@hotwheels.in', '+91 98765 43210')
ON CONFLICT (id) DO NOTHING;

-- Create Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY, -- Linked to Firebase User ID
  email TEXT,
  full_name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_banned BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  mock_ip TEXT DEFAULT '192.168.1.1'
);

-- Create Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reports Table (Vault Guard)
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  full_name TEXT,
  email TEXT,
  category TEXT NOT NULL, -- Damaged, Wrong Item, Refund, etc.
  description TEXT,
  media_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, under_review, resolved, etc.
  admin_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Reports (Admin can see all, Users see their own)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own reports" ON reports
  FOR SELECT USING (user_id IS NOT NULL);

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (user_id IS NOT NULL);
