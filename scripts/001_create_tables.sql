-- Create datasets table to store uploaded CSV data sets
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create freelancers table to store individual freelancer records
CREATE TABLE IF NOT EXISTS freelancers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  approver TEXT,
  cost_center TEXT,
  amount DECIMAL(12, 2) DEFAULT 0,
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by dataset
CREATE INDEX IF NOT EXISTS idx_freelancers_dataset_id ON freelancers(dataset_id);

-- Enable Row Level Security
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read datasets (public sharing)
CREATE POLICY "datasets_public_read" ON datasets FOR SELECT USING (true);

-- Allow anyone to insert datasets (for uploading)
CREATE POLICY "datasets_public_insert" ON datasets FOR INSERT WITH CHECK (true);

-- Allow anyone to read freelancers (public sharing)
CREATE POLICY "freelancers_public_read" ON freelancers FOR SELECT USING (true);

-- Allow anyone to insert freelancers (for uploading)
CREATE POLICY "freelancers_public_insert" ON freelancers FOR INSERT WITH CHECK (true);
