-- Create database
CREATE DATABASE IF NOT EXISTS db_omsets;
USE db_omsets;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    client VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Settings table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES 
('target_bulanan', '25000000'),
('tahun_bulan_aktif', DATE_FORMAT(CURRENT_DATE, '%Y-%m'));

-- Insert sample data
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('staff1', 'staff@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff');

-- Insert sample invoices
INSERT INTO invoices (project_name, client, amount, date, status) VALUES
('Website E-commerce', 'PT Maju Jaya', 7500000, '2026-04-01', 'paid'),
('Mobile App', 'CV Kreatif', 5000000, '2026-04-05', 'paid'),
('Dashboard Admin', 'PT Sejahtera', 4500000, '2026-04-10', 'pending'),
('API Integration', 'Startup Tech', 3000000, '2026-04-15', 'paid'),
('UI/UX Design', 'Agen Digital', 2500000, '2026-04-20', 'pending');