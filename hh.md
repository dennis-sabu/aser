Build a complete, production-quality web application called **Campus Resource Network**.

## 1. PRODUCT IDEA

Campus Resource Network is a **verified student-only campus platform** that helps students discover and share things, skills, and transportation that already exist within their campus.

The core idea is:

**Need → Discover → Match → Connect → Share → Complete → Review**

The platform should feel like a combination of:

* Campus marketplace
* Resource-sharing network
* Student skill network
* Shared-ride platform
* Campus community

But everything is centered around **one verified campus ecosystem**.

---

# 2. DESIGN DIRECTION

Use the existing product design as the **primary visual reference**.

Do NOT create a completely different visual language.

Maintain:

* Same color system
* Same typography style
* Same border radius
* Same card style
* Same spacing system
* Same button styles
* Same icon style
* Same navigation style
* Same visual hierarchy
* Same overall modern student-tech aesthetic

The website should feel like a polished startup product, not a generic college website.

Design should be:

* Modern
* Clean
* Fast
* Minimal
* Professional
* Student-friendly
* Mobile-first
* Responsive
* Accessible

Avoid:

* Excessive gradients
* Generic corporate stock imagery
* Excessive animations
* Overcrowded dashboards
* Huge paragraphs
* Fake statistics
* Unnecessary AI features

Use animations only where they improve the experience.

---

# 3. TECH STACK

Use:

### Frontend

**Next.js + TypeScript**

### Styling

**Tailwind CSS**

### UI

Reusable component architecture.

### Backend

**FastAPI + Python**

### Database

**PostgreSQL through Supabase**

### Authentication

**Supabase Auth**

### Storage

**Supabase Storage**

### Realtime

**Supabase Realtime**

### Notifications

**Firebase Cloud Messaging**

### Deployment

Frontend:
**Vercel**

Backend:
Cloud-hosted FastAPI service.

---

# 4. USER TYPES

There are two primary user types.

## Student

Can:

* Search resources
* Create listings
* Create requests
* Join rides
* Create rides
* Add skills
* Request help
* Chat
* Rate users
* Report users

## Admin

Can:

* Manage users
* Verify students
* Moderate resources
* Manage reports
* Manage requests
* Manage rides
* View platform analytics
* Suspend users
* Remove inappropriate listings

---

# 5. AUTHENTICATION

Create:

### Login

Fields:

* College email
* Password

### Signup

Fields:

* Full name
* College email
* Student ID
* Department
* Year
* Password

Verification:

**Signup → Email/OTP verification → Student profile → Home**

Only verified students should have access to campus interactions.

Show:

**✓ Verified Student**

on verified profiles.

---

# 6. MAIN NAVIGATION

Desktop navigation:

```text
Logo

Home
Discover
Resources
I Need
Rides
Skills

Search

Notifications
Messages
Profile
```

Mobile navigation:

```text
Home
Discover
+
Activity
Profile
```

The `+` button should provide quick actions:

```text
Add Resource
Post Need
Create Ride
Add Skill
```

---

# 7. HOME PAGE

Create a useful campus dashboard.

Hero section:

### "What do you need today?"

Large search box:

**Search resources, skills, rides, or people...**

Quick actions:

```text
Find Resource
I Need
Find Ride
Find Skill
```

Then sections:

### Nearby Resources

Show resource cards.

### Active Requests

Show student requests.

### Available Rides

Show ride cards.

### Students With Skills

Show skill profiles.

### Recommended For You

Personalized based on:

* Department
* Year
* Previous activity
* Location
* Interests

Do not over-personalize without enough data.

---

# 8. DISCOVER PAGE

Create a global campus discovery page.

Tabs:

```text
All
Resources
Requests
Rides
Skills
Students
```

Search:

```text
"What are you looking for?"
```

Filters:

### Resources

* Category
* Buy
* Sell
* Borrow
* Rent
* Free
* Exchange
* Distance
* Availability
* Condition

### Rides

* From
* To
* Date
* Time
* Available seats

### Skills

* Skill
* Experience
* Department
* Availability

Results should update dynamically.

---

# 9. RESOURCE MARKETPLACE

Resources are the main physical-sharing feature.

Categories:

```text
Electronics
Books
Project Components
Tools
Lab Equipment
Calculators
Cameras
Sports
Hostel Items
Other
```

Each resource card should show:

* Image
* Title
* Category
* Condition
* Owner
* Location
* Availability
* Price if applicable
* Sharing method
* Verification/reputation

Sharing methods:

```text
Sell
Rent
Borrow
Give Away
Exchange
```

---

# 10. RESOURCE DETAIL PAGE

Show:

* Large images
* Resource name
* Description
* Condition
* Owner
* Owner reputation
* Location
* Availability
* Price
* Terms

Primary CTA:

**Request This Resource**

Secondary:

**Save**

Flow:

```text
Open Resource
↓
Request
↓
Owner receives request
↓
Owner accepts
↓
Chat opens
↓
Exchange
↓
Complete
↓
Review
```

---

# 11. CREATE RESOURCE

Create a multi-step form.

### Step 1

Upload images.

### Step 2

Resource name.

### Step 3

Category.

### Step 4

Description.

### Step 5

Condition.

Options:

```text
New
Like New
Good
Used
Needs Repair
```

### Step 6

Sharing method:

```text
Sell
Rent
Borrow
Free
Exchange
```

### Step 7

Price / terms.

### Step 8

Location.

### Step 9

Availability.

### Step 10

Preview → Publish.

---

# 12. "I NEED" FEATURE

This is one of the most important features.

Page title:

## "What do you need?"

Student creates a request.

Fields:

* What do you need?
* Category
* Description
* Deadline
* Duration
* Budget
* Location
* Optional image

Example:

```text
I need:
ESP32

Required:
Tomorrow

Duration:
3 days

Budget:
₹0–100
```

After posting:

```text
Request
↓
Matching resources/students
↓
Responses
↓
Requester selects one
↓
Connect
↓
Complete
```

Request states:

```text
Open
Matching
Accepted
Completed
Expired
Cancelled
```

---

# 13. MATCHING SYSTEM

Initially use rule-based matching.

Match using:

```text
Item similarity
+
Category
+
Availability
+
Location
+
Budget
```

Example:

```text
Need: ESP32

Matches:

Student A
ESP32
500m away
Available tomorrow

Student B
ESP32
1.2km away
Available today

Student C
ESP32 DevKit
800m away
Available tomorrow
```

Later architecture should allow AI/semantic matching.

Do NOT require AI for the initial MVP.

---

# 14. RIDES

Create a dedicated ride-sharing system.

## Find Ride

Search:

```text
From
To
Date
Time
```

Ride cards show:

* Creator
* Route
* Date
* Time
* Seats
* Approximate cost
* Vehicle type
* Reputation

CTA:

**Request Seat**

---

# 15. CREATE RIDE

Fields:

* Starting location
* Destination
* Date
* Time
* Seats available
* Vehicle type
* Estimated cost
* Notes

Flow:

```text
Create Ride
↓
Publish
↓
Students discover
↓
Request seat
↓
Creator accepts
↓
Ride confirmed
↓
Travel
↓
Complete
↓
Review
```

---

# 16. SKILLS

Create a student skill network.

Examples:

```text
Python
Flutter
Arduino
PCB Design
CAD
Java
Photography
Video Editing
UI Design
3D Printing
```

Skill profile should show:

* Student
* Skill
* Experience level
* Department
* Availability
* Free/Paid/Exchange
* Reputation

CTA:

**Request Help**

---

# 17. ADD SKILL

Form:

```text
Skill
Experience level
Description
Availability
Free / Paid / Exchange
```

Publish to profile.

---

# 18. CHAT

Create real-time chat.

Chat should generally become available after:

* Resource request
* Ride acceptance
* Skill request
* I Need response

Chat features:

* Text
* Image
* Resource reference
* Ride reference
* Report
* Block

Show conversation context at the top.

Example:

```text
ESP32 Request
Status: Accepted
```

---

# 19. NOTIFICATIONS

Create notification center.

Notification examples:

```text
Someone requested your ESP32.

Your ride request was accepted.

Rahul responded to your request.

Your borrowed item is due tomorrow.

You received a new message.

Your listing is about to expire.
```

Use realtime updates where appropriate.

---

# 20. SAVED ITEMS

Allow students to save:

* Resources
* Rides
* Skills
* Requests

Page:

## Saved

Tabs:

```text
Resources
Rides
Skills
Requests
```

---

# 21. MY ACTIVITY

Create a unified activity page.

Sections:

```text
My Resources
My Requests
My Rides
My Skills
Borrowed Items
Transactions
Reviews
```

Show status clearly.

---

# 22. BORROWING SYSTEM

For borrowed resources:

```text
Requested
↓
Accepted
↓
Handover
↓
Borrowed
↓
Return Reminder
↓
Returned
↓
Owner Confirms
↓
Completed
```

Show return date prominently.

Send reminders before the return deadline.

---

# 23. TRANSACTIONS

Track:

* Resource
* Buyer/borrower
* Owner
* Date
* Type
* Amount
* Status

Statuses:

```text
Pending
Accepted
Active
Completed
Cancelled
Disputed
```

---

# 24. RATINGS & REPUTATION

After completion:

```text
★★★★★
How was your experience?
```

Optional feedback.

Profile reputation can show:

```text
Verified Student ✓

4.8 ★
24 completed interactions
12 successful resource exchanges
5 completed rides
7 returned items
```

Do not present reputation as an absolute measure of a person's character.

---

# 25. PROFILE

Profile page:

```text
Profile photo
Name
Department
Year
College
Verified ✓
Rating

Skills
Resources
Requests
Rides
Reviews
Activity
```

Allow editing:

* Profile photo
* Bio
* Department/year where permitted
* Skills
* Preferences
* Location

---

# 26. USER SAFETY

Every relevant user interaction should provide:

**Report**

Reasons:

```text
Scam
Fake listing
Harassment
Unsafe ride
Inappropriate content
Resource not returned
Other
```

Also provide:

**Block User**

---

# 27. ADMIN DASHBOARD

Create a separate admin interface.

Dashboard metrics:

```text
Total Students
Verified Students
Active Resources
Active Requests
Active Rides
Successful Matches
Reports
```

Admin pages:

```text
Users
Resources
Requests
Rides
Reports
Transactions
Categories
Settings
```

---

# 28. ADMIN USER MANAGEMENT

Admin can:

* View user
* Verify
* Suspend
* Reactivate
* Review reports
* View activity

Do not expose private information unnecessarily.

---

# 29. ADMIN MODERATION

Report flow:

```text
Report
↓
Admin review
↓
Inspect relevant content/user
↓
Take action
↓
Resolve
```

Actions:

```text
Dismiss
Warn
Remove Content
Restrict User
Suspend User
```

---

# 30. DATABASE STRUCTURE

Use PostgreSQL/Supabase.

Main tables:

```text
users
profiles
resources
resource_requests
needs
rides
ride_members
skills
skill_requests
conversations
messages
notifications
saved_items
transactions
reviews
reports
categories
```

Relationships must be properly normalized.

Use:

* Foreign keys
* Indexes
* Timestamps
* Status fields
* UUIDs

---

# 31. SECURITY

Use Supabase Row Level Security.

Important rules:

Students should only be able to:

* Edit their own profile
* Edit their own listings
* Edit their own requests
* Manage their own rides
* Read conversations they belong to
* Create reviews only for completed interactions
* Manage their own saved items

Admin permissions must be separate.

Never expose:

* Service-role keys
* Database passwords
* Private credentials
* Internal moderation data

---

# 32. RESPONSIVE DESIGN

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Mobile should not simply be a scaled-down desktop.

Create proper mobile layouts.

---

# 33. EMPTY STATES

Every page needs a useful empty state.

Examples:

### No Resources

**“Nothing here yet.”**

CTA:

**Add the first resource**

### No Requests

**“No active requests.”**

CTA:

**Post what you need**

### No Rides

**“No rides matching your route.”**

CTA:

**Create a ride**

### No Messages

**“Your conversations will appear here.”**

---

# 34. LOADING & ERROR STATES

Every data-driven page needs:

* Skeleton loading
* Empty state
* Error state
* Retry action
* Success confirmation

Do not leave blank screens while data loads.

---

# 35. SEARCH EXPERIENCE

Search should feel extremely fast.

Global search should understand:

```text
ESP32
Arduino
Kottayam
PCB design
Calculus textbook
Taxi to Ernakulam
```

Results should intelligently route users to:

```text
Resource
Person
Skill
Ride
Request
```

---

# 36. PERFORMANCE

Optimize for:

* Fast initial load
* Image optimization
* Lazy loading
* Pagination
* Debounced search
* Cached queries
* Efficient database queries

Avoid unnecessary API calls.

---

# 37. COMPONENT SYSTEM

Build reusable components:

```text
Button
Input
SearchBar
Card
ResourceCard
RideCard
SkillCard
RequestCard
ProfileCard
Avatar
Badge
Modal
Drawer
Toast
Tabs
Dropdown
Filter
Pagination
Skeleton
EmptyState
ErrorState
StatusBadge
```

Do not duplicate UI code.

---

# 38. API STRUCTURE

FastAPI endpoints should be organized by domain.

Example:

```text
/api/auth
/api/users
/api/resources
/api/requests
/api/needs
/api/rides
/api/skills
/api/messages
/api/notifications
/api/transactions
/api/reviews
/api/reports
```

Use clear REST conventions.

---

# 39. REAL-TIME FEATURES

Use realtime where it actually matters:

* Chat
* Notifications
* Request status
* Ride status
* Resource availability

Do not use realtime unnecessarily for static data.

---

# 40. ANALYTICS

Track product events such as:

```text
signup_completed
resource_created
resource_viewed
resource_requested
request_accepted
need_created
need_matched
ride_created
ride_joined
skill_created
skill_requested
transaction_completed
review_submitted
```

Important product metrics:

### Activation

Students who complete their profile.

### Supply

Number of active resources.

### Demand

Number of active requests.

### Matching

Percentage of requests receiving a response.

### Success

Completed exchanges/rides/help requests.

### Retention

Students returning and using the platform again.

---

# 41. MVP PRIORITY

Do NOT attempt to perfect every feature at once.

### Phase 1

Build:

```text
Authentication
Profile
Resources
Search
I Need
Basic requests
```

### Phase 2

Add:

```text
Rides
Skills
Chat
Notifications
Ratings
```

### Phase 3

Add:

```text
Admin
Reports
Analytics
Advanced matching
```

### Phase 4

Potential future features:

```text
AI search
Smart matching
Demand prediction
Multi-campus discovery
Institutional tools
```

---

# 42. CORE USER JOURNEYS

The most important journey is:

```text
Student has a need
        ↓
Search / I Need
        ↓
Find matching resource/person
        ↓
Request
        ↓
Accept
        ↓
Connect
        ↓
Share / Help / Ride
        ↓
Complete
        ↓
Review
```

### Resource journey

```text
Create listing
↓
Student discovers
↓
Request
↓
Accept
↓
Chat
↓
Exchange
↓
Complete
↓
Review
```

### Ride journey

```text
Create ride
↓
Student discovers
↓
Request seat
↓
Accept
↓
Ride
↓
Complete
↓
Review
```

### Skill journey

```text
Add skill
↓
Student discovers
↓
Request help
↓
Accept
↓
Chat
↓
Help
↓
Complete
↓
Review
```

---

# 43. THE PRODUCT PRINCIPLE

Every feature should answer one question:

> **“Does this help a student find something they need, provide something useful, or connect with another student?”**

If a feature does not support that goal, do not add it to the MVP.

---

# 44. FINAL PRODUCT STRUCTURE

```text
Campus Resource Network
│
├── Authentication
│
├── Home
│
├── Discover
│   ├── Resources
│   ├── Requests
│   ├── Rides
│   └── Skills
│
├── Resources
│   ├── Browse
│   ├── Details
│   ├── Create
│   └── Manage
│
├── I Need
│   ├── Browse
│   ├── Create
│   └── Responses
│
├── Rides
│   ├── Browse
│   ├── Create
│   └── Manage
│
├── Skills
│   ├── Browse
│   ├── Profile
│   └── Request Help
│
├── Chat
│
├── Notifications
│
├── Activity
│
├── Profile
│
└── Admin
    ├── Dashboard
    ├── Users
    ├── Resources
    ├── Requests
    ├── Rides
    ├── Reports
    └── Analytics
```

## FINAL INSTRUCTION

Build this as a **real functional product**, not a static UI prototype.

Use the existing design language consistently.

Implement the application in logical phases, starting with:

**Authentication → Profile → Home → Resources → Search → I Need → Rides → Skills → Chat → Notifications → Ratings → Admin.**

Every feature must have its complete user flow, backend integration, database interaction, validation, loading state, empty state, error state, success state, and responsive UI.

Prioritize **clarity, speed, trust, and simplicity**.

The core experience must always remain:

# **NEED → MATCH → CONNECT → SHARE**
