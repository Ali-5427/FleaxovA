# FleaxovA Manual Testing Guide
**Version:** 1.0  
**Date:** January 12, 2026  
**Project:** FleaxovA - Payment-only Student Freelancing Platform

---

## 📋 Table of Contents
1. [Pre-Testing Setup](#pre-testing-setup)
2. [Authentication & Security Tests](#authentication--security-tests)
3. [Profile & Service Tests](#profile--service-tests)
4. [Jobs & Orders Tests](#jobs--orders-tests)
5. [Communication Tests](#communication-tests)
6. [Reviews & Admin Tests](#reviews--admin-tests)
7. [Infrastructure Tests](#infrastructure-tests)
8. [Test Results Template](#test-results-template)

---

## 🛠️ Pre-Testing Setup

### Environment Requirements
- **Frontend URL**: `http://localhost:5173`
- **Backend URL**: `http://localhost:9099`
- **Database**: Supabase (PostgreSQL)
- **Browsers**: Chrome (latest), Firefox, Safari, Edge

### Test Data Requirements
Prepare the following test accounts:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Student | `student.test@fleaxova.com` | `Test@123` | Freelancer testing |
| Client | `client.test@fleaxova.com` | `Test@123` | Buyer testing |
| Admin | `admin.test@fleaxova.com` | `Admin@123` | Admin panel testing |

### Pre-Test Checklist
- [ ] Both frontend and backend servers running
- [ ] Database connection verified
- [ ] Test accounts created
- [ ] Browser console opened (F12) for debugging
- [ ] Network tab ready for API monitoring

---

## 🔐 Authentication & Security Tests

### TC001: User Registration with Valid Data
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 5 minutes

#### Test Steps:
1. **Navigate to Registration**
   - Open `http://localhost:5173`
   - Click "Register" or "Sign Up" button
   - **Expected:** Registration form loads successfully

2. **Fill Valid Registration Data**
   - Enter Name: `John Student`
   - Enter Email: `newstudent@test.com`
   - Enter Password: `ValidPass@123`
   - Confirm Password: `ValidPass@123`
   - Select Role: `Student`
   - **Expected:** All fields accept input without errors

3. **Submit Registration**
   - Click "Register" button
   - **Expected:** Success message appears
   - **Expected:** Verification email sent (check console/logs)

4. **Verify Email** (If implemented)
   - Check for verification link in console/logs
   - Click verification link
   - **Expected:** Email verified successfully

5. **Login with New Account**
   - Navigate to login page
   - Enter email: `newstudent@test.com`
   - Enter password: `ValidPass@123`
   - Click "Login"
   - **Expected:** User logged in successfully
   - **Expected:** JWT token stored (check localStorage/cookies)
   - **Expected:** Redirected to dashboard

#### Success Criteria:
✅ Registration completes without errors  
✅ User can login with new credentials  
✅ JWT token is generated and stored  
✅ User lands on appropriate dashboard

#### Common Issues:
- Email format validation errors
- Password strength requirements not met
- Duplicate email registration

---

### TC002: User Registration with Invalid Data
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 3 minutes

#### Test Steps:
1. **Test Invalid Email**
   - Enter email: `notanemail`
   - Fill other fields correctly
   - Click "Register"
   - **Expected:** Email validation error displayed

2. **Test Weak Password**
   - Enter password: `123`
   - Fill other fields correctly
   - Click "Register"
   - **Expected:** Password strength error displayed

3. **Test Password Mismatch**
   - Enter password: `ValidPass@123`
   - Enter confirm: `DifferentPass@456`
   - Click "Register"
   - **Expected:** Password mismatch error displayed

4. **Test Missing Required Fields**
   - Leave name field empty
   - Fill other fields
   - Click "Register"
   - **Expected:** Required field error displayed

#### Success Criteria:
✅ Validation errors prevent form submission  
✅ Clear error messages displayed  
✅ No partial registrations created  
✅ Form retains valid input data

---

### TC003: Password Reset Flow
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 5 minutes

#### Test Steps:
1. **Navigate to Forgot Password**
   - Go to login page
   - Click "Forgot Password?" link
   - **Expected:** Password reset page loads

2. **Request Password Reset**
   - Enter email: `student.test@fleaxova.com`
   - Click "Send Reset Link"
   - **Expected:** Success message: "Reset link sent to email"
   - **Expected:** Check console/logs for reset link

3. **Access Reset Link**
   - Copy reset link from console/logs
   - Paste in browser or navigate to reset password page
   - **Expected:** Reset password form displays

4. **Set New Password**
   - Enter new password: `NewPass@456`
   - Confirm password: `NewPass@456`
   - Click "Reset Password"
   - **Expected:** Success message: "Password updated"

5. **Login with New Password**
   - Navigate to login page
   - Enter email: `student.test@fleaxova.com`
   - Enter password: `NewPass@456`
   - Click "Login"
   - **Expected:** Login successful

6. **Verify Old Password Doesn't Work**
   - Logout
   - Try logging in with old password: `Test@123`
   - **Expected:** Login fails with "Invalid credentials"

#### Success Criteria:
✅ Reset link generated and works  
✅ New password saved successfully  
✅ Old password no longer valid  
✅ User can access account with new password

---

### TC015: Role-Based Access Control
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 5 minutes

#### Test Steps:
1. **Test Client Accessing Admin Panel**
   - Login as client: `client.test@fleaxova.com`
   - Manually navigate to: `http://localhost:5173/admin`
   - **Expected:** Access denied / Redirected to dashboard
   - **Expected:** Error message: "Unauthorized access"

2. **Test Student Creating Jobs**
   - Login as student: `student.test@fleaxova.com`
   - Try to navigate to: `http://localhost:5173/create-job`
   - **Expected:** Access denied
   - **Expected:** Error: "Only clients can post jobs"

3. **Test Unauthenticated Access**
   - Logout completely
   - Navigate to: `http://localhost:5173/dashboard`
   - **Expected:** Redirected to login page
   - **Expected:** Message: "Please login to continue"

4. **Verify API-Level Protection**
   - Open Network tab
   - Try accessing protected route without token
   - **Expected:** API returns 401 Unauthorized
   - **Expected:** Console shows authentication error

#### Success Criteria:
✅ Role-based routes properly protected  
✅ Unauthorized access blocked  
✅ Appropriate error messages shown  
✅ API endpoints enforce authentication

---

### TC018: Security - Password Hashing & JWT
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 5 minutes

#### Test Steps:
1. **Verify Password Hashing**
   - Register new user: `security.test@fleaxova.com`
   - Password: `SecurePass@789`
   - Open Supabase database
   - Check `users` table for new user
   - **Expected:** Password field shows hashed value (bcrypt)
   - **Expected:** Password is NOT plaintext

2. **Verify JWT Token Generation**
   - Login as user
   - Open browser DevTools → Application/Storage
   - Check localStorage or cookies
   - **Expected:** JWT token present
   - **Expected:** Token format: `eyJ...` (three parts separated by dots)

3. **Decode JWT Token**
   - Copy token value
   - Visit `jwt.io`
   - Paste token in debugger
   - **Expected:** Token contains user ID and role
   - **Expected:** Token has expiry timestamp (`exp` field)

4. **Test Token Expiry**
   - Manually edit token expiry in database (if possible)
   - OR wait for token to expire (30 days default)
   - Try accessing protected API endpoint
   - **Expected:** API returns 401 Unauthorized
   - **Expected:** User redirected to login

#### Success Criteria:
✅ Passwords stored as bcrypt hashes  
✅ JWT tokens properly formatted  
✅ Tokens contain user metadata  
✅ Expired tokens rejected

---

## 👤 Profile & Service Tests

### TC004: Student Freelancer Profile Creation and Editing
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 7 minutes

#### Test Steps:
1. **Login as Student**
   - Login with: `student.test@fleaxova.com`
   - Navigate to Dashboard

2. **Create/Edit Profile**
   - Click "Edit Profile" or profile settings
   - **Expected:** Profile form loads

3. **Fill Profile Information**
   - Title: `Full-Stack Developer`
   - Bio: `Experienced MERN stack developer with 2+ years...`
   - Skills: Add `React`, `Node.js`, `MongoDB`, `Express`
   - Portfolio Links: `https://github.com/student`, `https://portfolio.com`
   - Social Links:
     - LinkedIn: `linkedin.com/in/student`
     - Twitter: `@student_dev`
   - Click "Save Profile"
   - **Expected:** Success message: "Profile updated successfully"

4. **Verify Profile Display**
   - Navigate to your public profile page
   - **Expected:** All entered data displays correctly
   - **Expected:** Skills show as tags/badges
   - **Expected:** Portfolio links are clickable

5. **Edit Profile Again**
   - Return to edit page
   - Change Bio to something new
   - Add skill: `TypeScript`
   - Click "Save"
   - **Expected:** Changes saved
   - **Expected:** Updated data displays on profile

#### Success Criteria:
✅ Profile creation successful  
✅ All fields save correctly  
✅ Profile updates persist  
✅ Public profile displays accurate data

---

### TC005: Service Listing Creation and Validation
**Priority:** 🟡 HIGH  
**Estimated Time:** 7 minutes

#### Test Steps:
1. **Navigate to Create Service**
   - Login as student
   - Click "Create Service" or similar button
   - **Expected:** Service creation form displays

2. **Fill Valid Service Data**
   - Title: `Professional Website Development`
   - Description: `I will build a responsive website using React...`
   - Category: Select `Web Development`
   - Price: `5000` (INR)
   - Delivery Time: `7` days
   - Upload images (if available)
   - Click "Create Service"
   - **Expected:** Success message
   - **Expected:** Service appears in marketplace

3. **Verify Service in Marketplace**
   - Navigate to Services page
   - Filter by "Web Development" category
   - **Expected:** Your service appears in results
   - Click on service
   - **Expected:** Service detail page shows all information correctly

4. **Test Price Validation (Zero Price)**
   - Try creating another service
   - Set Price: `0`
   - Fill other fields correctly
   - Click "Create Service"
   - **Expected:** Validation error: "Price must be greater than 0"
   - **Expected:** Service creation blocked

5. **Test Negative Price**
   - Set Price: `-100`
   - Click "Create Service"
   - **Expected:** Validation error
   - **Expected:** Service not created

#### Success Criteria:
✅ Valid service created successfully  
✅ Service visible in marketplace  
✅ Zero/negative prices blocked  
✅ All service data displays correctly

---

### TC006: Browse and Search Service Marketplace
**Priority:** 🟡 HIGH  
**Estimated Time:** 5 minutes

#### Test Steps:
1. **Access Marketplace**
   - Login as any user (or guest if allowed)
   - Navigate to "Services" or "Marketplace"
   - **Expected:** Service listings display

2. **Filter by Category**
   - Select category: "Web Development"
   - **Expected:** Only web development services shown
   - Select category: "Graphic Design"
   - **Expected:** Only design services shown

3. **Search by Keyword**
   - Enter search term: `website`
   - Press Enter or click Search
   - **Expected:** Results contain services with "website" in title/description
   - Clear search
   - Search: `logo design`
   - **Expected:** Relevant logo/design services appear

4. **View Service Details**
   - Click on a service listing
   - **Expected:** Service detail page loads
   - **Expected:** Shows:
     - Service title, description
     - Price clearly displayed
     - Delivery time
     - Freelancer profile/name
     - Reviews (if any)
     - "Order Now" or "Contact" button

5. **Test Empty Search Results**
   - Search for: `nonexistent12345xyz`
   - **Expected:** "No services found" message
   - **Expected:** Suggestion to browse all or change filters

#### Success Criteria:
✅ All services display in marketplace  
✅ Category filtering works accurately  
✅ Search returns relevant results  
✅ Service details page complete  
✅ Empty states handled gracefully

---

## 💼 Jobs & Orders Tests

### TC007: Job Posting and Application Management
**Priority:** 🟡 HIGH  
**Estimated Time:** 10 minutes

#### Test Steps:
1. **Client Posts a Job**
   - Login as client: `client.test@fleaxova.com`
   - Navigate to "Post a Job" or "Create Job"
   - Fill job details:
     - Title: `E-commerce Website Development`
     - Description: `Need a full e-commerce site with payment integration...`
     - Category: `Web Development`
     - Budget: `25000`
     - Deadline: Select date 15 days from today
   - Click "Post Job"
   - **Expected:** Success message
   - **Expected:** Job appears in job listings

2. **Verify Job in Job Board**
   - Navigate to Jobs page
   - **Expected:** New job visible in list
   - Click on job
   - **Expected:** Job details display correctly

3. **Student Applies to Job**
   - Logout and login as student: `student.test@fleaxova.com`
   - Navigate to Jobs page
   - Find the posted job
   - Click "Apply" or view job details
   - Fill application:
     - Cover Letter: `I am interested in this project and have relevant experience...`
     - Bid Amount: `23000`
   - Click "Submit Application"
   - **Expected:** Success message: "Application submitted"

4. **Client Reviews Application**
   - Logout and login as client
   - Navigate to "My Jobs" or Dashboard
   - Click on the posted job
   - View "Applications" section
   - **Expected:** Student's application appears
   - **Expected:** Shows cover letter, bid amount, student profile

5. **Client Accepts Application**
   - Click "Accept" on student's application
   - **Expected:** Application status changes to "Accepted"
   - **Expected:** Other applications marked as "Rejected" (if applicable)
   - **Expected:** Notification sent to student

6. **Student Receives Notification**
   - Login as student
   - Check notifications
   - **Expected:** Notification: "Your application was accepted"

#### Success Criteria:
✅ Job posting successful  
✅ Application submission works  
✅ Client can view applications  
✅ Application status updates correctly  
✅ Notifications sent appropriately

---

### TC008: Order Creation and Status Workflow
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 12 minutes

#### Test Steps:
1. **Client Places Order**
   - Login as client
   - Browse services marketplace
   - Select a service (created from TC005)
   - Click "Order Now"
   - Fill requirements:
     - **Expected:** Requirements form displays
     - Enter: `I need a 5-page website with contact form`
   - Click "Continue to Payment"

2. **Complete Payment**
   - **Expected:** Payment page displays
   - Enter payment details (test mode)
   - Amount shown: Service price
   - Click "Pay Now"
   - **Expected:** Payment successful message
   - **Expected:** Order confirmation displayed

3. **Verify Order Status - Pending**
   - Navigate to client dashboard "My Orders"
   - **Expected:** New order visible
   - **Expected:** Status: "Pending" or "Pending Acceptance"
   - **Expected:** Payment Status: "Completed"

4. **Freelancer Accepts Order**
   - Logout and login as student/freelancer
   - Navigate to "My Orders" or "Incoming Orders"
   - **Expected:** New order visible
   - Click "Accept Order"
   - **Expected:** Confirmation modal
   - Click "Confirm Accept"
   - **Expected:** Order status changes to "In Progress"

5. **Client Receives Notification**
   - Login as client
   - Check notifications
   - **Expected:** Notification: "Order accepted by freelancer"

6. **Freelancer Submits Delivery**
   - Login as freelancer
   - Go to order details
   - Click "Submit Delivery"
   - Upload files or enter delivery message:
     - Message: `Project completed. Here is the website link: https://example.com`
   - Click "Submit"
   - **Expected:** Delivery submitted successfully
   - **Expected:** Order status: "Delivered" or "Under Review"

7. **Client Reviews Delivery**
   - Login as client
   - Navigate to order
   - **Expected:** "Review Delivery" option available
   - View submitted work
   - Click "Approve Delivery"
   - **Expected:** Order status: "Completed"
   - **Expected:** Payment released to freelancer wallet

8. **Verify Payment in Wallet**
   - Login as freelancer
   - Check wallet balance
   - **Expected:** Balance increased by (service price - commission)
   - **Expected:** Transaction history shows payment

#### Success Criteria:
✅ Order creation requires payment first  
✅ Status workflow: Pending → In Progress → Delivered → Completed  
✅ Notifications sent at each stage  
✅ Payment held in escrow until completion  
✅ Wallet balance updates correctly

---

### TC009: Payment Wallet and Withdrawal Process
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 10 minutes

#### Test Steps:
1. **Check Initial Wallet Balance**
   - Login as freelancer with completed order
   - Navigate to "Wallet" page
   - **Expected:** Current balance displayed
   - **Expected:** Transaction history shown

2. **Verify Commission Calculation**
   - Check latest transaction from completed order
   - Service Price: e.g., `5000`
   - Platform Commission (assume 10%): `500`
   - Expected Amount Received: `4500`
   - **Expected:** Wallet shows correct amount after commission

3. **Request Withdrawal**
   - Click "Withdraw Funds"
   - Enter amount: Half of available balance (e.g., `2250`)
   - Select payment method: `Bank Transfer` or `UPI`
   - Enter payment details:
     - Bank Account: `1234567890`
     - IFSC: `ABCD0123456`
     - Name: `John Student`
   - Click "Submit Withdrawal Request"
   - **Expected:** Success message
   - **Expected:** Withdrawal status: "Pending Approval"

4. **Verify Pending Withdrawal**
   - Check "Withdrawal History"
   - **Expected:** New withdrawal request shows as "Pending"
   - **Expected:** Available balance reduced by withdrawal amount (reserved)

5. **Admin Reviews Withdrawal**
   - Logout and login as admin: `admin.test@fleaxova.com`
   - Navigate to Admin Panel → "Withdrawals"
   - **Expected:** Pending withdrawal request visible
   - View withdrawal details
   - Click "Approve Withdrawal"
   - **Expected:** Confirmation modal
   - Click "Confirm Approve"
   - **Expected:** Withdrawal status: "Approved" / "Completed"

6. **Verify Wallet Balance Updated**
   - Login as freelancer
   - Check wallet balance
   - **Expected:** Balance reduced by withdrawal amount
   - **Expected:** Withdrawal history shows "Completed"

7. **Test Withdrawal Exceeding Balance**
   - Try to withdraw amount greater than available balance
   - Enter amount: `999999999`
   - Click "Submit"
   - **Expected:** Error: "Insufficient balance"
   - **Expected:** Withdrawal request not created

8. **Test Minimum Withdrawal Amount**
   - Try to withdraw: `1` (if minimum is higher)
   - **Expected:** Error: "Minimum withdrawal amount is ₹500" (or applicable limit)

#### Success Criteria:
✅ Wallet balance reflects all transactions  
✅ Commission calculated correctly  
✅ Withdrawal request workflow functional  
✅ Admin approval required  
✅ Balance validation prevents over-withdrawal

---

## 💬 Communication Tests

### TC010: Real-Time Messaging Functionality
**Priority:** 🟡 HIGH  
**Estimated Time:** 8 minutes

#### Setup:
- Use two different browsers or incognito/private windows
- Browser A: Client logged in
- Browser B: Freelancer logged in

#### Test Steps:
1. **Client Initiates Chat**
   - Browser A (Client): Navigate to freelancer profile
   - Click "Send Message" or "Contact"
   - **Expected:** Message/chat window opens

2. **Send First Message**
   - Type message: `Hi, I have a question about your service`
   - Click "Send"
   - **Expected:** Message appears in chat window
   - **Expected:** Timestamp displayed

3. **Freelancer Receives Message**
   - Browser B (Freelancer): Navigate to Messages page
   - **Expected:** New message notification appears
   - **Expected:** Chat with client shows in message list
   - Click on chat
   - **Expected:** Client's message displays
   - **Expected:** Message marked as "Delivered"

4. **Freelancer Reads and Replies**
   - Type reply: `Hello! Sure, feel free to ask`
   - Click "Send"
   - **Expected:** Reply sent successfully

5. **Client Receives Reply**
   - Browser A: Check messages (should update automatically)
   - **Expected:** Freelancer's reply appears without page refresh
   - **Expected:** Real-time update within 2-3 seconds

6. **Test Read Receipts**
   - Browser A: Client reads the message
   - Browser B (Freelancer): Check message status
   - **Expected:** Message shows "Read" or double check mark

7. **Test Message History**
   - Both users: Refresh page
   - **Expected:** All previous messages persist
   - **Expected:** Chat history maintained

8. **Test Multiple Conversations**
   - Client: Start chat with another freelancer
   - **Expected:** Separate chat threads maintained
   - **Expected:** No message mixing between conversations

#### Success Criteria:
✅ Messages send successfully  
✅ Real-time delivery (< 5 seconds)  
✅ Read receipts work  
✅ Message history persists  
✅ Multiple conversations handled correctly

---

### TC012: Notification System
**Priority:** 🟡 HIGH  
**Estimated Time:** 6 minutes

#### Test Steps:
1. **Trigger Order Notification**
   - Create a new order (as client)
   - **Expected:** Freelancer receives notification

2. **Check Notification Display**
   - Login as freelancer
   - **Expected:** Notification badge shows unread count
   - Click notifications icon
   - **Expected:** Notification list displays
   - **Expected:** Shows: "New order from [Client Name]"
   - **Expected:** Timestamp visible

3. **Click Notification Link**
   - Click on the notification
   - **Expected:** Redirects to order details page
   - **Expected:** Notification marked as "Read"
   - **Expected:** Badge count decreases

4. **Test Message Notification**
   - Client sends message to freelancer
   - Freelancer: Check notifications
   - **Expected:** Notification: "New message from [Client Name]"

5. **Test Application Notification**
   - Client posts job
   - Student applies to job
   - Client: Check notifications
   - **Expected:** Notification: "New application on [Job Title]"

6. **Verify Notification Persistence**
   - Logout and login again
   - **Expected:** Read and unread notifications still visible
   - **Expected:** Read notifications marked differently (gray/faded)

7. **Test Mark All as Read**
   - Click "Mark All as Read" (if available)
   - **Expected:** All notifications marked as read
   - **Expected:** Notification badge cleared

#### Success Criteria:
✅ Notifications created for key events  
✅ Badge count accurate  
✅ Notifications persist across sessions  
✅ Read/unread states tracked  
✅ Clicking notification navigates correctly

---

## ⭐ Reviews & Admin Tests

### TC011: Review and Rating Submission
**Priority:** 🟡 HIGH  
**Estimated Time:** 7 minutes

#### Test Steps:
1. **Complete an Order First**
   - Ensure you have a completed order (from TC008)
   - Login as client who placed the order

2. **Access Review Form**
   - Navigate to completed order
   - Click "Leave a Review" or "Rate Service"
   - **Expected:** Review form displays

3. **Submit Valid Review**
   - Select rating: 5 stars (click on stars)
   - Enter review text: `Excellent work! Delivered on time and exceeded expectations.`
   - Click "Submit Review"
   - **Expected:** Success message
   - **Expected:** Review saved

4. **Verify Review on Freelancer Profile**
   - Navigate to freelancer's profile page
   - Scroll to reviews section
   - **Expected:** Your review appears
   - **Expected:** Shows:
     - Your name (or anonymous if configured)
     - Star rating
     - Review text
     - Date posted

5. **Test Duplicate Review Protection**
   - Return to the same completed order
   - Try to submit another review
   - **Expected:** "You have already reviewed this order" message
   - **Expected:** Review form disabled or not shown

6. **Test Review Before Completion**
   - Find an in-progress order
   - Try to access review form
   - **Expected:** Review option not available
   - **Expected:** Message: "You can review after order completion"

7. **Verify Review Impact on Rating**
   - Check freelancer's average rating
   - **Expected:** Rating updated to reflect new review
   - Submit another review (from different order): 4 stars
   - **Expected:** Average rating recalculated correctly

#### Success Criteria:
✅ Reviews only allowed after completion  
✅ One review per order enforced  
✅ Reviews display on freelancer profile  
✅ Average rating calculated correctly  
✅ Anti-spam protection works

---

### TC013: Personalized Dashboard Data Accuracy
**Priority:** 🟡 HIGH  
**Estimated Time:** 8 minutes

#### Test Steps for Student Dashboard:
1. **Login as Student**
   - Navigate to Dashboard
   - **Expected:** Dashboard loads

2. **Verify Active Orders Section**
   - Check "Active Orders" widget
   - **Expected:** Shows count of in-progress orders
   - **Expected:** Lists order titles/clients
   - Click on an order
   - **Expected:** Navigates to order details

3. **Verify Services Listed Section**
   - Check "My Services" section
   - **Expected:** Shows all services created by student
   - **Expected:** Display count matches actual services

4. **Verify Application Status**
   - Check "My Applications" section
   - **Expected:** Shows pending, accepted, rejected applications
   - **Expected:** Status badges color-coded (green=accepted, red=rejected, yellow=pending)

5. **Verify Analytics**
   - Check earnings/revenue widget
   - **Expected:** Shows total earnings
   - Check profile views (if available)
   - **Expected:** Shows view count

#### Test Steps for Client Dashboard:
1. **Login as Client**
   - Navigate to Dashboard

2. **Verify Posted Jobs Section**
   - **Expected:** Shows all jobs posted by client
   - **Expected:** Displays application count per job

3. **Verify Active Orders Section**
   - **Expected:** Shows orders placed
   - **Expected:** Status indicators visible

4. **Verify Spending Analytics**
   - **Expected:** Shows total amount spent
   - **Expected:** Displays recent transactions

#### Test Real-Time Updates:
1. **Create New Service (Student)**
   - Create a new service
   - Return to dashboard
   - **Expected:** Service count increases immediately
   - **Expected:** Update within 5 seconds

2. **Place New Order (Client)**
   - Place order on a service
   - Check dashboard
   - **Expected:** Active orders count updates
   - **Expected:** Spending total increases

#### Success Criteria:
✅ Dashboard shows accurate data  
✅ All sections display correct counts  
✅ Data updates in near real-time (< 5 sec)  
✅ Navigation from dashboard widgets works  
✅ Analytics calculations correct

---

### TC014: Admin Panel - User and Service Moderation
**Priority:** 🟡 HIGH  
**Estimated Time:** 10 minutes

#### Test Steps:
1. **Access Admin Panel**
   - Login as admin: `admin.test@fleaxova.com`
   - Navigate to Admin Panel (usually `/admin` route)
   - **Expected:** Admin dashboard displays
   - **Expected:** Shows overview statistics

2. **User Management - View Users**
   - Click "Users" or "User Management"
   - **Expected:** List of all users displays
   - **Expected:** Shows: Name, Email, Role, Status, Registration Date

3. **Search Users**
   - Enter search term: `student`
   - **Expected:** Filters to show only users with "student" in name/email
   - Clear search
   - Filter by role: Select "Client"
   - **Expected:** Only client users shown

4. **Moderate User Account**
   - Select a test user
   - Click "View Details" or "Edit"
   - Click "Suspend Account"
   - **Expected:** Confirmation modal appears
   - Click "Confirm"
   - **Expected:** User status: "Suspended"
   - **Expected:** Action logged in admin logs

5. **Verify Suspension Effect**
   - Logout from admin
   - Try to login as suspended user
   - **Expected:** Login blocked
   - **Expected:** Error: "Your account has been suspended"

6. **Reactivate User**
   - Login as admin again
   - Find suspended user
   - Click "Reactivate Account"
   - **Expected:** User status: "Active"

7. **Service Management - View Services**
   - Navigate to "Services" section in admin panel
   - **Expected:** All services listed
   - **Expected:** Shows: Title, Freelancer, Category, Price, Status

8. **Moderate Service Listing**
   - Find a service to review
   - Click "Edit" or "Moderate"
   - Options available: Approve, Edit, Remove
   - Click "Remove Service"
   - Enter reason: `Violates platform policies`
   - Click "Confirm"
   - **Expected:** Service status: "Removed" or deleted
   - **Expected:** Service no longer visible in marketplace

9. **View Moderation Logs**
   - Navigate to "Activity Logs" or "Audit Trail"
   - **Expected:** All moderation actions logged
   - **Expected:** Shows: Admin name, action, timestamp, target user/service

#### Success Criteria:
✅ Admin panel accessible only to admin role  
✅ User list displays all users  
✅ Search and filter functions work  
✅ User suspension/reactivation functional  
✅ Service moderation works  
✅ All actions logged for audit

---

## 🔧 Infrastructure Tests

### TC016: API Endpoint Validation and Error Handling
**Priority:** 🟡 HIGH  
**Estimated Time:** 8 minutes

#### Prerequisites:
- API testing tool (Postman, Thunder Client, or browser DevTools)
- Backend running on `http://localhost:9099`

#### Test Steps:
1. **Test Missing Required Fields**
   - API: `POST /api/services`
   - Headers: `Authorization: Bearer [valid_token]`
   - Body (JSON):
     ```json
     {
       "title": "Test Service"
       // missing description, price, category
     }
     ```
   - Send request
   - **Expected:** Status Code: `400 Bad Request`
   - **Expected:** Response contains validation errors:
     ```json
     {
       "errors": [
         "Description is required",
         "Price is required",
         "Category is required"
       ]
     }
     ```

2. **Test Unauthorized Access**
   - API: `GET /api/orders/123`
   - Headers: No Authorization header
   - Send request
   - **Expected:** Status Code: `401 Unauthorized`
   - **Expected:** Response:
     ```json
     {
       "error": "Authentication required"
     }
     ```

3. **Test Invalid JWT Token**
   - API: `GET /api/profile`
   - Headers: `Authorization: Bearer invalid_token_12345`
   - Send request
   - **Expected:** Status Code: `401 Unauthorized`
   - **Expected:** Response:
     ```json
     {
       "error": "Invalid token"
     }
     ```

4. **Test Insufficient Permissions**
   - Login as student, get token
   - API: `POST /api/jobs` (only clients allowed)
   - Headers: `Authorization: Bearer [student_token]`
   - Body: Valid job data
   - Send request
   - **Expected:** Status Code: `403 Forbidden`
   - **Expected:** Response:
     ```json
     {
       "error": "Only clients can create jobs"
     }
     ```

5. **Test Resource Not Found**
   - API: `GET /api/services/99999999-9999-9999-9999-999999999999`
   - Headers: Valid auth token
   - Send request
   - **Expected:** Status Code: `404 Not Found`
   - **Expected:** Response:
     ```json
     {
       "error": "Service not found"
     }
     ```

6. **Test Validation - Invalid Email**
   - API: `POST /api/auth/register`
   - Body:
     ```json
     {
       "name": "Test",
       "email": "notanemail",
       "password": "Pass@123"
     }
     ```
   - Send request
   - **Expected:** Status Code: `400 Bad Request`
   - **Expected:** Error: "Invalid email format"

#### Success Criteria:
✅ API returns appropriate HTTP status codes  
✅ Error messages are descriptive  
✅ Validation errors clearly list all issues  
✅ Unauthorized requests properly blocked  
✅ No sensitive data in error responses

---

### TC017: Responsive UI/UX on Desktop and Mobile
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 10 minutes

#### Test Steps - Desktop:
1. **Test Landing Page**
   - Open `http://localhost:5173` in desktop browser
   - **Expected:** Page loads within 3 seconds
   - **Expected:** Hero section visible
   - **Expected:** Features section displays
   - **Expected:** Corporate white/black/gray styling applied
   - **Expected:** No visual defects (overlapping text, broken images)

2. **Test Navigation**
   - **Expected:** Navbar displays horizontally
   - **Expected:** Logo visible on left
   - **Expected:** Menu items visible: Home, Services, Jobs, Login, Register
   - Hover over menu items
   - **Expected:** Hover effects work smoothly

3. **Test Forms**
   - Navigate to registration page
   - **Expected:** Form fields properly sized
   - **Expected:** Input fields have adequate spacing
   - **Expected:** Buttons clearly visible

#### Test Steps - Mobile:
1. **Open DevTools Mobile Emulation**
   - Press F12 → Toggle device toolbar
   - Select device: iPhone 12 Pro (390x844)

2. **Test Landing Page on Mobile**
   - **Expected:** Layout adapts to mobile viewport
   - **Expected:** Text is legible (not too small)
   - **Expected:** Images scale appropriately
   - **Expected:** No horizontal scrolling

3. **Test Mobile Navigation**
   - **Expected:** Hamburger menu icon visible (instead of full navbar)
   - Click hamburger icon
   - **Expected:** Mobile menu slides in/drops down
   - **Expected:** All menu items accessible
   - **Expected:** Menu closes when item clicked

4. **Test Forms on Mobile**
   - Navigate to login page
   - **Expected:** Input fields full width
   - **Expected:** Touch targets at least 44x44 pixels
   - **Expected:** Keyboard doesn't obscure fields
   - **Expected:** Submit button easily tappable

5. **Test Dashboard on Mobile**
   - Login and navigate to dashboard
   - **Expected:** Cards stack vertically
   - **Expected:** No content cutoff
   - **Expected:** All buttons accessible

6. **Test Different Screen Sizes**
   - Test on:
     - iPhone SE (375x667)
     - iPad (768x1024)
     - iPad Pro (1024x1366)
   - **Expected:** Layout adapts appropriately for each size
   - **Expected:** Tablet shows hybrid layout (not full mobile, not full desktop)

7. **Test Landscape Orientation**
   - Rotate device to landscape
   - **Expected:** Layout adjusts gracefully
   - **Expected:** Content remains accessible

#### Success Criteria:
✅ Desktop layout clean and professional  
✅ Mobile layout fully functional  
✅ Hamburger menu works on mobile  
✅ Forms usable on all screen sizes  
✅ No broken layouts or overlaps  
✅ Touch targets adequate size on mobile

---

## 📊 Test Results Template

Use this template to document your test results:

```markdown
# Test Execution Report
**Date:** [Date]
**Tester:** [Your Name]
**Environment:** [Development/Staging/Production]

## Test Summary
- Total Tests: 18
- Passed: __
- Failed: __
- Blocked: __
- Not Executed: __

## Detailed Results

### TC001: User Registration with Valid Data
- Status: [ ] PASS [ ] FAIL [ ] BLOCKED
- Execution Time: __ minutes
- Issues Found:
  - [List any bugs or issues]
- Screenshots: [Attach if failed]
- Notes:

### TC002: User Registration with Invalid Data
- Status: [ ] PASS [ ] FAIL [ ] BLOCKED
- Execution Time: __ minutes
- Issues Found:
- Screenshots:
- Notes:

[... Continue for all test cases ...]

## Critical Bugs Found
1. [Bug Title] - Severity: [High/Medium/Low]
   - Description:
   - Steps to Reproduce:
   - Expected vs Actual:
   - Screenshots:

## Recommendations
- [List any suggestions for improvement]

## Sign-off
Tested By: __________
Date: __________
```

---

## 🎯 Test Execution Tips

### Best Practices:
1. **Clear Test Data**: Reset database between major test runs
2. **Console Monitoring**: Keep browser console open to catch JavaScript errors
3. **Network Tab**: Monitor API calls for failures
4. **Screenshot Failures**: Document all failed tests with screenshots
5. **Test in Order**: Execute tests in the order listed for dependencies

### Common Issues to Watch For:
- CORS errors in browser console
- 500 Internal Server Error (backend issues)
- JWT token expiry during long test sessions
- Database connection timeouts
- Validation messages not displaying
- Form submission errors

### Reporting Bugs:
When you find a bug, include:
1. Test case ID (e.g., TC001)
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots/videos
6. Browser/device info
7. Console errors (if any)

---

## 📞 Support

If you encounter issues during testing:
1. Check the console for error messages
2. Verify backend server is running (`http://localhost:9099`)
3. Verify frontend server is running (`http://localhost:5173`)
4. Check database connectivity
5. Review test data setup

---

**End of Manual Testing Guide**
