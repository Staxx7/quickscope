-- Ledgr Platform Database Schema
-- This schema creates all necessary tables for the platform

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Prospects table (core CRM functionality)
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  industry VARCHAR(100),
  annual_revenue DECIMAL(15, 2),
  employee_count INTEGER,
  workflow_stage VARCHAR(50) DEFAULT 'discovery',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QuickBooks tokens table
CREATE TABLE IF NOT EXISTS qbo_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  company_id VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI analyses table
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  company_id VARCHAR(255),
  closeability_score INTEGER CHECK (closeability_score >= 0 AND closeability_score <= 100),
  financial_health_score INTEGER CHECK (financial_health_score >= 0 AND financial_health_score <= 100),
  key_insights JSONB,
  pain_points JSONB,
  opportunities JSONB,
  recommendations JSONB,
  full_analysis JSONB,
  analysis_type VARCHAR(50) DEFAULT 'comprehensive',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call transcripts table
CREATE TABLE IF NOT EXISTS call_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  transcript_text TEXT,
  analysis_results JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial snapshots table (cached QuickBooks data)
CREATE TABLE IF NOT EXISTS financial_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id VARCHAR(255) NOT NULL,
  snapshot_date DATE NOT NULL,
  revenue DECIMAL(15, 2),
  expenses DECIMAL(15, 2),
  net_income DECIMAL(15, 2),
  assets DECIMAL(15, 2),
  liabilities DECIMAL(15, 2),
  equity DECIMAL(15, 2),
  cash_flow DECIMAL(15, 2),
  accounts_receivable DECIMAL(15, 2),
  accounts_payable DECIMAL(15, 2),
  gross_margin DECIMAL(5, 2),
  operating_margin DECIMAL(5, 2),
  net_margin DECIMAL(5, 2),
  current_ratio DECIMAL(10, 2),
  quick_ratio DECIMAL(10, 2),
  debt_to_equity DECIMAL(10, 2),
  working_capital DECIMAL(15, 2),
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, snapshot_date)
);

-- Audit decks table
CREATE TABLE IF NOT EXISTS audit_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  company_id VARCHAR(255),
  deck_url TEXT,
  deck_data JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- Sales activities table
CREATE TABLE IF NOT EXISTS sales_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  outcome VARCHAR(100),
  created_by VARCHAR(255),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Industry benchmarks table
CREATE TABLE IF NOT EXISTS industry_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry VARCHAR(100) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15, 4),
  percentile_25 DECIMAL(15, 4),
  percentile_50 DECIMAL(15, 4),
  percentile_75 DECIMAL(15, 4),
  source VARCHAR(100),
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(industry, metric_name, year)
);

-- Generated reports table
CREATE TABLE IF NOT EXISTS generated_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  company_id VARCHAR(255) NOT NULL,
  report_data JSONB,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_prospects_workflow_stage ON prospects(workflow_stage);
CREATE INDEX idx_prospects_email ON prospects(email);
CREATE INDEX idx_qbo_tokens_company_id ON qbo_tokens(company_id);
CREATE INDEX idx_qbo_tokens_prospect_id ON qbo_tokens(prospect_id);
CREATE INDEX idx_ai_analyses_prospect_id ON ai_analyses(prospect_id);
CREATE INDEX idx_ai_analyses_company_id ON ai_analyses(company_id);
CREATE INDEX idx_call_transcripts_prospect_id ON call_transcripts(prospect_id);
CREATE INDEX idx_financial_snapshots_company_id ON financial_snapshots(company_id);
CREATE INDEX idx_financial_snapshots_date ON financial_snapshots(snapshot_date);
CREATE INDEX idx_audit_decks_prospect_id ON audit_decks(prospect_id);
CREATE INDEX idx_sales_activities_prospect_id ON sales_activities(prospect_id);
CREATE INDEX idx_industry_benchmarks_industry ON industry_benchmarks(industry);
CREATE INDEX idx_generated_reports_company_id ON generated_reports(company_id);
CREATE INDEX idx_generated_reports_type ON generated_reports(report_type);
CREATE INDEX idx_generated_reports_created_at ON generated_reports(created_at);

-- Create update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp trigger to relevant tables
CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qbo_tokens_updated_at BEFORE UPDATE ON qbo_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (comment out in production)
-- INSERT INTO prospects (company_name, contact_name, email, industry, annual_revenue)
-- VALUES 
--   ('Acme Corp', 'John Doe', 'john@acme.com', 'Technology', 5000000),
--   ('Global Industries', 'Jane Smith', 'jane@global.com', 'Manufacturing', 10000000),
--   ('StartupXYZ', 'Bob Johnson', 'bob@startupxyz.com', 'SaaS', 2000000);