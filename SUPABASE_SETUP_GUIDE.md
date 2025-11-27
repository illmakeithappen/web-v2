# Supabase Setup Guide for web-v2

This guide will walk you through setting up Supabase for your web-v2 project.

**Estimated Time**: 30-45 minutes

---

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Go to Supabase
Visit: https://supabase.com

### 1.2 Sign Up / Login
- Click "Start your project"
- Sign in with GitHub (recommended) or email

### 1.3 Create New Project
- Click "New Project"
- **Organization**: Select or create organization
- **Project Name**: `gitthub-web-v2`
- **Database Password**: Generate strong password (SAVE THIS!)
- **Region**: `Europe West (eu-west-1)` or closest to your users
- **Pricing Plan**: Start with "Free" (you can upgrade later)
- Click "Create new project"

**⏱️ Wait 2-3 minutes** for project to provision.

---

## Step 2: Get API Credentials (2 minutes)

### 2.1 Navigate to Settings
- In your Supabase project dashboard
- Click "Settings" (gear icon) in the left sidebar
- Click "API" under "Project Settings"

### 2.2 Copy Credentials
You'll need these three values:

1. **Project URL**
   - Found under "Project URL"
   - Format: `https://your-project-id.supabase.co`
   - Copy this to notepad

2. **Anon (public) Key**
   - Found under "Project API keys" → "anon" "public"
   - This is safe to expose in frontend
   - Copy this to notepad

3. **Service Role Key** (optional for now)
   - Found under "Project API keys" → "service_role"
   - ⚠️ **KEEP SECRET** - only use in backend/Vercel functions
   - Copy this to notepad

---

## Step 3: Apply Database Schema (10 minutes)

### 3.1 Open SQL Editor
- In Supabase dashboard, click "SQL Editor" in left sidebar
- Click "New query"

### 3.2 Run Schema Migration
Copy and paste the following SQL (run in order):

#### Part 1: Enable Extensions
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
Click "Run" (or Cmd/Ctrl + Enter)

#### Part 2: Create Tables
```sql
-- Courses table (users table handled by Supabase Auth)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB,
  difficulty VARCHAR(50),
  duration_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content items table (DataBank resources)
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  url TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed_modules JSONB DEFAULT '[]'::jsonb,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_name VARCHAR(100) NOT NULL,
  key_value TEXT NOT NULL,
  service VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
Click "Run"

#### Part 3: Create Indexes
```sql
-- Indexes for performance
CREATE INDEX idx_courses_user_id ON courses(user_id);
CREATE INDEX idx_content_items_category ON content_items(category);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
```
Click "Run"

### 3.3 Verify Tables Created
- Click "Table Editor" in left sidebar
- You should see: `courses`, `content_items`, `user_progress`, `api_keys`

---

## Step 4: Configure Row Level Security (RLS) (10 minutes)

### 4.1 Enable RLS on All Tables
```sql
-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
```
Click "Run"

### 4.2 Create Policies for Courses
```sql
-- Courses policies
CREATE POLICY "Users can view their own courses"
  ON courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
  ON courses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
  ON courses FOR DELETE
  USING (auth.uid() = user_id);
```
Click "Run"

### 4.3 Create Policies for Content Items
```sql
-- Content items policies (public read, admin write)
CREATE POLICY "Anyone can view content items"
  ON content_items FOR SELECT
  TO authenticated, anon
  USING (true);

-- For admin/future use: Insert policy
CREATE POLICY "Authenticated users can insert content items"
  ON content_items FOR INSERT
  TO authenticated
  WITH CHECK (true);
```
Click "Run"

### 4.4 Create Policies for User Progress
```sql
-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```
Click "Run"

### 4.5 Create Policies for API Keys
```sql
-- API keys policies
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);
```
Click "Run"

---

## Step 5: Configure Authentication (5 minutes)

### 5.1 Navigate to Authentication Settings
- Click "Authentication" in left sidebar
- Click "Providers"

### 5.2 Configure Email Provider
- **Email** should already be enabled
- Click on "Email" to configure

### 5.3 Email Settings (IMPORTANT)
- **Enable email confirmations**: Toggle OFF (for development)
  - ⚠️ Turn this ON for production
- **Enable email change confirmations**: Toggle OFF (for development)
- **Secure email change**: Toggle OFF (for development)
- Click "Save"

### 5.4 Configure Site URL
- Click "URL Configuration" tab
- **Site URL**: `http://localhost:3000` (for development)
  - Change to `https://gitthub.org` for production
- **Redirect URLs**: Add:
  - `http://localhost:3000/auth`
  - `http://localhost:3000/**` (wildcard for all routes)
- Click "Save"

### 5.5 Email Templates (Optional)
- Click "Email Templates" tab
- Customize confirmation/reset emails if desired
- Default templates work fine for now

---

## Step 6: Create Local Environment File (2 minutes)

### 6.1 In your web-v2 directory
```bash
cd /Users/gitt/hub/web-v2
cp .env.example .env.local
```

### 6.2 Edit `.env.local`
Open `.env.local` and fill in your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Key (BACKEND ONLY)
SUPABASE_SERVICE_KEY=your-service-key-here

# Application URLs (Optional)
VITE_API_URL=/api
```

**Replace**:
- `your-project-id.supabase.co` → Your Project URL from Step 2
- `your-anon-key-here` → Your Anon Key from Step 2
- `your-service-key-here` → Your Service Role Key from Step 2

**Save the file.**

---

## Step 7: Test Local Development (5 minutes)

### 7.1 Start Development Server
```bash
npm run dev
```

### 7.2 Open Browser
Visit: http://localhost:3000

### 7.3 Test Authentication
1. Click "Sign In" or navigate to `/auth`
2. Click "Register" tab
3. Fill in:
   - Email: your-email@example.com
   - Password: (at least 6 characters)
   - Full Name: Your Name
4. Click "Sign Up"

**Expected Result**:
- You should be registered and logged in
- Redirected to home page or dashboard
- No console errors

### 7.4 Verify in Supabase Dashboard
1. Go to Supabase Dashboard
2. Click "Authentication" → "Users"
3. You should see your new user!

### 7.5 Test Database Query
1. While logged in, navigate to `/hub` or `/profile`
2. Open browser console (F12)
3. Check for any errors
4. Data should load (even if empty)

---

## Step 8: Add Sample Data (Optional, 5 minutes)

### 8.1 Add Sample Content Items
In Supabase SQL Editor:

```sql
-- Insert sample content items for DataBank
INSERT INTO content_items (title, description, category, tags, url) VALUES
('React Documentation', 'Official React documentation and guides', 'docs', ARRAY['react', 'javascript', 'frontend'], 'https://react.dev'),
('Vite', 'Next Generation Frontend Tooling', 'tools', ARRAY['vite', 'build-tool', 'frontend'], 'https://vitejs.dev'),
('Supabase', 'Open source Firebase alternative', 'backend', ARRAY['database', 'auth', 'backend'], 'https://supabase.com'),
('Vercel', 'Platform for frontend frameworks and static sites', 'deployment', ARRAY['hosting', 'deployment', 'cdn'], 'https://vercel.com');
```
Click "Run"

### 8.2 Verify Sample Data
1. In your app, navigate to `/databank`
2. You should see the 4 sample content items!

---

## Troubleshooting

### Issue: "Invalid API key"
**Solution**: Double-check your `.env.local` file:
- Ensure no extra spaces
- Ensure keys are copied correctly
- Restart dev server after changing `.env.local`

### Issue: "Email not confirmed"
**Solution**:
- Go to Supabase Dashboard → Authentication → Providers → Email
- Toggle OFF "Enable email confirmations"
- Try registering again

### Issue: "Permission denied for table courses"
**Solution**:
- Verify RLS policies are created (Step 4)
- Check if user is authenticated (look in Supabase → Authentication → Users)

### Issue: Tables not showing up
**Solution**:
- Verify SQL ran without errors
- Click "Table Editor" and check for tables
- Try running schema SQL again

### Issue: Build fails
**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Next Steps

Once Supabase is set up and tested locally:

1. ✅ **Commit your changes** to Git
2. ✅ **Deploy to Vercel preview** (`vercel`)
3. ✅ **Add environment variables** to Vercel Dashboard
4. ✅ **Test in preview** environment
5. ✅ **Deploy to production** (`vercel --prod`)
6. ✅ **Update Supabase URL settings** for production domain

---

## Summary Checklist

- [ ] Created Supabase project
- [ ] Saved database password securely
- [ ] Copied Project URL, Anon Key, Service Key
- [ ] Applied database schema (tables + indexes)
- [ ] Configured RLS policies
- [ ] Configured email authentication
- [ ] Set Site URL to `http://localhost:3000`
- [ ] Created `.env.local` with credentials
- [ ] Tested local development server
- [ ] Successfully registered a test user
- [ ] Verified user in Supabase Dashboard
- [ ] (Optional) Added sample content items

---

**🎉 Congratulations!** Your Supabase backend is now set up and ready to use.

**Questions?** Check `CLAUDE.md` for detailed documentation or the Supabase docs at https://supabase.com/docs
