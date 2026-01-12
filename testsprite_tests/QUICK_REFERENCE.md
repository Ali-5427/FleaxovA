# 🚀 FleaxovA Testing Quick Reference

## 📋 Test Cases At-a-Glance

### 🔴 CRITICAL (Must Pass) - 7 Tests

| ID | Test Name | Est. Time | Key Focus |
|----|-----------|-----------|-----------|
| **TC001** | User Registration Valid | 5 min | Email verification, JWT, Role selection |
| **TC003** | Password Reset Flow | 5 min | Email delivery, Reset link, Password update |
| **TC004** | Profile Creation/Edit | 7 min | Skills, Portfolio, Bio, Data persistence |
| **TC008** | Order Workflow | 12 min | **Payment-first**, Status progression, Escrow |
| **TC009** | Wallet & Withdrawals | 10 min | **Commission calc**, Admin approval, Balance check |
| **TC015** | Role-Based Access | 5 min | Admin panel, Route protection, API auth |
| **TC018** | Security (Hash/JWT) | 5 min | Bcrypt hashing, Token expiry, Storage |

**Total Critical Testing Time:** ~49 minutes

---

### 🟡 HIGH PRIORITY (Should Pass) - 10 Tests

| ID | Test Name | Est. Time | Key Focus |
|----|-----------|-----------|-----------|
| **TC002** | Registration Invalid | 3 min | Validation errors, Email format, Password strength |
| **TC005** | Service Creation | 7 min | **Paid-only enforcement**, Price validation |
| **TC006** | Service Marketplace | 5 min | Search, Filter, Details page |
| **TC007** | Job Applications | 10 min | Job posting, Student apply, Approval workflow |
| **TC010** | Real-Time Messaging | 8 min | Message delivery, Read receipts, History |
| **TC011** | Review & Rating | 7 min | **Anti-spam**, Post-completion only, Average calc |
| **TC012** | Notifications | 6 min | Order alerts, Message alerts, Read/unread |
| **TC013** | Dashboard Accuracy | 8 min | Real-time updates, Analytics, Order counts |
| **TC014** | Admin Moderation | 10 min | User suspend, Service removal, Audit logs |
| **TC016** | API Error Handling | 8 min | Validation, 401/403/404, Error messages |

**Total High Priority Time:** ~72 minutes

---

### 🟢 MEDIUM PRIORITY - 1 Test

| ID | Test Name | Est. Time | Key Focus |
|----|-----------|-----------|-----------|
| **TC017** | Responsive UI/UX | 10 min | Desktop, Mobile, Hamburger menu, Touch targets |

---

## ⚡ Quick Start Testing

### 1. Start Servers
```powershell
# Terminal 1: Backend
cd c:\Users\Admin\Downloads\FleaxovA\server
npm run dev
# Should run on http://localhost:9099

# Terminal 2: Frontend
cd c:\Users\Admin\Downloads\FleaxovA\client
npm run dev
# Should run on http://localhost:5173
```

### 2. Create Test Accounts
| Type | Email | Password | Use For |
|------|-------|----------|---------|
| Student | `student.test@fleaxova.com` | `Test@123` | Freelancer tests |
| Client | `client.test@fleaxova.com` | `Test@123` | Buyer tests |
| Admin | `admin.test@fleaxova.com` | `Admin@123` | Admin tests |

### 3. Open Testing Tools
- **Browser:** Chrome with DevTools (F12)
- **Tabs:** Console, Network, Application
- **API Tool:** Postman/Thunder Client (for TC016)

---

## 🎯 Critical Business Rules to Verify

### 1. Payment-First Platform (TC008)
✅ **MUST VERIFY:**
- Client CANNOT place order without payment
- Freelancer receives payment only after completion
- Platform deducts commission automatically

### 2. Paid Services Only (TC005)
✅ **MUST VERIFY:**
- Service price CANNOT be zero
- Service price CANNOT be negative
- Free work is IMPOSSIBLE

### 3. Secure Escrow (TC008, TC009)
✅ **MUST VERIFY:**
- Payment held until delivery approved
- Wallet balance = (Order Amount - Commission)
- Withdrawal requires admin approval

### 4. Role Enforcement (TC015)
✅ **MUST VERIFY:**
- Students CANNOT post jobs
- Clients CANNOT create services
- Non-admins CANNOT access admin panel

### 5. Review Integrity (TC011)
✅ **MUST VERIFY:**
- One review per order (no duplicates)
- Reviews only after completion
- Average rating calculated correctly

---

## 🐛 Common Issues to Check

### Authentication
- [ ] JWT token stored in localStorage or httpOnly cookie
- [ ] Token includes expiry timestamp
- [ ] Expired tokens rejected by API
- [ ] Passwords stored as bcrypt hashes

### Orders
- [ ] Order status progression correct
- [ ] Payment status synced with order status
- [ ] Notifications sent at each stage
- [ ] Delivery can only be submitted by freelancer

### Wallet
- [ ] Commission calculation: Platform % of order amount
- [ ] Balance never goes negative
- [ ] Withdrawal cannot exceed available balance
- [ ] Transaction history shows all activities

### UI/UX
- [ ] No console errors
- [ ] Loading states display during API calls
- [ ] Error messages user-friendly
- [ ] Forms retain data on validation errors

### Security
- [ ] No passwords in logs/console
- [ ] Protected routes redirect to login
- [ ] API returns 401 for missing auth
- [ ] API returns 403 for insufficient permissions

---

## 📝 Quick Bug Report Template

```markdown
**Test Case:** TC### - [Name]
**Severity:** Critical / High / Medium / Low
**Steps to Reproduce:**
1.
2.
3.

**Expected:** 
**Actual:** 
**Screenshot:** [Attach]
**Console Errors:** [Paste]
**Browser:** Chrome/Firefox/Safari
**Date:** [Date]
```

---

## 🔍 Quick Verification Commands

### Check Backend Status
```powershell
curl http://localhost:9099/api/health
# Should return 200 OK
```

### Check Database Connection
- Open Supabase dashboard
- Verify tables exist: users, profiles, services, orders, etc.

### Check Frontend Build
```powershell
cd c:\Users\Admin\Downloads\FleaxovA\client
npm run build
# Should complete without errors
```

### View Test Data
```sql
-- In Supabase SQL Editor
SELECT * FROM users LIMIT 5;
SELECT * FROM services LIMIT 5;
SELECT * FROM orders LIMIT 5;
```

---

## 📊 Test Progress Tracker

### Critical Tests (7)
- [ ] TC001 - Registration Valid
- [ ] TC003 - Password Reset
- [ ] TC004 - Profile Creation
- [ ] TC008 - Order Workflow ⭐ **REVENUE CRITICAL**
- [ ] TC009 - Wallet & Withdrawals ⭐ **FINANCIAL CRITICAL**
- [ ] TC015 - Role-Based Access ⭐ **SECURITY CRITICAL**
- [ ] TC018 - Security Hash/JWT ⭐ **SECURITY CRITICAL**

### High Priority Tests (10)
- [ ] TC002 - Registration Invalid
- [ ] TC005 - Service Creation
- [ ] TC006 - Service Marketplace
- [ ] TC007 - Job Applications
- [ ] TC010 - Real-Time Messaging
- [ ] TC011 - Review & Rating
- [ ] TC012 - Notifications
- [ ] TC013 - Dashboard Accuracy
- [ ] TC014 - Admin Moderation
- [ ] TC016 - API Error Handling

### Medium Priority Tests (1)
- [ ] TC017 - Responsive UI/UX

### Passed: ___ / 18
### Failed: ___ / 18
### Blocked: ___ / 18

---

## ⏱️ Estimated Testing Times

| Phase | Tests | Time |
|-------|-------|------|
| **Critical Tests** | 7 | ~49 minutes |
| **High Priority** | 10 | ~72 minutes |
| **Medium Priority** | 1 | ~10 minutes |
| **Total** | **18** | **~131 minutes (2.2 hrs)** |

**Add 30% buffer for issues:** ~170 minutes (2.8 hrs)

---

## 🎯 Pass/Fail Criteria

### Minimum for LAUNCH:
- ✅ All 7 critical tests MUST pass
- ✅ At least 8/10 high priority tests pass
- ✅ Zero high-severity security bugs
- ✅ Payment workflow 100% functional

### Ideal for LAUNCH:
- ✅ All 18 tests pass
- ✅ Zero critical/high bugs
- ✅ Mobile UI fully functional

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `testsprite_frontend_test_plan.json` | 18 test cases (JSON format) |
| `MANUAL_TEST_GUIDE.md` | Step-by-step testing instructions |
| `TEST_SUMMARY.md` | Executive summary & strategy |
| `QUICK_REFERENCE.md` | This file - quick reference |
| `tmp/code_summary.json` | Tech stack & feature analysis |

---

## 🚨 Critical Alerts

### ⚠️ Before Testing:
1. Backup database (Supabase export)
2. Clear browser cache/localStorage
3. Ensure both servers running
4. Create fresh test accounts

### ⚠️ During Testing:
1. Monitor console for errors
2. Check Network tab for failed API calls
3. Screenshot ALL failures
4. Document steps to reproduce

### ⚠️ After Testing:
1. Export test results
2. Document all bugs found
3. Prioritize fixes
4. Re-test after fixes

---

## 💡 Pro Tips

### Speed Up Testing:
1. **Use browser profiles:** Separate profiles for Student/Client/Admin
2. **Bookmark test URLs:** Save time navigating
3. **Prepare test data:** Pre-create services, jobs before testing orders
4. **Use keyboard shortcuts:** F12 for DevTools, Ctrl+Shift+C for inspect

### Catch More Bugs:
1. **Test edge cases:** Empty strings, special characters, very long inputs
2. **Test boundaries:** Min/max values, zero, negative numbers
3. **Test timing:** Fast clicks, slow network, multiple tabs
4. **Test combinations:** Multiple orders, many messages, bulk actions

### Better Bug Reports:
1. **Record videos:** Use OBS or browser extensions
2. **Copy console errors:** Full stack traces help devs
3. **Note exact timing:** "Happened after 3 seconds", "On 2nd click"
4. **Include environment:** Browser version, OS, screen resolution

---

## 🎓 Testing Cheat Sheet

### Must Test in Every Feature:
- [ ] Works when logged in
- [ ] Blocked when logged out
- [ ] Role permissions enforced
- [ ] Data persists after refresh
- [ ] Loading states display
- [ ] Error messages clear
- [ ] Success messages show
- [ ] API calls succeed (Network tab)
- [ ] No console errors
- [ ] No 404s or broken images

---

## 📞 Need Help?

### Check These First:
1. Is the server running? Check terminals
2. Any console errors? Press F12
3. Is database connected? Check Supabase
4. Are test accounts created?
5. Is JWT token valid? Check localStorage

### Debugging Steps:
1. **If login fails:** Clear localStorage, check password
2. **If API fails:** Check Network tab, verify backend running
3. **If page blank:** Check console for errors
4. **If data missing:** Check database in Supabase

---

**Last Updated:** January 12, 2026  
**Status:** Ready for manual testing  
**Next Action:** Start with TC001 (Critical Tests)

🚀 **Happy Testing!**
