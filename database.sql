-- Script de creación de la base de datos para Nooks (Supabase)
-- Incluye tablas, relaciones, índices y ejemplo de RLS

-- Tabla: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  avatar_url text
);

-- Tabla: locations (Realms y Nooks)
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  latitude double precision,
  longitude double precision,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  radius double precision NOT NULL DEFAULT 100.0 CHECK (radius > 0 AND radius <= 50000)
);

-- Tabla: treasures
CREATE TABLE IF NOT EXISTS treasures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nook_location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  stored_at timestamp with time zone DEFAULT now(),
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Tabla: tags
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, name)
);

-- Tabla: location_tags (N-M)
CREATE TABLE IF NOT EXISTS location_tags (
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (location_id, tag_id)
);

-- Tabla: treasure_tags (N-M)
CREATE TABLE IF NOT EXISTS treasure_tags (
  treasure_id uuid NOT NULL REFERENCES treasures(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (treasure_id, tag_id)
);

-- Tabla: media
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  entity_type text NOT NULL CHECK (entity_type IN ('location', 'treasure')),
  entity_id uuid NOT NULL,
  is_primary boolean DEFAULT false,
  mime_type text,
  file_size integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_parent_location_id ON locations(parent_location_id);
CREATE INDEX IF NOT EXISTS idx_treasures_user_id ON treasures(user_id);
CREATE INDEX IF NOT EXISTS idx_treasures_nook_location_id ON treasures(nook_location_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_media_entity_type_id ON media(entity_type, entity_id);

-- Políticas RLS (ejemplo para locations)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own locations" ON locations
  FOR ALL USING (auth.uid() = user_id);

-- Repetir RLS y policies para el resto de tablas según corresponda
