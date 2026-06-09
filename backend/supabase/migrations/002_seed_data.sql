-- VALOR Backend - Seed Data
-- Initial data for Valencia City, Bukidnon barangays and departments

-- ============================================================================
-- BARANGAYS SEED DATA
-- All 31 barangays of Valencia City, Bukidnon
-- Data source: City of Valencia official records
-- ============================================================================

INSERT INTO barangays (name, code, latitude, longitude, area_km2, population) VALUES
-- Urban barangays (City center)
('Poblacion', 'poblacion', 7.9042, 125.0928, 12.5, 40350),
('Lumbo', 'lumbo', 7.8950, 125.0850, 18.9, 18229),
('Batangan', 'batangan', 7.9150, 125.0750, 16.5, 14276),
('Bagontaas', 'bagontaas', 7.9300, 125.1050, 15.3, 12772),

-- Northern barangays
('Lilingayon', 'lilingayon', 7.9500, 125.0800, 14.2, 7216),
('Mailag', 'mailag', 7.9600, 125.0900, 15.8, 7700),
('Lurogan', 'lurogan', 7.9700, 125.1100, 16.1, 9402),
('Nabago', 'nabago', 7.9800, 125.1200, 14.5, 2567),

-- Eastern barangays
('San Carlos', 'san_carlos', 7.9200, 125.1300, 13.8, 4878),
('San Isidro', 'san_isidro', 7.9350, 125.1400, 12.6, 2481),
('Mt. Nebo', 'mt_nebo', 7.9450, 125.1500, 11.9, 3182),
('Bagontaas Extension', 'bagontaas_ext', 7.9550, 125.1600, 14.2, 2000),

-- Sugod area
('Sugod', 'sugod', 7.8850, 125.0950, 13.4, 5782),
('Vintar', 'vintar', 7.8750, 125.0850, 12.8, 4500),

-- Kahapunan-Lumbayao cluster
('Kahapunan', 'kahapunan', 7.9100, 125.0650, 15.2, 6604),
('Lumbayao', 'lumbayao', 7.9000, 125.0550, 14.6, 3872),
('Sinabuagan', 'sinabuagan', 7.8900, 125.0450, 13.9, 2276),

-- Barobo-Tugaya cluster
('Barobo', 'barobo', 7.8800, 125.1200, 12.3, 4117),
('Tugaya', 'tugaya', 7.8700, 125.1100, 13.5, 3500),
('Lourdes', 'lourdes', 7.8650, 125.1000, 11.8, 1955),

-- Tongantongan-Guinoyuran area
('Tongantongan', 'tongantongan', 7.9250, 125.0500, 14.7, 3200),
('Guinoyuran', 'guinoyuran', 7.9350, 125.0400, 15.3, 7268),

-- Southern cluster
('Pinatilan', 'pinatilan', 7.8500, 125.1300, 13.1, 3641),
('Concepcion', 'concepcion', 7.8600, 125.1400, 14.8, 5234),
('Laligan', 'laligan', 7.8700, 125.1500, 15.2, 6616),
('Sinayawan', 'sinayawan', 7.8800, 125.1600, 14.5, 7990),

-- Western barangays
('Maapag', 'maapag', 7.8950, 125.0250, 11.6, 1914),
('Catumbalon', 'catumbalon', 7.9100, 125.0200, 12.2, 2456),
('Banlag', 'banlag', 7.9250, 125.0150, 13.4, 8220),
('Colonia', 'colonia', 7.9400, 125.0050, 12.8, 3260),

-- Southeastern barangay
('Mabuhay', 'mabuhay', 7.8400, 125.1600, 14.1, 3997),
('Dagat-Kidavao', 'dagat_kidavao', 7.8300, 125.1700, 13.7, 5510);

-- ============================================================================
-- DEPARTMENTS SEED DATA
-- Main LGU departments
-- ============================================================================

INSERT INTO departments (name, description, contact_email, contact_phone, is_active) VALUES
('Engineering Office', 'Handles road damage, potholes, and infrastructure issues', 'engineering@valencia.gov.ph', '+63-2-1234-5678', TRUE),
('CENRO (City Environment and Natural Resources Office)', 'Manages environmental issues, flooding, illegal dumping, and garbage', 'cenro@valencia.gov.ph', '+63-2-1234-5679', TRUE),
('Disaster Risk Reduction Office', 'Responds to disasters, flooding, and emergency situations', 'drro@valencia.gov.ph', '+63-2-1234-5680', TRUE),
('Water District', 'Handles water service issues and water supply problems', 'water@valencia.gov.ph', '+63-2-1234-5681', TRUE),
('Public Safety Office', 'Addresses public safety concerns, security issues, and street crimes', 'safety@valencia.gov.ph', '+63-2-1234-5682', TRUE);

-- ============================================================================
-- ADMIN USERS SEED DATA
-- LGU personnel with different roles
-- ============================================================================

INSERT INTO admin_users (email, name, role, department_id, is_active) VALUES
('super.admin@valencia.gov.ph', 'City Administrator', 'super_admin', NULL, TRUE),
('maria.santos@valencia.gov.ph', 'Maria Santos - Engineering Head', 'department_head', (SELECT id FROM departments WHERE name = 'Engineering Office'), TRUE),
('juan.cruz@valencia.gov.ph', 'Juan Cruz - CENRO Head', 'department_head', (SELECT id FROM departments WHERE name = 'CENRO (City Environment and Natural Resources Office)'), TRUE),
('rosa.garcia@valencia.gov.ph', 'Rosa Garcia - DRRO Head', 'department_head', (SELECT id FROM departments WHERE name = 'Disaster Risk Reduction Office'), TRUE),
('jose.reyes@valencia.gov.ph', 'Jose Reyes - Water District Head', 'department_head', (SELECT id FROM departments WHERE name = 'Water District'), TRUE),
('luis.dela.cruz@valencia.gov.ph', 'Luis De La Cruz - Safety Head', 'department_head', (SELECT id FROM departments WHERE name = 'Public Safety Office'), TRUE),
('pedro.lim@valencia.gov.ph', 'Pedro Lim - Engineering Officer 1', 'officer', (SELECT id FROM departments WHERE name = 'Engineering Office'), TRUE),
('anna.williams@valencia.gov.ph', 'Anna Williams - Engineering Officer 2', 'officer', (SELECT id FROM departments WHERE name = 'Engineering Office'), TRUE),
('carlos.gonzales@valencia.gov.ph', 'Carlos Gonzales - CENRO Officer 1', 'officer', (SELECT id FROM departments WHERE name = 'CENRO (City Environment and Natural Resources Office)'), TRUE),
('patricia.morales@valencia.gov.ph', 'Patricia Morales - CENRO Officer 2', 'officer', (SELECT id FROM departments WHERE name = 'CENRO (City Environment and Natural Resources Office)'), TRUE),
('ramon.torres@valencia.gov.ph', 'Ramon Torres - DRRO Officer 1', 'officer', (SELECT id FROM departments WHERE name = 'Disaster Risk Reduction Office'), TRUE),
('diana.santos@valencia.gov.ph', 'Diana Santos - DRRO Officer 2', 'officer', (SELECT id FROM departments WHERE name = 'Disaster Risk Reduction Office'), TRUE),
('manuel.lopez@valencia.gov.ph', 'Manuel Lopez - Water Officer 1', 'officer', (SELECT id FROM departments WHERE name = 'Water District'), TRUE),
('sophia.rodriguez@valencia.gov.ph', 'Sophia Rodriguez - Water Officer 2', 'officer', (SELECT id FROM departments WHERE name = 'Water District'), TRUE),
('francisco.perez@valencia.gov.ph', 'Francisco Perez - Safety Officer 1', 'officer', (SELECT id FROM departments WHERE name = 'Public Safety Office'), TRUE),
('margaret.brown@valencia.gov.ph', 'Margaret Brown - Safety Officer 2', 'officer', (SELECT id FROM departments WHERE name = 'Public Safety Office'), TRUE);

-- Update department heads
UPDATE departments SET head_id = (SELECT id FROM admin_users WHERE email = 'maria.santos@valencia.gov.ph') WHERE name = 'Engineering Office';
UPDATE departments SET head_id = (SELECT id FROM admin_users WHERE email = 'juan.cruz@valencia.gov.ph') WHERE name = 'CENRO (City Environment and Natural Resources Office)';
UPDATE departments SET head_id = (SELECT id FROM admin_users WHERE email = 'rosa.garcia@valencia.gov.ph') WHERE name = 'Disaster Risk Reduction Office';
UPDATE departments SET head_id = (SELECT id FROM admin_users WHERE email = 'jose.reyes@valencia.gov.ph') WHERE name = 'Water District';
UPDATE departments SET head_id = (SELECT id FROM admin_users WHERE email = 'luis.dela.cruz@valencia.gov.ph') WHERE name = 'Public Safety Office';

-- ============================================================================
-- SAMPLE REPORTS FOR HACKATHON DEMO
-- Mix of statuses and priorities to showcase system capabilities
-- ============================================================================

-- HIGH PRIORITY - INFRASTRUCTURE ISSUES
INSERT INTO reports (title, description, photo_url, latitude, longitude, contact_name, contact_number, contact_email, category, priority, department_id, barangay_id, status) VALUES
('Large pothole on Main Street', 'Dangerous pothole near market affecting vehicle traffic and pedestrians', 'https://via.placeholder.com/400x300?text=Pothole', 7.9042, 125.0928, 'John Dela Cruz', '+63-905-1234567', 'john@example.com', 'Infrastructure', 'high', (SELECT id FROM departments WHERE name = 'Engineering Office'), (SELECT id FROM barangays WHERE code = 'poblacion'), 'assigned'),
('Bridge structural damage', 'Visible cracks and deterioration on Lumbo Bridge, requires immediate inspection', 'https://via.placeholder.com/400x300?text=Bridge', 7.8950, 125.0850, 'Maria Garcia', '+63-917-9876543', 'maria@example.com', 'Infrastructure', 'high', (SELECT id FROM departments WHERE name = 'Engineering Office'), (SELECT id FROM barangays WHERE code = 'lumbo'), 'in_progress'),
('Road flooding in Bagontaas', 'Flooded road making it impassable, water meter high after recent rains', 'https://via.placeholder.com/400x300?text=Flood', 7.9300, 125.1050, 'Robert Santos', '+63-920-5555555', 'robert@example.com', 'Drainage', 'high', (SELECT id FROM departments WHERE name = 'CENRO (City Environment and Natural Resources Office)'), (SELECT id FROM barangays WHERE code = 'bagontaas'), 'submitted');

-- MEDIUM PRIORITY - ENVIRONMENTAL ISSUES
INSERT INTO reports (title, description, photo_url, latitude, longitude, contact_name, contact_number, contact_email, category, priority, department_id, barangay_id, status) VALUES
('Illegal garbage dumping', 'Unauthorized dumping site behind Lilingayon market, attracting rats and insects', 'https://via.placeholder.com/400x300?text=Garbage', 7.9500, 125.0800, 'Ana Reyes', '+63-922-3333333', 'ana.reyes@example.com', 'Environmental', 'medium', (SELECT id FROM departments WHERE name = 'CENRO (City Environment and Natural Resources Office)'), (SELECT id FROM barangays WHERE code = 'lilingayon'), 'assigned'),
('Blocked drainage canal', 'Clogged canal with debris and sediment accumulation in Mailag area', 'https://via.placeholder.com/400x300?text=Drainage', 7.9600, 125.0900, 'Carlos Mendoza', '+63-918-4444444', 'carlos.m@example.com', 'Drainage', 'medium', (SELECT id FROM departments WHERE name = 'CENRO (City Environment and Natural Resources Office)'), (SELECT id FROM barangays WHERE code = 'mailag'), 'assigned'),
('Water contamination complaint', 'Residents reporting discolored water supply in San Carlos area', 'https://via.placeholder.com/400x300?text=Water', 7.9200, 125.1300, 'Patricia Gonzales', '+63-916-6666666', 'patricia.g@example.com', 'Water Quality', 'medium', (SELECT id FROM departments WHERE name = 'Water District'), (SELECT id FROM barangays WHERE code = 'san_carlos'), 'submitted');

-- RESOLVED/COMPLETED REPORTS
INSERT INTO reports (title, description, photo_url, latitude, longitude, contact_name, contact_number, contact_email, category, priority, department_id, barangay_id, status, ai_summary) VALUES
('Street lamp repair completed', 'Defective street lamp on Rizal Avenue has been fixed and is now operational', 'https://via.placeholder.com/400x300?text=Streetlamp', 7.9150, 125.0750, 'Elena Torres', '+63-909-7777777', 'elena@example.com', 'Infrastructure', 'low', (SELECT id FROM departments WHERE name = 'Engineering Office'), (SELECT id FROM barangays WHERE code = 'batangan'), 'resolved', 'Street lighting repaired in Batangan area. Lamp replaced and tested working.'),
('Stray animal relocation successful', 'Wild dogs that were threatening residents have been safely relocated by Animal Control', 'https://via.placeholder.com/400x300?text=Animals', 7.9400, 125.1050, 'Miguel Lopez', '+63-921-8888888', 'miguel.l@example.com', 'Public Safety', 'medium', (SELECT id FROM departments WHERE name = 'Public Safety Office'), (SELECT id FROM barangays WHERE code = 'colonia'), 'resolved', 'Animal control operation completed successfully in Colonia barangay.'),
('Pothole filled and paved', 'The reported pothole on Mabuhay Street has been patched and resurfaced', 'https://via.placeholder.com/400x300?text=Road', 7.8400, 125.1600, 'Rosa Villanueva', '+63-925-2222222', 'rosa.v@example.com', 'Infrastructure', 'medium', (SELECT id FROM departments WHERE name = 'Engineering Office'), (SELECT id FROM barangays WHERE code = 'mabuhay'), 'resolved', 'Road maintenance completed in Mabuhay. Pothole filled and sealed.');

-- LOW PRIORITY - MAINTENANCE ISSUES
INSERT INTO reports (title, description, photo_url, latitude, longitude, contact_name, contact_number, contact_email, category, priority, department_id, barangay_id, status) VALUES
('Park maintenance needed', 'Municipal park in Guinoyuran needs grass cutting and bench repairs', 'https://via.placeholder.com/400x300?text=Park', 7.9350, 125.0400, 'Fernando Reyes', '+63-910-9999999', 'fernando.r@example.com', 'Maintenance', 'low', (SELECT id FROM departments WHERE name = 'CENRO (City Environment and Natural Resources Office)'), (SELECT id FROM barangays WHERE code = 'guinoyuran'), 'submitted'),
('Public restroom cleaning', 'Municipal restroom at Barobo plaza needs urgent cleaning and repairs', 'https://via.placeholder.com/400x300?text=Restroom', 7.8800, 125.1200, 'Linda Santos', '+63-923-1111111', 'linda.s@example.com', 'Maintenance', 'low', (SELECT id FROM departments WHERE name = 'Engineering Office'), (SELECT id FROM barangays WHERE code = 'barobo'), 'submitted');
