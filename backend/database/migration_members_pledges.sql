-- Migration: Create Members and Pledges tables
-- Date: 2026-01-21
-- Purpose: Track church members (tithers) and their pledges

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_number VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  date_of_birth DATE,
  gender ENUM('male', 'female') DEFAULT NULL,
  marital_status ENUM('single', 'married', 'widowed', 'divorced') DEFAULT NULL,
  occupation VARCHAR(100),
  join_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_member_number (member_number),
  INDEX idx_full_name (full_name),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create pledges table
CREATE TABLE IF NOT EXISTS pledges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  pledge_type VARCHAR(100) NOT NULL COMMENT 'e.g., Building Fund, Mission, Special Project',
  amount_pledged DECIMAL(12,2) NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0.00,
  pledge_date DATE NOT NULL,
  due_date DATE,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  description TEXT,
  recorded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE RESTRICT,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_member_id (member_id),
  INDEX idx_status (status),
  INDEX idx_pledge_date (pledge_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create pledge_payments table to track individual pledge payments
CREATE TABLE IF NOT EXISTS pledge_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pledge_id INT NOT NULL,
  donation_id INT NOT NULL COMMENT 'Links to the actual offering/donation record',
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  reference_number VARCHAR(100),
  recorded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pledge_id) REFERENCES pledges(id) ON DELETE RESTRICT,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE RESTRICT,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_pledge_id (pledge_id),
  INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add some sample members
INSERT INTO members (member_number, full_name, phone, email, join_date, is_active) VALUES
('MEM001', 'David Mensah', '+233244123456', 'david.mensah@email.com', '2020-01-15', TRUE),
('MEM002', 'Grace Owusu', '+233244234567', 'grace.owusu@email.com', '2019-06-20', TRUE),
('MEM003', 'Samuel Agyei', '+233244345678', 'samuel.agyei@email.com', '2021-03-10', TRUE),
('MEM004', 'Patience Boateng', '+233244456789', 'patience.boateng@email.com', '2020-11-05', TRUE),
('MEM005', 'Emmanuel Asante', '+233244567890', 'emmanuel.asante@email.com', '2018-08-22', TRUE);

-- Update existing donations to link some to members (optional - for testing)
-- You can manually update existing donation records to link them to members if needed
