-- Create database
CREATE DATABASE IF NOT EXISTS db_omsets;
USE db_omsets;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table (Old)
CREATE TABLE IF NOT EXISTS invoices (
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
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL
);

-- Projects table (New for Freelance Dashboard)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    client VARCHAR(100) NOT NULL,
    revenue DECIMAL(15,2) NOT NULL,
    hours INT DEFAULT 0,
    status ENUM('completed', 'pending', 'on-hold') DEFAULT 'pending',
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Achievements table (New)
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY user_achievement (user_id, achievement_name)
);

-- Insert default settings
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
('target_bulanan', '25000000'),
('tahun_bulan_aktif', DATE_FORMAT(CURRENT_DATE, '%Y-%m'));

-- Insert default system users
INSERT IGNORE INTO users (id, username, email, password, role) VALUES 
(1, 'admin', 'admin@example.com', '$2y$10$LOBjQT9QPtUMpSuKGSt9UuB5aHg0kH04NxoFciX/EViTmoGLtYzH2', 'admin'),
(2, 'staff1', 'staff@example.com', '$2y$10$juHteGmIthmdptKEtkgIHejTe8iv3CTmee5yeeEvkXj6WClWmpVt6', 'staff');