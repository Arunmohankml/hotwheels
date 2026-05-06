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
  user_id UUID REFERENCES auth.users(id),
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
