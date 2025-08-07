-- Migration script for admin dashboard enhancements
-- Run this after updating the Prisma schema

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

-- Add response time and success tracking to api_usage
ALTER TABLE api_usage
ADD COLUMN IF NOT EXISTS "responseTime" INTEGER,
ADD COLUMN IF NOT EXISTS success BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "errorMessage" TEXT;

-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id TEXT PRIMARY KEY,
    "metricType" TEXT NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additionalData" JSONB
);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    activity TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    timestamp TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create stripe_webhooks table
CREATE TABLE IF NOT EXISTS stripe_webhooks (
    id TEXT PRIMARY KEY,
    "stripeEventId" TEXT UNIQUE NOT NULL,
    "eventType" TEXT NOT NULL,
    processed BOOLEAN DEFAULT false,
    data JSONB NOT NULL,
    "customerId" TEXT,
    "subscriptionId" TEXT,
    amount INTEGER,
    currency TEXT,
    status TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id TEXT PRIMARY KEY,
    level TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    "userId" TEXT,
    timestamp TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity("userId");
CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON user_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_type_timestamp ON system_metrics("metricType", timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_level_timestamp ON system_logs(level, timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_service_timestamp ON system_logs(service, timestamp);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_event_type ON stripe_webhooks("eventType");
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_customer_id ON stripe_webhooks("customerId");
CREATE INDEX IF NOT EXISTS idx_api_usage_success ON api_usage(success);
CREATE INDEX IF NOT EXISTS idx_api_usage_response_time ON api_usage("responseTime");
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users("isAdmin");

-- Insert sample system metrics (optional)
INSERT INTO system_metrics (id, "metricType", value, unit, timestamp) VALUES
('metric_cpu_1', 'cpu_percentage', 35.5, 'percentage', CURRENT_TIMESTAMP),
('metric_memory_1', 'memory_percentage', 67.2, 'percentage', CURRENT_TIMESTAMP),
('metric_disk_1', 'disk_percentage', 45.8, 'percentage', CURRENT_TIMESTAMP);

-- Insert initial system log
INSERT INTO system_logs (id, level, service, message, timestamp) VALUES
('log_init_1', 'info', 'admin', 'Admin dashboard schema migration completed', CURRENT_TIMESTAMP);

-- Update existing users to have proper admin status (update this as needed)
-- Uncomment and modify the email below to make yourself an admin
-- UPDATE users SET "isAdmin" = true WHERE email = 'your-admin-email@example.com';

COMMIT;
