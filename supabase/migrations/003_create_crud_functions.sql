-- 003: CRUD Functions for Products
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

-- Get single product
CREATE OR REPLACE FUNCTION public.get_product_by_id(p_id UUID)
RETURNS TABLE (
  id UUID, name TEXT, description TEXT, price INTEGER, stock INTEGER,
  category TEXT, images JSONB, metadata JSONB, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY SELECT pr.* FROM products pr WHERE pr.id = p_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create product
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

-- Update product
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

-- Delete product
CREATE OR REPLACE FUNCTION public.delete_product(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM products WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;