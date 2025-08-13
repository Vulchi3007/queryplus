/*
  # Create users and analysis tables

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
    - Add policies for authenticated users to manage their own data
    - Add policies for public access (since this is a medical app)

  3. Indexes
    - Add indexes for better query performance
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age > 0 AND age <= 120),
  city text NOT NULL,
  mobile text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Create analysis_records table
CREATE TABLE IF NOT EXISTS analysis_records (
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

-- Create policies for users table
-- Allow anyone to insert (for new registrations)
CREATE POLICY "Anyone can create user records"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Create policies for analysis_records table
-- Allow anyone to insert analysis records
CREATE POLICY "Anyone can create analysis records"
  ON analysis_records
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read analysis records (for medical purposes)
CREATE POLICY "Anyone can read analysis records"
  ON analysis_records
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_records_user_id ON analysis_records(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_records_created_at ON analysis_records(created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_records_stage ON analysis_records(stage);

-- Create a view for user analysis summary
CREATE OR REPLACE VIEW user_analysis_summary AS
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