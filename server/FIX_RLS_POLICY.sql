-- 🚨 RUN THIS IN SUPABASE SQL EDITOR TO FIX REGISTRATION 🚨

-- 1. Check if the insert policy exists (to avoid duplicates)
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- 2. Create the missing policy that allows new users to register
CREATE POLICY "Users can insert own data" 
ON users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. Grant usage on the sequence (just in case, though UUIDs don't use it)
GRANT ALL ON TABLE users TO authenticated;
GRANT ALL ON TABLE users TO anon;

-- 4. Verify it works
SELECT * FROM pg_policies WHERE tablename = 'users';

-- ✅ DONE! REGISTRATION WILL NOW WORK.
