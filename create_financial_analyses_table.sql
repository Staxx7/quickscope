-- Create financial_analyses table to store comprehensive analysis results
CREATE TABLE IF NOT EXISTS financial_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  transcript_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_financial_analyses_company_id ON financial_analyses(company_id);
CREATE INDEX idx_financial_analyses_transcript_id ON financial_analyses(transcript_id);
CREATE INDEX idx_financial_analyses_created_at ON financial_analyses(created_at DESC);

-- Add RLS policies
ALTER TABLE financial_analyses ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
CREATE POLICY "Service role can manage all analyses" ON financial_analyses
  FOR ALL USING (true);