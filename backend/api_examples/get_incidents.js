/**
 * VALOR Backend - Get Incidents Examples
 *
 * Examples for retrieving incidents with various filters and queries
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

/**
 * Helper function to make API requests
 */
async function fetchAPI(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${queryString ? '?' + queryString : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all open incidents
 */
async function getOpenIncidents() {
  console.log('Fetching open incidents...');
  const incidents = await fetchAPI('incidents', {
    'status': 'eq.open',
    'order': 'created_at.desc'
  });

  console.log(`Found ${incidents.length} open incidents:`);
  incidents.forEach(incident => {
    console.log(`  - ${incident.category} (${incident.priority}): ${incident.report_count} reports`);
  });

  return incidents;
}

/**
 * Get critical and high priority incidents
 */
async function getCriticalIncidents() {
  console.log('Fetching critical incidents...');
  const incidents = await fetchAPI('recent_high_priority_incidents');

  console.log(`Found ${incidents.length} critical incidents:`);
  incidents.forEach(incident => {
    const hoursOpen = Math.round(incident.hours_open);
    console.log(`  - ${incident.category} (${incident.priority}): Open ${hoursOpen} hours, ${incident.report_count} reports`);
    if (incident.assigned_to) {
      console.log(`    Assigned to: ${incident.assigned_to}`);
    }
  });

  return incidents;
}

/**
 * Get overdue incidents (exceeding SLA)
 */
async function getOverdueIncidents() {
  console.log('Fetching overdue incidents...');
  const incidents = await fetchAPI('overdue_incidents');

  console.log(`Found ${incidents.length} overdue incidents:`);
  incidents.forEach(incident => {
    const hoursOver = Math.round(incident.hours_open - incident.sla_hours);
    console.log(`  - ${incident.category} (${incident.priority}): ${hoursOver} hours overdue (SLA: ${incident.sla_hours}h)`);
  });

  return incidents;
}

/**
 * Get incidents by category
 */
async function getIncidentsByCategory(category) {
  console.log(`Fetching ${category} incidents...`);
  const incidents = await fetchAPI('incidents', {
    'category': `eq.${category}`,
    'status': 'neq.closed',
    'order': 'created_at.desc'
  });

  console.log(`Found ${incidents.length} ${category} incidents:`);
  incidents.forEach(incident => {
    console.log(`  - ${incident.priority}: ${incident.report_count} reports (${incident.status})`);
  });

  return incidents;
}

/**
 * Get incidents by department
 */
async function getIncidentsByDepartment(departmentId) {
  console.log(`Fetching incidents for department...`);
  const incidents = await fetchAPI('incidents', {
    'department_id': `eq.${departmentId}`,
    'status': 'neq.closed',
    'order': 'priority.desc,created_at.desc'
  });

  console.log(`Found ${incidents.length} incidents for this department:`);
  incidents.forEach(incident => {
    console.log(`  - ${incident.category} (${incident.priority}): ${incident.report_count} reports`);
  });

  return incidents;
}

/**
 * Get department performance metrics
 */
async function getDepartmentPerformance() {
  console.log('Fetching department performance...');
  const performance = await fetchAPI('department_performance');

  console.log('\nDepartment Performance:');
  performance.forEach(dept => {
    console.log(`\n${dept.department}:`);
    console.log(`  Assigned: ${dept.assigned_incidents} | Resolved: ${dept.resolved_incidents} | Open: ${dept.open_incidents}`);
    console.log(`  Staff: ${dept.assigned_officers} | Avg Resolution: ${dept.avg_resolution_hours}h | Rate: ${dept.resolution_rate}%`);
  });

  return performance;
}

/**
 * Get dashboard summary
 */
async function getDashboardSummary() {
  console.log('Fetching dashboard summary...');
  const summary = await fetchAPI('dashboard_summary');

  const data = summary[0];
  console.log('\n📊 Dashboard Summary:');
  console.log(`  Open Incidents: ${data.open_incidents}`);
  console.log(`  Resolved Incidents: ${data.resolved_incidents}`);
  console.log(`  Pending Reports: ${data.pending_reports}`);
  console.log(`  Total Reports: ${data.total_reports}`);
  console.log(`  Active Staff: ${data.active_staff}`);
  console.log(`  Active Departments: ${data.active_departments}`);

  return data;
}

/**
 * Get category distribution
 */
async function getCategoryDistribution() {
  console.log('Fetching category distribution...');
  const distribution = await fetchAPI('category_distribution');

  console.log('\n📈 Category Distribution:');
  distribution.forEach(cat => {
    const total = cat.incident_count;
    const resolved = cat.resolved_count;
    const rate = Math.round(cat.resolution_rate);
    console.log(`  ${cat.category}: ${total} incidents (${resolved} resolved, ${rate}% rate)`);
  });

  return distribution;
}

/**
 * Get monthly trends
 */
async function getMonthlyTrends() {
  console.log('Fetching monthly trends...');
  const trends = await fetchAPI('monthly_trends', {
    'order': 'month.desc',
    'limit': '6'
  });

  console.log('\n📅 Monthly Trends (last 6 months):');
  trends.forEach(month => {
    const monthStr = new Date(month.month).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    console.log(`  ${monthStr}:`);
    console.log(`    Created: ${month.incidents_created} | Resolved: ${month.incidents_resolved} | Total Reports: ${month.total_reports}`);
    console.log(`    Avg Resolution: ${month.avg_resolution_hours}h`);
  });

  return trends;
}

/**
 * Get staff performance
 */
async function getStaffPerformance() {
  console.log('Fetching staff performance...');
  const staff = await fetchAPI('staff_performance', {
    'order': 'resolved_incidents.desc'
  });

  console.log('\n👥 Staff Performance:');
  staff.slice(0, 10).forEach(officer => {
    const rate = officer.resolution_rate || 0;
    console.log(`  ${officer.name} (${officer.role}):`);
    console.log(`    Assigned: ${officer.assigned_incidents} | Resolved: ${officer.resolved_incidents} | Rate: ${rate}%`);
  });

  return staff;
}

/**
 * Get incident details with all related data
 */
async function getIncidentDetails(incidentId) {
  console.log(`Fetching incident ${incidentId}...`);

  // Get incident
  const incidents = await fetchAPI('incidents', {
    'id': `eq.${incidentId}`
  });

  if (incidents.length === 0) {
    console.log('Incident not found');
    return null;
  }

  const incident = incidents[0];

  // Get related reports
  const reports = await fetchAPI('reports', {
    'incident_id': `eq.${incidentId}`,
    'select': 'id,title,status,created_at,contact_name'
  });

  // Get updates
  const updates = await fetchAPI('incident_updates', {
    'incident_id': `eq.${incidentId}`,
    'order': 'created_at.desc'
  });

  console.log('\n📋 Incident Details:');
  console.log(`  Category: ${incident.category}`);
  console.log(`  Priority: ${incident.priority}`);
  console.log(`  Status: ${incident.status}`);
  console.log(`  Reports: ${incident.report_count}`);
  console.log(`  Created: ${new Date(incident.created_at).toLocaleString()}`);

  if (reports.length > 0) {
    console.log(`\n  Reports (${reports.length}):`);
    reports.forEach(report => {
      console.log(`    - ${report.title} (${report.status})`);
    });
  }

  if (updates.length > 0) {
    console.log(`\n  Updates (${updates.length}):`);
    updates.slice(0, 3).forEach(update => {
      console.log(`    - ${update.update_message.substring(0, 50)}...`);
    });
  }

  return { incident, reports, updates };
}

/**
 * Run examples
 */
async function main() {
  try {
    // Example 1: Dashboard overview
    await getDashboardSummary();

    // Example 2: Get critical incidents
    console.log('\n---\n');
    await getCriticalIncidents();

    // Example 3: Department performance
    console.log('\n---\n');
    await getDepartmentPerformance();

    // Example 4: Category distribution
    console.log('\n---\n');
    await getCategoryDistribution();

    // Example 5: Monthly trends
    console.log('\n---\n');
    await getMonthlyTrends();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  getOpenIncidents,
  getCriticalIncidents,
  getOverdueIncidents,
  getIncidentsByCategory,
  getIncidentsByDepartment,
  getDepartmentPerformance,
  getDashboardSummary,
  getCategoryDistribution,
  getMonthlyTrends,
  getStaffPerformance,
  getIncidentDetails
};
