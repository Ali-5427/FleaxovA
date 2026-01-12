# Supabase Connection Setup for FleaxovA

## ✅ Current Status
- **Supabase client is connected successfully!**
- **Environment variables are configured correctly**
- **Authentication is accessible**

## 📋 Next Steps: Set Up Database Schema

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your FleaxovA project

### Step 2: Run the Database Schema
1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the file `database-schema.sql` from this directory
4. Copy the entire content
5. Paste it into the SQL Editor in Supabase
6. Click **"Run"** or press `Ctrl+Enter` to execute

This will create all necessary tables:
- ✅ users
- ✅ profiles
- ✅ services
- ✅ jobs
- ✅ applications
- ✅ orders
- ✅ reviews
- ✅ messages
- ✅ notifications
- ✅ wallets
- ✅ transactions

### Step 3: Verify Database Setup
After running the schema, you can verify it worked by running:
```bash
node check-database.js
```

You should see all tables marked with ✅

### Step 4: Configure Authentication (Optional)
1. In Supabase dashboard, go to **"Authentication"** → **"Providers"**
2. Enable the providers you want:
   - Email (already enabled by default)
   - Google OAuth
   - GitHub OAuth
3. Configure redirect URLs in **"URL Configuration"**:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: Add your frontend URLs

### Step 5: Test the Server
Once the database is set up, restart your server:
```bash
npm run dev
```

You should see:
```
✅ Supabase connected successfully!
FleaxovA Server running in development mode on port 5000
```

## 🔑 Environment Variables Reference

Your `.env` file should contain:
```env
# Supabase Configuration
SUPABASE_URL=https://dzrmttxneljxdngmbacq.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

## 🧪 Testing Scripts

We've created several test scripts for you:

1. **Test Supabase Connection**
   ```bash
   node test-supabase.js
   ```

2. **Check Database Tables**
   ```bash
   node check-database.js
   ```

## 📚 Database Schema Overview

### Core Tables
- **users**: User accounts (extends Supabase Auth)
- **profiles**: User profile information
- **wallets**: User wallet balances

### Service Tables
- **services**: Freelancer services/gigs
- **reviews**: Service and order reviews

### Job Tables
- **jobs**: Client job postings
- **applications**: Freelancer applications to jobs

### Transaction Tables
- **orders**: Orders for services or jobs
- **transactions**: Financial transactions

### Communication Tables
- **messages**: Direct messages between users
- **notifications**: User notifications

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Public read access for services and jobs
- ✅ Secure authentication with Supabase Auth
- ✅ UUID-based primary keys

## 🚀 What's Next?

After setting up the database:
1. Test the API endpoints
2. Connect your frontend to the backend
3. Test user registration and login
4. Create sample data for testing

## 📞 Troubleshooting

### Connection Issues
- Verify your Supabase URL and keys in `.env`
- Check if your IP is allowed in Supabase project settings
- Ensure you're using the correct project

### Database Issues
- Make sure the SQL schema ran without errors
- Check the Supabase logs for any error messages
- Verify RLS policies are not blocking your queries

### Port Already in Use
If port 5000 is already in use, either:
- Stop the process using port 5000
- Or change the PORT in your `.env` file

---

**Need Help?** Check the Supabase documentation at [https://supabase.com/docs](https://supabase.com/docs)
