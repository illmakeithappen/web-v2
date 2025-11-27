# web-v2 Vercel + Supabase Migration

**Project**: gitthub.org  
**Migration**: Render → Vercel + Supabase  
**Status**: Planning Phase  
**Date**: 2025-11-27

---

## Overview

Complete migration plan to move gitthub.org from Render (React+FastAPI+AWS RDS) to Vercel (React+Serverless+Supabase).

**Goals**:
- Simplify architecture
- Reduce costs
- Eliminate AWS dependencies
- Use Supabase built-in features over custom code
- Remove 3,365+ lines of dead code

---

## Key Changes

### Platform Migration

| Component | From | To |
|-----------|------|-----|
| Frontend Hosting | Render Web Service | Vercel |
| Backend | FastAPI (Python) | Vercel Serverless Functions |
| Database | AWS RDS PostgreSQL | Supabase Postgres |
| Authentication | Custom JWT + bcrypt | Supabase Auth |
| File Storage | AWS S3 | Supabase Storage |
| AI Features | AWS Bedrock | Removed |

### Architecture Simplification

**Before** (Render):
```
React Frontend → FastAPI Backend → AWS RDS PostgreSQL
                      ↓
              AWS Bedrock (AI)
              AWS Cognito (unused)
              MongoDB (disconnected)
```

**After** (Vercel + Supabase):
```
React Frontend → Vercel Functions → Supabase
                      ↓
              Supabase Auth
              Supabase Storage
```

**Result**: 80% less backend code, no AWS dependencies, simpler deployment.

---

## Implementation Phases

### Phase 1: Repository Structure (Week 1)
- Initialize git repository
- Restructure files for Vercel
- Move frontend/ contents to root
- Create api/ directory for serverless functions

### Phase 2: Supabase Setup (Week 1)
- Create Supabase project
- Define database schema with RLS policies
- Set up Supabase Auth
- Migrate content_items data

### Phase 3: Backend Migration (Week 2)
- Convert 2 endpoints to Vercel functions (health, databank)
- Remove 10+ unused endpoints
- Replace custom auth with Supabase Auth

### Phase 4: Frontend Changes (Week 2)
- Install @supabase/supabase-js
- Replace auth service with Supabase client
- Update AuthContext (minimal changes)
- Remove AWS Amplify dependencies

### Phase 5: Testing (Week 3)
- Local testing with Vercel dev server
- Deploy to Vercel staging
- User acceptance testing
- Performance testing

### Phase 6: Production Deployment (Week 4)
- Migrate production data
- Deploy to Vercel
- Configure custom domain (gitthub.org)
- Monitor and fix issues

---

## Critical Decisions

### 1. No Password Migration
**Decision**: Users must re-register  
**Reason**: bcrypt hashes cannot be securely migrated between systems  
**Impact**: Temporary inconvenience, but necessary for security

### 2. Remove AI Features
**Decision**: Delete AWS Bedrock course generation  
**Reason**: Complex AWS dependency, underutilized feature  
**Impact**: Simplified architecture, can re-add with Supabase AI later

### 3. Minimal Backend
**Decision**: Only 2 Vercel serverless functions  
**Reason**: Supabase handles auth, database queries via client  
**Impact**: Faster development, easier maintenance

### 4. Supabase RLS
**Decision**: Use Row Level Security for access control  
**Reason**: Database-level security is more robust than API-level  
**Impact**: Queries auto-filtered by authenticated user

---

## Database Schema

### Current (AWS RDS)

```sql
users (user_id, email, password_hash, full_name, organization, ...)
user_api_keys (user_id, openai_key_encrypted, anthropic_key_encrypted, ...)
user_sessions (session_id, user_id, token_hash, expires_at, ...)
user_courses (course_id, user_id, title, course_data, ...)
content_items (id, title, url, category, ...)
user_activity_log (id, user_id, action, details, ...)
```

### Target (Supabase)

```sql
auth.users (managed by Supabase Auth)
user_profiles (user_id → auth.users.id, full_name, organization, ...)
user_api_keys (same as before, user_id → auth.users.id)
user_courses (same as before, user_id → auth.users.id)
content_items (identical)
user_activity_log (same as before, user_id → auth.users.id)
```

**Key Change**: Use Supabase's `auth.users` table instead of custom `users` table. All other tables reference `auth.users.id`.

---

## Code Changes Summary

### New Files
```
api/health.py               - Health check endpoint
api/databank.py             - Resource library API
api/requirements.txt        - Python dependencies
src/lib/supabase.js         - Supabase client
supabase/migrations/001_*.sql - Database schema
vercel.json                 - Vercel configuration
```

### Modified Files
```
package.json                - Add @supabase/supabase-js, remove AWS deps
vite.config.js              - Update API proxy
src/config.js               - Add Supabase config
src/services/auth-service.js - Replace with Supabase auth
src/contexts/AuthContext.jsx - Remove PostgreSQL checks
```

### Deleted Files
```
backend/ (entire directory)
docker-compose*.yml
render.yaml
frontend/ (after moving to root)
src/components/CognitoAuth.jsx
src/services/postgres-auth-service.js
```

**Total**: ~3,365+ lines of dead code removed

---

## Environment Variables

### Development (.env.local)
```bash
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=/api
```

### Production (Vercel Dashboard)
```bash
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key (secret)
```

---

## Cost Comparison

### Current (Render)
- Render Backend: $7/month
- Render Frontend: $7/month
- AWS RDS: $15-20/month
- **Total**: $29-34/month

### Target (Vercel + Supabase)
- Vercel Hobby: $0/month
- Supabase Free: $0/month
- **Total**: $0/month (hobby) or $45/month (production with Pro plans)

**Savings**: $29/month (hobby) or -$11/month (production with better scalability)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| User data loss | Full database backup before migration |
| Authentication breaks | Keep Render running as fallback |
| Performance issues | Load testing before cutover |
| User confusion | Clear migration guide, email notifications |
| DNS propagation | 24-48 hour transition period |

---

## Testing Checklist

### Pre-Migration
- [ ] Export complete database backup
- [ ] Document all critical user flows
- [ ] Test current production functionality

### Development Testing
- [ ] Auth flows (register, login, logout)
- [ ] DataBank browsing
- [ ] Course CRUD operations
- [ ] Profile management
- [ ] Mobile responsiveness

### Staging Testing
- [ ] Deploy to Vercel preview
- [ ] Test all auth flows
- [ ] Verify database connections
- [ ] Cross-browser testing
- [ ] Performance testing (Lighthouse)

### Production Verification
- [ ] Custom domain working (gitthub.org)
- [ ] SSL certificate active
- [ ] All features functional
- [ ] No console errors
- [ ] Monitor for 48 hours

---

## User Communication Plan

### Pre-Migration (1 week before)
**Email to All Users**:
```
Subject: Important: gitthub.org Platform Upgrade

Dear gitthub.org user,

We're upgrading our platform to improve performance and reliability.

What you need to know:
- Migration date: [DATE]
- Downtime: < 1 hour
- Action required: You'll need to create a new account with the same email
- Your courses: We'll help you restore access to your saved courses

Why the upgrade?
- Faster page loads
- Better security with industry-standard authentication
- Simplified architecture for faster feature development

We appreciate your patience during this transition.

Questions? Reply to this email.

Best,
The gitthub.org Team
```

### Migration Day
**Site Banner**:
```
🚀 We're upgrading! Please create a new account to continue using gitthub.org.
Your saved courses are safe and can be restored - contact support for help.
```

### Post-Migration
**Follow-up Email**:
```
Subject: gitthub.org Upgrade Complete

The upgrade is complete! Please sign up with your email to access the new platform.

Need help restoring your courses? Contact us at support@gitthub.org.

Thank you for your patience!
```

---

## Rollback Plan

If migration fails:

1. **Immediate Actions**:
   - Keep Render deployment running (DO NOT shut down)
   - Update DNS back to Render
   - Document failure reasons

2. **Rollback Steps**:
   ```bash
   # Update DNS A record back to Render IP
   # Wait 24-48 hours for propagation
   ```

3. **Data Recovery**:
   - AWS RDS snapshot available
   - Supabase point-in-time recovery
   - Migration JSON exports preserved

---

## Success Metrics

Migration is successful when:

1. **Functionality** ✓
   - All critical features work
   - No data loss
   - Performance improved

2. **Adoption** ✓
   - 80%+ users re-register within 1 week
   - < 5% support requests

3. **Stability** ✓
   - No critical bugs for 48 hours
   - 99.9% uptime in first month

4. **Cost** ✓
   - Within budget
   - No unexpected charges

---

## Timeline

**Week 1** (Dec 2-8): Preparation & Setup  
**Week 2** (Dec 9-15): Code Migration  
**Week 3** (Dec 16-22): Testing & Refinement  
**Week 4** (Dec 23-29): Production Deployment  

**Go-Live**: December 26, 2025

---

## Resources

- **Full Migration Plan**: `/Users/gitt/.claude/plans/quizzical-imagining-compass-agent-189b2c8b.md`
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Current Production**: https://farp-frontend.onrender.com
- **Target Production**: https://gitthub.org

---

## Next Steps

1. Review this migration plan
2. Create Supabase project
3. Initialize git repository
4. Begin Phase 1: Repository restructuring

**Status**: Awaiting approval to proceed

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-27  
**Author**: Claude Code Planning Agent
