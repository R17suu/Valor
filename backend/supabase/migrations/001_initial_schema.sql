-- VALOR Backend - Initial PostgreSQL Schema
-- Production-ready schema with all tables, indexes, and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial queries (optional but recommended for location-based features)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- ENUMS - Status types and roles
-- ============================================================================

CREATE TYPE report_status AS ENUM (
  'submitted',
  'assigned',
  'in_progress',
  'resolved',
  'cancelled'
);

CREATE TYPE incident_status AS ENUM (
  'open',
  'assigned',
  'in_progress',
  'resolved',
  'closed'
);

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'department_head',
  'officer',
  'citizen'
);

CREATE TYPE audit_action AS ENUM (
  'created',
  'updated',
  'status_changed',
  'assigned',
  'merged',
  'deleted'
);

-- ============================================================================
-- BARANGAYS TABLE
-- Geographic divisions of Valencia for location-based organization
-- ============================================================================

CREATE TABLE IF NOT EXISTS barangays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  area_km2 DECIMAL(10, 2),
  population INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_barangays_code ON barangays(code);
CREATE INDEX idx_barangays_name ON barangays(name);

-- ============================================================================
-- DEPARTMENTS TABLE
-- LGU departments responsible for different categories of issues
-- ============================================================================

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  head_id UUID,
  barangay_id UUID REFERENCES barangays(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departments_name ON departments(name);
CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_barangay ON departments(barangay_id);

-- ============================================================================
-- ADMIN_USERS TABLE
-- LGU personnel and administrators
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'officer',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_department ON admin_users(department_id);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Add foreign key constraint to departments.head_id
ALTER TABLE departments
ADD CONSTRAINT fk_departments_head
FOREIGN KEY (head_id) REFERENCES admin_users(id) ON DELETE SET NULL;

-- ============================================================================
-- INCIDENTS TABLE
-- Main incident records created when reports are grouped
-- ============================================================================

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(50) NOT NULL, -- 'critical', 'high', 'medium', 'low'
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  barangay_id UUID REFERENCES barangays(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status incident_status NOT NULL DEFAULT 'open',
  report_count INTEGER NOT NULL DEFAULT 1,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_category ON incidents(category);
CREATE INDEX idx_incidents_priority ON incidents(priority);
CREATE INDEX idx_incidents_department ON incidents(department_id);
CREATE INDEX idx_incidents_assigned_to ON incidents(assigned_to);
CREATE INDEX idx_incidents_barangay ON incidents(barangay_id);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);
CREATE INDEX idx_incidents_location ON incidents(latitude, longitude);

-- ============================================================================
-- REPORTS TABLE
-- Individual citizen reports that can be grouped into incidents
-- ============================================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  photo_url VARCHAR(2048),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  contact_name VARCHAR(255),
  contact_number VARCHAR(20),
  contact_email VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(50),
  ai_summary TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
  status report_status NOT NULL DEFAULT 'submitted',
  barangay_id UUID REFERENCES barangays(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_incident ON reports(incident_id);
CREATE INDEX idx_reports_department ON reports(department_id);
CREATE INDEX idx_reports_barangay ON reports(barangay_id);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_location ON reports(latitude, longitude);
CREATE INDEX idx_reports_contact ON reports(contact_email);

-- ============================================================================
-- INCIDENT_UPDATES TABLE
-- Progress updates from LGU personnel on incidents
-- ============================================================================

CREATE TABLE IF NOT EXISTS incident_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  update_message TEXT NOT NULL,
  updated_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE RESTRICT,
  status incident_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_incident_updates_incident ON incident_updates(incident_id);
CREATE INDEX idx_incident_updates_updated_by ON incident_updates(updated_by);
CREATE INDEX idx_incident_updates_created_at ON incident_updates(created_at);

-- ============================================================================
-- AUDIT_LOGS TABLE
-- Comprehensive audit trail for compliance and debugging
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action audit_action NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  record_id UUID NOT NULL,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- ============================================================================

-- Incident analytics summary
CREATE MATERIALIZED VIEW incident_analytics AS
SELECT
  i.category,
  COUNT(DISTINCT i.id) as total_incidents,
  COUNT(DISTINCT r.id) as total_reports,
  SUM(i.report_count) as reports_count,
  COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) as resolved_count,
  COUNT(CASE WHEN i.status = 'open' THEN 1 END) as open_count,
  i.priority,
  d.name as department_name,
  b.name as barangay_name,
  EXTRACT(YEAR FROM i.created_at) as year,
  EXTRACT(MONTH FROM i.created_at) as month
FROM incidents i
LEFT JOIN reports r ON i.id = r.incident_id
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN barangays b ON i.barangay_id = b.id
GROUP BY
  i.category,
  i.priority,
  d.name,
  b.name,
  EXTRACT(YEAR FROM i.created_at),
  EXTRACT(MONTH FROM i.created_at);

CREATE INDEX idx_incident_analytics_category ON incident_analytics(category);
CREATE INDEX idx_incident_analytics_department ON incident_analytics(department_name);
CREATE INDEX idx_incident_analytics_barangay ON incident_analytics(barangay_name);

-- Department workload summary
CREATE MATERIALIZED VIEW department_workload AS
SELECT
  d.id,
  d.name,
  COUNT(DISTINCT i.id) as open_incidents,
  COUNT(DISTINCT CASE WHEN i.status = 'resolved' THEN i.id END) as resolved_incidents,
  AVG(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600) as avg_resolution_hours,
  COUNT(DISTINCT au.id) as staff_count,
  CURRENT_TIMESTAMP as last_updated
FROM departments d
LEFT JOIN incidents i ON d.id = i.department_id
LEFT JOIN admin_users au ON d.id = au.department_id AND au.is_active = TRUE
GROUP BY d.id, d.name;

CREATE INDEX idx_department_workload_id ON department_workload(id);
CREATE INDEX idx_department_workload_name ON department_workload(name);

-- ============================================================================
-- TRIGGER FUNCTIONS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for reports table
CREATE TRIGGER reports_update_timestamp
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger for incidents table
CREATE TRIGGER incidents_update_timestamp
BEFORE UPDATE ON incidents
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger for departments table
CREATE TRIGGER departments_update_timestamp
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger for admin_users table
CREATE TRIGGER admin_users_update_timestamp
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger for barangays table
CREATE TRIGGER barangays_update_timestamp
BEFORE UPDATE ON barangays
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE reports IS 'Individual citizen-submitted reports about city issues';
COMMENT ON TABLE incidents IS 'Grouped incidents created from one or more related reports';
COMMENT ON TABLE departments IS 'LGU departments responsible for different categories';
COMMENT ON TABLE barangays IS 'Geographic divisions of Valencia city';
COMMENT ON TABLE incident_updates IS 'Status updates and progress notes from LGU personnel';
COMMENT ON TABLE audit_logs IS 'Audit trail for all significant database changes';
COMMENT ON TABLE admin_users IS 'LGU personnel and system administrators';

COMMENT ON COLUMN reports.ai_summary IS 'AI-generated summary of the report';
COMMENT ON COLUMN incidents.report_count IS 'Number of reports grouped into this incident';
COMMENT ON COLUMN incidents.priority IS 'AI-determined priority: critical, high, medium, low';
COMMENT ON COLUMN incidents.assigned_to IS 'Officer assigned to handle this incident';
