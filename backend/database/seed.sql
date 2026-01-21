-- Church Finance Management System - Sample Data

USE church_finance;

-- Insert default users
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin User', 'admin@church.local', '$2a$10$rQ3qO7yJ7Z5J5X5Z5X5Z5uZKjH5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5', 'admin', '1234567890'),
('Accountant User', 'accountant@church.local', '$2a$10$rQ3qO7yJ7Z5J5X5Z5X5Z5uZKjH5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5', 'accountant', '0987654321'),
('Pastor John', 'pastor@church.local', '$2a$10$rQ3qO7yJ7Z5J5X5Z5X5Z5uZKjH5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5', 'pastor', '5551234567'),
('John Doe', 'john@member.local', '$2a$10$rQ3qO7yJ7Z5J5X5Z5X5Z5uZKjH5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5', 'member', '1112223333'),
('Jane Smith', 'jane@member.local', '$2a$10$rQ3qO7yJ7Z5J5X5Z5X5Z5uZKjH5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5', 'member', '4445556666');

-- Note: All passwords are 'password' hashed with bcrypt
-- Insert sample donations
INSERT INTO donations (member_id, amount, donation_type, description, donation_date, reference_number, payment_method, recorded_by) VALUES
(4, 500.00, 'tithe', 'Monthly tithe', '2026-01-15 10:00:00', 'DON-001', 'cash', 2),
(5, 200.00, 'offering', 'Sunday offering', '2026-01-14 09:00:00', 'DON-002', 'online', 2),
(4, 1000.00, 'special', 'Building fund', '2026-01-10 11:00:00', 'DON-003', 'check', 2);

-- Insert sample expenses
INSERT INTO expenses (category, description, amount, expense_date, vendor, reference_number, status, approved_by) VALUES
('utilities', 'Electricity bill for January', 350.00, '2026-01-05', 'Power Company', 'EXP-001', 'approved', 1),
('maintenance', 'Church building repairs', 800.00, '2026-01-12', 'ABC Repairs', 'EXP-002', 'approved', 1),
('programs', 'Youth retreat supplies', 450.00, '2026-01-18', 'Supply Store', 'EXP-003', 'pending', NULL);

-- Insert sample budgets
INSERT INTO budgets (category, allocated_amount, start_date, end_date, description, created_by) VALUES
('utilities', 1000.00, '2026-01-01', '2026-01-31', 'Monthly utilities budget', 1),
('maintenance', 500.00, '2026-01-01', '2026-01-31', 'Building maintenance budget', 1),
('programs', 2000.00, '2026-01-01', '2026-01-31', 'Church programs and events', 1);
