-- VALOR Backend - Row Level Security (RLS) Policies
-- Comprehensive authorization and data access control

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE barangays ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Get current user's role from admin_users table
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role
  FROM admin_users
  WHERE email = auth.email();
  RETURN COALESCE(v_role, 'citizen');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current user's department
CREATE OR REPLACE FUNCTION get_current_user_department()
RETURNS UUID AS $$
DECLARE
  v_dept_id UUID;
BEGIN
  SELECT department_id INTO v_dept_id
  FROM admin_users
  WHERE email = auth.email();
  RETURN v_dept_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current admin user's ID
CREATE OR REPLACE FUNCTION get_current_admin_user_id()
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM admin_users
  WHERE email = auth.email();
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.email() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is department head
CREATE OR REPLACE FUNCTION is_department_head()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.email() AND role = 'department_head'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is LGU officer
CREATE OR REPLACE FUNCTION is_lgu_officer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.email() AND role IN ('officer', 'department_head', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- BARANGAYS - Public read access, admin write access
-- ============================================================================

CREATE POLICY "barangays_public_read" ON barangays
FOR SELECT
USING (TRUE);

CREATE POLICY "barangays_admin_write" ON barangays
FOR INSERT
WITH CHECK (is_super_admin());

CREATE POLICY "barangays_admin_update" ON barangays
FOR UPDATE
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "barangays_admin_delete" ON barangays
FOR DELETE
USING (is_super_admin());

-- ============================================================================
-- DEPARTMENTS - Public read access, admin write access
-- ============================================================================

CREATE POLICY "departments_public_read" ON departments
FOR SELECT
USING (TRUE);

CREATE POLICY "departments_admin_write" ON departments
FOR INSERT
WITH CHECK (is_super_admin());

CREATE POLICY "departments_admin_update" ON departments
FOR UPDATE
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "departments_admin_delete" ON departments
FOR DELETE
USING (is_super_admin());

-- ============================================================================
-- ADMIN_USERS - Self read, super admin full access
-- ============================================================================

CREATE POLICY "admin_users_self_read" ON admin_users
FOR SELECT
USING (
  email = auth.email()
  OR is_super_admin()
);

CREATE POLICY "admin_users_admin_insert" ON admin_users
FOR INSERT
WITH CHECK (is_super_admin());

CREATE POLICY "admin_users_admin_update" ON admin_users
FOR UPDATE
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "admin_users_admin_delete" ON admin_users
FOR DELETE
USING (is_super_admin());

-- ============================================================================
-- INCIDENTS - Graduated access based on user role
-- ============================================================================

-- Super admin: full access
CREATE POLICY "incidents_admin_all" ON incidents
FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- Department heads and officers: can view all incidents
CREATE POLICY "incidents_lgu_read" ON incidents
FOR SELECT
USING (is_lgu_officer());

-- Department heads and officers: can update incidents in their department
CREATE POLICY "incidents_lgu_update_own_dept" ON incidents
FOR UPDATE
USING (
  is_lgu_officer()
  AND (
    department_id = get_current_user_department()
    OR assigned_to = get_current_admin_user_id()
  )
)
WITH CHECK (
  is_lgu_officer()
  AND (
    department_id = get_current_user_department()
    OR assigned_to = get_current_admin_user_id()
  )
);

-- LGU can create incidents (through edge functions)
CREATE POLICY "incidents_lgu_create" ON incidents
FOR INSERT
WITH CHECK (is_lgu_officer());

-- Citizens cannot directly access incidents
-- (they interact through reports)

-- ============================================================================
-- REPORTS - Citizens and LGU access
-- ============================================================================

-- Citizens: can create reports
CREATE POLICY "reports_citizen_create" ON reports
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
);

-- Citizens: can view all public reports
CREATE POLICY "reports_public_read" ON reports
FOR SELECT
USING (TRUE);

-- Citizens: can view their own reports (optional feature)
CREATE POLICY "reports_citizen_own_read" ON reports
FOR SELECT
USING (
  contact_email = auth.email()
);

-- LGU officers: can view all reports
CREATE POLICY "reports_lgu_read" ON reports
FOR SELECT
USING (is_lgu_officer());

-- LGU officers: can update reports
CREATE POLICY "reports_lgu_update" ON reports
FOR UPDATE
USING (is_lgu_officer())
WITH CHECK (is_lgu_officer());

-- Super admin: full access
CREATE POLICY "reports_admin_all" ON reports
FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- ============================================================================
-- INCIDENT_UPDATES - LGU officers can create updates
-- ============================================================================

-- LGU officers: can view all incident updates
CREATE POLICY "incident_updates_lgu_read" ON incident_updates
FOR SELECT
USING (is_lgu_officer());

-- LGU officers: can create incident updates
CREATE POLICY "incident_updates_lgu_create" ON incident_updates
FOR INSERT
WITH CHECK (is_lgu_officer());

-- Users can view updates for incidents they have access to
CREATE POLICY "incident_updates_view_by_incident" ON incident_updates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM incidents i
    WHERE i.id = incident_updates.incident_id
    AND (
      is_lgu_officer()
      OR i.department_id = get_current_user_department()
    )
  )
);

-- Super admin: full access
CREATE POLICY "incident_updates_admin_all" ON incident_updates
FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- ============================================================================
-- AUDIT_LOGS - Read access for admins only
-- ============================================================================

CREATE POLICY "audit_logs_admin_read" ON audit_logs
FOR SELECT
USING (is_super_admin() OR is_department_head());

CREATE POLICY "audit_logs_admin_insert" ON audit_logs
FOR INSERT
WITH CHECK (is_super_admin() OR is_department_head());

-- ============================================================================
-- MATERIALIZED VIEWS - Public read access
-- ============================================================================

-- Note: RLS is not directly applied to materialized views, but data access
-- is controlled through the underlying tables that feed the views.
-- Ensure views only return data users are authorized to see by using
-- subqueries with RLS-protected tables.

-- ============================================================================
-- AUDIT TRIGGER for tracking changes
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_action audit_action;
  v_user_id UUID;
BEGIN
  v_user_id := get_current_admin_user_id();

  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'deleted';
  END IF;

  INSERT INTO audit_logs (
    action,
    table_name,
    record_id,
    user_id,
    old_values,
    new_values,
    description,
    created_at
  ) VALUES (
    v_action,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_user_id,
    to_jsonb(OLD),
    to_jsonb(NEW),
    TG_TABLE_NAME || ' ' || v_action || ' by admin',
    CURRENT_TIMESTAMP
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to critical tables
CREATE TRIGGER incidents_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON incidents
FOR EACH ROW
EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER reports_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON reports
FOR EACH ROW
EXECUTE FUNCTION audit_log_trigger();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION get_current_user_role() IS 'Returns the role of the currently authenticated user';
COMMENT ON FUNCTION get_current_user_department() IS 'Returns the department_id of the currently authenticated user';
COMMENT ON FUNCTION is_super_admin() IS 'Checks if the current user has super_admin role';
COMMENT ON FUNCTION is_department_head() IS 'Checks if the current user has department_head role';
COMMENT ON FUNCTION is_lgu_officer() IS 'Checks if the current user is LGU personnel (officer, head, or admin)';
