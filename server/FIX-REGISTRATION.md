# 🛠️ URGENT: Fix Email Confirmation Settings in Supabase

## ⚠️ CRITICAL STEP - Disable Email Confirmation

To fix the registration error, you MUST disable email confirmation in Supabase:

### Steps:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"Authentication"** in the left sidebar
4. Click **"Providers"** tab
5. Scroll down to **"Email"**
6. Find the option **"Confirm email"** or **"Enable email confirmations"**
7. **TOGGLE IT OFF** / **DISABLE IT**
8. Click **"Save"**

### Why?
By default, Supabase requires email confirmation before users can sign in. Since you're building a demo/MVP, disabling this allows immediate registration and login.

---

## Next: Restart Your Server

After disabling email confirmation in Supabase, restart your backend server:

```bash
cd server
# Kill any existing node processes
taskkill /F /IM node.exe

# Start the server
npm run dev
```

Or if that doesn't work:
```bash
node src/server.js
```

---

## ✅ What I've Fixed in the Code

1. **Role Mapping**: Changed 'student' → 'freelancer' to match your schema
2. **Database Schema**: Removed 'name' from users table (it belongs in profiles)
3. **Profile Creation**: Automatically creates a profile with full_name
4. **Wallet Creation**: Automatically creates a wallet for new users
5. **Better Error Logging**: Added detailed console logs to debug issues

---

## 🧪 Test Registration

Once you've disabled email confirmation and restarted the server:

1. Go to your frontend (http://localhost:5173 or wherever it's running)
2. Click "Sign Up"
3. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Role: Choose either option
4. Click "Sign up"

**Expected Result**: Immediate login and redirect to home page ✅

---

## 🔍 If Still Not Working

Check the browser console (F12) and server terminal for error messages. The detailed logs will show exactly what's failing.

Common issues:
- ❌ Email confirmation still enabled in Supabase
- ❌ CORS errors (server not running)
- ❌ Wrong API URL in frontend
- ❌ Database tables not created

---

## 📱 Alternative: Use Service Role Key

If you can't disable email confirmation, use the SERVICE ROLE key instead of ANON key in your .env:

```env
# Use this instead of SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

The service role key bypasses Row Level Security and email confirmation requirements.
