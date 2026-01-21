-- Create offering_types table
CREATE TABLE IF NOT EXISTS offering_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default offering types
INSERT INTO offering_types (name, code, description) VALUES
('Tithes', 'TITHE', 'One-tenth of income given as religious contribution'),
('Freewill Offering', 'FREEWILL', 'Voluntary contributions beyond tithes'),
('Pledges', 'PLEDGE', 'Commitments to give a specific amount'),
('Thanksgiving Offering', 'THANKSGIVING', 'Offering given in gratitude'),
('Offertory (General Offering)', 'OFFERTORY', 'General offerings during service'),
('First Fruits', 'FIRSTFRUIT', 'Offering from first earnings/harvest'),
('Seed', 'SEED', 'Seed offerings with spiritual significance');

-- Alter donations table to add offering_type_id
ALTER TABLE donations 
ADD COLUMN offering_type_id INT AFTER amount,
ADD FOREIGN KEY (offering_type_id) REFERENCES offering_types(id) ON DELETE RESTRICT;

-- Create index on offering_type_id
CREATE INDEX idx_offering_type ON donations(offering_type_id);
