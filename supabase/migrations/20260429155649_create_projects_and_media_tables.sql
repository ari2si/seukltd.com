/*
  # Create projects and media tables for SEUK Ltd website

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `category` (text) - service category
      - `location` (text)
      - `featured` (boolean, default false)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)
    - `media`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects, nullable - null means site-wide)
      - `url` (text, not null) - storage URL
      - `type` (text) - 'image' or 'video'
      - `caption` (text)
      - `section` (text) - which section this media belongs to (hero, about, gallery, etc.)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)

  2. Storage
    - Create a `media` storage bucket for image/video uploads

  3. Security
    - Enable RLS on both tables
    - Public can read projects and media
    - Only authenticated users can insert/update/delete
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  location text DEFAULT '',
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  url text NOT NULL,
  type text NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  caption text DEFAULT '',
  section text DEFAULT 'gallery',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view media"
  ON media FOR SELECT
  TO public
  USING (true);

-- Authenticated user policies for projects
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Authenticated user policies for media
CREATE POLICY "Authenticated users can insert media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update media"
  ON media FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media"
  ON media FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_media_section ON media(section);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
