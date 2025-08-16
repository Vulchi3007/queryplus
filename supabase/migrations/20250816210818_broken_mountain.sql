/*
  # Setup QurePlus Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `age` (integer)
      - `city` (text)
      - `mobile` (text)
      - `email` (text, optional)
      - `created_at` (timestamp)
    - `analysis_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `image_url` (text, optional for storing image URLs)
      - `image_name` (text, original filename)
      - `probability` (numeric, 0-100)
      - `stage` (text, varicose vein stage)
      - `reasoning` (text, AI analysis reasoning)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (medical app needs this)

  3. Storage
    - Create medical-images bucket
    - Set up storage policies
*/

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS analysis_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS user_analysis_summary CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age > 0 AND age <= 120),
  city text NOT NULL,
  mobile text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Create analysis_records table
CREATE TABLE analysis_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url text,
  image_name text,
  probability numeric(5,2) CHECK (probability >= 0 AND probability <= 100),
  stage text NOT NULL,
  reasoning text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_records ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (allow all operations for medical app)
CREATE POLICY "Allow all operations on users"
  ON users
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for analysis_records table (allow all operations for medical app)
CREATE POLICY "Allow all operations on analysis_records"
  ON analysis_records
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_analysis_records_user_id ON analysis_records(user_id);
CREATE INDEX idx_analysis_records_created_at ON analysis_records(created_at);
CREATE INDEX idx_analysis_records_stage ON analysis_records(stage);

-- Create a view for user analysis summary
CREATE VIEW user_analysis_summary AS
SELECT 
  u.id,
  u.full_name,
  u.age,
  u.city,
  u.mobile,
  u.email,
  u.created_at as user_created_at,
  COUNT(ar.id) as total_analyses,
  MAX(ar.created_at) as last_analysis_date,
  AVG(ar.probability) as avg_probability
FROM users u
LEFT JOIN analysis_records ar ON u.id = ar.user_id
GROUP BY u.id, u.full_name, u.age, u.city, u.mobile, u.email, u.created_at;

-- Create storage bucket for medical images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-images',
  'medical-images', 
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for medical images
CREATE POLICY "Allow uploads to medical-images" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'medical-images');

CREATE POLICY "Allow access to medical-images" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'medical-images');

CREATE POLICY "Allow updates to medical-images" ON storage.objects
FOR UPDATE TO anon, authenticated
USING (bucket_id = 'medical-images');

CREATE POLICY "Allow deletes from medical-images" ON storage.objects
FOR DELETE TO anon, authenticated
USING (bucket_id = 'medical-images');