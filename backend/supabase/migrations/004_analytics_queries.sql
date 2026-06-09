-- VALOR Backend - Analytics Queries and Views
-- Production-ready SQL queries for reporting and insights

-- ============================================================================
-- ANALYTICS VIEW: Dashboard Summary
-- ============================================================================

CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM incidents WHERE status != 'closed') as open_incidents,
  (SELECT COUNT(*) FROM incidents WHERE status = 'resolved') as resolved_incidents,
  (SELECT COUNT(*) FROM reports WHERE status = 'submitted') as pending_reports,
  (SELECT COUNT(*) FROM reports) as total_reports,
  (SELECT COUNT(*) FROM admin_users WHERE is_active = TRUE) as active_staff,
  (SELECT COUNT(*) FROM departments WHERE is_active = TRUE) as active_departments,
  CURRENT_TIMESTAMP as generated_at;

-- ============================================================================
-- ANALYTICS VIEW: Category Distribution
-- ============================================================================

CREATE OR REPLACE VIEW category_distribution AS
SELECT
  category,
  COUNT(DISTINCT id) as incident_count,
  ARRAY_AGG(DISTINCT priority ORDER BY priority) as priority_levels,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
  COUNT(CASE WHEN status = 'open' THEN 1 END) as open_count,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
  ROUND(100.0 * COUNT(CASE WHEN status = 'resolved' THEN 1 END) / COUNT(*), 2) as resolution_rate
FROM incidents
GROUP BY category
ORDER BY incident_count DESC;

-- ============================================================================
-- ANALYTICS VIEW: Barangay Performance
-- ============================================================================

CREATE OR REPLACE VIEW barangay_performance AS
SELECT
  b.name as barangay,
  COUNT(DISTINCT i.id) as total_incidents,
  SUM(i.report_count) as total_reports,
  COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) as resolved_incidents,
  COUNT(CASE WHEN i.status = 'open' THEN 1 END) as open_incidents,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600),
    2
  ) as avg_resolution_hours,
  MAX(i.created_at) as last_incident
FROM barangays b
LEFT JOIN incidents i ON b.id = i.barangay_id
GROUP BY b.id, b.name
ORDER BY total_incidents DESC;

-- ============================================================================
-- ANALYTICS VIEW: Department Performance
-- ============================================================================

CREATE OR REPLACE VIEW department_performance AS
SELECT
  d.name as department,
  COUNT(DISTINCT i.id) as assigned_incidents,
  COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) as resolved_incidents,
  COUNT(CASE WHEN i.status = 'open' THEN 1 END) as open_incidents,
  COUNT(DISTINCT au.id) as assigned_officers,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600),
    2
  ) as avg_resolution_hours,
  ROUND(
    100.0 * COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) / NULLIF(COUNT(DISTINCT i.id), 0),
    2
  ) as resolution_rate
FROM departments d
LEFT JOIN incidents i ON d.id = i.department_id
LEFT JOIN admin_users au ON d.id = au.department_id AND au.is_active = TRUE AND au.role = 'officer'
WHERE d.is_active = TRUE
GROUP BY d.id, d.name
ORDER BY assigned_incidents DESC;

-- ============================================================================
-- ANALYTICS VIEW: Priority Distribution
-- ============================================================================

CREATE OR REPLACE VIEW priority_distribution AS
SELECT
  priority,
  COUNT(*) as incident_count,
  COUNT(DISTINCT department_id) as departments_involved,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
  MAX(created_at) as latest_incident
FROM incidents
GROUP BY priority
ORDER BY
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END;

-- ============================================================================
-- ANALYTICS VIEW: Monthly Trends
-- ============================================================================

CREATE OR REPLACE VIEW monthly_trends AS
SELECT
  DATE_TRUNC('month', i.created_at) as month,
  COUNT(DISTINCT i.id) as incidents_created,
  COUNT(DISTINCT CASE WHEN i.status = 'resolved' THEN i.id END) as incidents_resolved,
  SUM(i.report_count) as total_reports,
  COUNT(DISTINCT i.category) as unique_categories,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600),
    2
  ) as avg_resolution_hours
FROM incidents i
GROUP BY DATE_TRUNC('month', i.created_at)
ORDER BY month DESC;

-- ============================================================================
-- ANALYTICS VIEW: Staff Performance
-- ============================================================================

CREATE OR REPLACE VIEW staff_performance AS
SELECT
  au.id as user_id,
  au.name,
  au.role,
  d.name as department,
  COUNT(DISTINCT i.id) as assigned_incidents,
  COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) as resolved_incidents,
  COUNT(CASE WHEN i.status = 'in_progress' THEN 1 END) as in_progress_incidents,
  ROUND(
    100.0 * COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) / NULLIF(COUNT(DISTINCT i.id), 0),
    2
  ) as resolution_rate,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600),
    2
  ) as avg_resolution_hours,
  au.last_login
FROM admin_users au
LEFT JOIN departments d ON au.department_id = d.id
LEFT JOIN incidents i ON au.id = i.assigned_to
WHERE au.is_active = TRUE
GROUP BY au.id, au.name, au.role, d.id, d.name
ORDER BY resolved_incidents DESC;

-- ============================================================================
-- ANALYTICS VIEW: Report Status Distribution
-- ============================================================================

CREATE OR REPLACE VIEW report_status_distribution AS
SELECT
  status,
  COUNT(*) as report_count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage,
  COUNT(DISTINCT incident_id) as linked_incidents,
  AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 3600) as avg_age_hours
FROM reports
GROUP BY status
ORDER BY report_count DESC;

-- ============================================================================
-- ANALYTICS VIEW: Response Time Analysis
-- ============================================================================

CREATE OR REPLACE VIEW response_time_analysis AS
SELECT
  i.category,
  COUNT(*) as incident_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600), 2) as avg_hours,
  ROUND(MIN(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600), 2) as min_hours,
  ROUND(MAX(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600), 2) as max_hours,
  ROUND(
    PERCENTILE_CONT(0.5) WITHIN GROUP (
      ORDER BY EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at)) / 3600
    )::numeric,
    2
  ) as median_hours
FROM incidents i
WHERE i.status = 'resolved'
GROUP BY i.category
ORDER BY avg_hours DESC;

-- ============================================================================
-- ANALYTICS VIEW: Duplicate Detection Summary
-- ============================================================================

CREATE OR REPLACE VIEW duplicate_summary AS
SELECT
  i.category,
  COUNT(*) as incidents_with_duplicates,
  SUM(i.report_count) as total_reports_grouped,
  AVG(i.report_count)::INTEGER as avg_reports_per_incident,
  MAX(i.report_count) as max_reports_in_incident,
  (SUM(i.report_count) - COUNT(*)) as duplicate_reports_prevented
FROM incidents i
WHERE i.report_count > 1
GROUP BY i.category
ORDER BY duplicate_reports_prevented DESC;

-- ============================================================================
-- QUERY: Recent High Priority Incidents
-- ============================================================================

CREATE OR REPLACE VIEW recent_high_priority_incidents AS
SELECT
  i.id,
  i.category,
  i.priority,
  i.status,
  i.report_count,
  d.name as department,
  b.name as barangay,
  au.name as assigned_to,
  i.created_at,
  EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.created_at)) / 3600 as hours_open
FROM incidents i
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN barangays b ON i.barangay_id = b.id
LEFT JOIN admin_users au ON i.assigned_to = au.id
WHERE i.priority IN ('critical', 'high')
  AND i.status IN ('open', 'assigned', 'in_progress')
ORDER BY
  CASE i.priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
  END,
  i.created_at ASC;

-- ============================================================================
-- QUERY: Overdue Incidents (SLA Analysis)
-- ============================================================================

CREATE OR REPLACE VIEW overdue_incidents AS
SELECT
  i.id,
  i.category,
  i.priority,
  d.name as department,
  au.name as assigned_to,
  i.created_at,
  EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.created_at)) / 3600 as hours_open,
  CASE
    WHEN i.priority = 'critical' THEN 24
    WHEN i.priority = 'high' THEN 72
    WHEN i.priority = 'medium' THEN 168
    ELSE 336
  END as sla_hours,
  EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.created_at)) / 3600 >
  CASE
    WHEN i.priority = 'critical' THEN 24
    WHEN i.priority = 'high' THEN 72
    WHEN i.priority = 'medium' THEN 168
    ELSE 336
  END as is_overdue
FROM incidents i
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN admin_users au ON i.assigned_to = au.id
WHERE i.status != 'resolved'
  AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.created_at)) / 3600 >
  CASE
    WHEN i.priority = 'critical' THEN 24
    WHEN i.priority = 'high' THEN 72
    WHEN i.priority = 'medium' THEN 168
    ELSE 336
  END
ORDER BY hours_open DESC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON VIEW dashboard_summary IS 'High-level summary for dashboard';
COMMENT ON VIEW category_distribution IS 'Incidents grouped by category with resolution rates';
COMMENT ON VIEW barangay_performance IS 'Performance metrics by barangay';
COMMENT ON VIEW department_performance IS 'Performance metrics by department';
COMMENT ON VIEW priority_distribution IS 'Incidents by priority level';
COMMENT ON VIEW monthly_trends IS 'Monthly incident and resolution trends';
COMMENT ON VIEW staff_performance IS 'Individual officer performance metrics';
COMMENT ON VIEW report_status_distribution IS 'Distribution of report statuses';
COMMENT ON VIEW response_time_analysis IS 'Average response times by category';
COMMENT ON VIEW duplicate_summary IS 'Summary of duplicate detection effectiveness';
COMMENT ON VIEW recent_high_priority_incidents IS 'Recent critical and high-priority incidents';
COMMENT ON VIEW overdue_incidents IS 'Incidents exceeding SLA times';
