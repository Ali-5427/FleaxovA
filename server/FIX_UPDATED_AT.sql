-- 🚨 RUN THIS TO FIX 'updated_at' ERROR 🚨

-- The error 'record "new" has no field "updated_at"' means:
-- A trigger is trying to set 'updated_at', but the 'users' table DOES NOT HAVE that column.

-- OPTION 1: Add the column (Recommended)
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- OPTION 2: If you don't want the column, drop the trigger (Only run if you skip Option 1)
-- DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- For now, RUN OPTION 1 below:
