# Chouga E-Commerce - Supabase Setup

## Database Setup

Go to: https://supabase.com/dashboard/project/ppftrkturqvkqbsxalno/sql

Run these migrations in order:

### 1. Products Table (001_create_products.sql)
```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete" ON products FOR DELETE USING (auth.role() = 'authenticated');
```

### 2. Profiles Table (002_create_profiles.sql)
```sql
CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. CRUD Functions (003_create_crud_functions.sql)
```sql
-- get_products(p_category, p_limit, p_offset)
CREATE OR REPLACE FUNCTION public.get_products(
  p_category TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID, name TEXT, description TEXT, price INTEGER, stock INTEGER,
  category TEXT, images JSONB, metadata JSONB, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT pr.id, pr.name, pr.description, pr.price, pr.stock, pr.category,
         pr.images, pr.metadata, pr.created_at, pr.updated_at
  FROM products pr
  WHERE p_category IS NULL OR pr.category = p_category
  ORDER BY pr.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- get_product_by_id(p_id)
CREATE OR REPLACE FUNCTION public.get_product_by_id(p_id UUID)
RETURNS TABLE (
  id UUID, name TEXT, description TEXT, price INTEGER, stock INTEGER,
  category TEXT, images JSONB, metadata JSONB, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY SELECT pr.* FROM products pr WHERE pr.id = p_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- create_product(...)
CREATE OR REPLACE FUNCTION public.create_product(
  p_name TEXT, p_description TEXT, p_price INTEGER, p_stock INTEGER DEFAULT 0,
  p_category TEXT, p_images JSONB DEFAULT '[]'::jsonb, p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (id UUID, name TEXT, description TEXT, price INTEGER, stock INTEGER, category TEXT, images JSONB, metadata JSONB, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ) AS $$
DECLARE v_product RECORD;
BEGIN
  INSERT INTO products (name, description, price, stock, category, images, metadata)
  VALUES (p_name, p_description, p_price, p_stock, p_category, p_images, p_metadata)
  RETURNING * INTO v_product;
  RETURN QUERY SELECT v_product.*;
END;
$$ LANGUAGE plpgsql;

-- update_product(...)
CREATE OR REPLACE FUNCTION public.update_product(
  p_id UUID, p_name TEXT DEFAULT NULL, p_description TEXT DEFAULT NULL,
  p_price INTEGER DEFAULT NULL, p_stock INTEGER DEFAULT NULL, p_category TEXT DEFAULT NULL,
  p_images JSONB DEFAULT NULL, p_metadata JSONB DEFAULT NULL
)
RETURNS TABLE (id UUID, name TEXT, description TEXT, price INTEGER, stock INTEGER, category TEXT, images JSONB, metadata JSONB, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ) AS $$
DECLARE v_product RECORD;
BEGIN
  UPDATE products SET
    name = COALESCE(p_name, name),
    description = COALESCE(p_description, description),
    price = COALESCE(p_price, price),
    stock = COALESCE(p_stock, stock),
    category = COALESCE(p_category, category),
    images = COALESCE(p_images, images),
    metadata = COALESCE(p_metadata, metadata),
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO v_product;
  RETURN QUERY SELECT v_product.*;
END;
$$ LANGUAGE plpgsql;

-- delete_product(p_id)
CREATE OR REPLACE FUNCTION public.delete_product(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM products WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

## Storage Setup

Go to: https://supabase.com/dashboard/project/ppftrkturqvkqbsxalno/storage/buckets

1. Click "New bucket"
2. Name: `product-assets`
3. Check "Public bucket"
4. Click "Create"

Then add policies:

```sql
-- Run in SQL Editor
CREATE POLICY "Public can view product assets" ON storage.objects FOR SELECT USING (bucket_id = 'product-assets');
CREATE POLICY "Auth can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Auth can update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Auth can delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-assets' AND auth.role() = 'authenticated');
```

## Next.js Setup

Install packages:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

Add to .env.local:
```
NEXT_PUBLIC_SUPABASE_URL=https://ppftrkturqvkqbsxalno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_key_from_settings
```

Create utils/supabase/server.ts, client.ts, and middleware.ts (see Supabase docs).