# Quick Reference - web-v2

Essential commands and checklists for web-v2 development and deployment.

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Component library (Storybook)
npm run storybook
```

---

## Environment Setup

### Required Environment Variables

**Local** (`.env.local`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

**Vercel** (Dashboard → Settings → Environment Variables):
- Same as above
- Set for: Production, Preview, Development

---

## Vercel Deployment

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Login (one-time)
vercel login

# Deploy to preview (test)
vercel

# Deploy to production
vercel --prod
```

---

## Git Workflow

```bash
# Initial commit
git add .
git commit -m "Initial Vercel + Supabase migration"

# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature
```

---

## Supabase Quick Tasks

### View Users
Supabase Dashboard → Authentication → Users

### Run SQL Query
Supabase Dashboard → SQL Editor → New Query

### Check Table Data
Supabase Dashboard → Table Editor → Select Table

### View Logs
Supabase Dashboard → Logs

### Common SQL Queries

```sql
-- Count users
SELECT COUNT(*) FROM auth.users;

-- List all courses
SELECT * FROM courses ORDER BY created_at DESC;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'courses';

-- Delete all content items (careful!)
DELETE FROM content_items;
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass locally (`npm run build`)
- [ ] `.env.local` is configured correctly
- [ ] Authentication works locally
- [ ] No console errors in browser
- [ ] Database queries return data
- [ ] Commit all changes to Git

### Vercel Setup
- [ ] Vercel CLI installed (`npm i -g vercel`)
- [ ] Logged into Vercel (`vercel login`)
- [ ] Environment variables set in Vercel Dashboard
- [ ] Preview deployment tested (`vercel`)

### Supabase Production Setup
- [ ] Email confirmations enabled (Production only)
- [ ] Site URL updated to production domain
- [ ] Redirect URLs include production domain
- [ ] RLS policies verified
- [ ] Database backed up

### Production Deployment
- [ ] Deploy with `vercel --prod`
- [ ] Test authentication on production
- [ ] Verify database connections work
- [ ] Check all routes load correctly
- [ ] Monitor Vercel deployment logs
- [ ] Update DNS if needed (custom domain)

---

## Troubleshooting

### Build Fails
```bash
rm -rf node_modules dist .next
npm install
npm run build
```

### Supabase Connection Issues
1. Check `.env.local` has correct keys
2. Restart dev server
3. Clear browser cache
4. Check Supabase project status

### Authentication Not Working
1. Verify Supabase Site URL matches your domain
2. Check email confirmation settings
3. Look for errors in browser console
4. Check Supabase auth logs

### Database Permission Errors
1. Verify RLS policies exist
2. Check if user is authenticated
3. Test SQL query directly in Supabase
4. Review policy conditions

---

## Useful Links

**Project**:
- Local Dev: http://localhost:3000
- Production: https://gitthub.org (when deployed)

**Dashboards**:
- Supabase: https://app.supabase.com
- Vercel: https://vercel.com/dashboard

**Documentation**:
- React: https://react.dev
- Vite: https://vitejs.dev
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Styled Components: https://styled-components.com

**Support**:
- Supabase Discord: https://discord.supabase.com
- Vercel Discord: https://vercel.com/discord

---

## File Structure Quick Reference

```
web-v2/
├── api/                    # Vercel serverless functions
│   ├── health.js          # GET /api/health
│   └── databank.js        # GET /api/databank
├── src/
│   ├── lib/
│   │   └── supabase.js    # Supabase client (import this!)
│   ├── services/
│   │   └── auth-service.js # Auth wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx # useAuth() hook
│   ├── pages/             # Route components
│   └── App.jsx            # Main router
├── .env.local             # Local environment (gitignored)
├── .env.example           # Environment template
├── vercel.json            # Vercel config
├── CLAUDE.md              # Full documentation
├── SUPABASE_SETUP_GUIDE.md # Supabase setup
└── QUICK_REFERENCE.md     # This file
```

---

## Common Code Patterns

### Using Supabase Client
```javascript
import { supabase } from '../lib/supabase'

// Query data
const { data, error } = await supabase
  .from('courses')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('courses')
  .insert({ title, user_id })

// Update data
const { data, error } = await supabase
  .from('courses')
  .update({ title })
  .eq('id', courseId)
```

### Using Auth
```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" />
  }

  return <div>Welcome {user.email}</div>
}
```

### Protected Route
```javascript
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedPage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/auth" />

  return <div>Protected Content</div>
}
```

---

## Emergency Rollback

If production deployment has issues:

### Vercel Rollback
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Supabase Rollback (if needed)
1. Go to Supabase Dashboard → Database → Backups
2. Download backup
3. Restore from backup (contact support if needed)

### Local Rollback
```bash
git log  # Find commit hash
git revert <commit-hash>
git push
vercel --prod
```

---

## Performance Monitoring

### Vercel Analytics
- Vercel Dashboard → Analytics
- View page load times, traffic, errors

### Supabase Monitoring
- Supabase Dashboard → Logs
- Monitor query performance, errors

### Browser DevTools
- Network tab: Check API call times
- Performance tab: Analyze page load
- Console: Check for errors

---

**Last Updated**: November 27, 2025
