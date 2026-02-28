🏗️ Digital Product Warranty Management System — Architecture Document
⭐ 1. System Overview
Project Name

Digital Product Warranty Management System

Goal

A web application that allows users to:

store product purchase details

upload bills/warranty documents

track warranty expiry

receive reminders

access service information

auto-extract data from uploaded receipts (OCR)

Architecture Style
Monolithic Web Application
REST API + MVC Architecture

Why this architecture?

fast development (hackathon friendly)

easy debugging

scalable

production-ready structure

simple deployment

⭐ 2. Technology Stack
Backend

Node.js

Express.js

REST API

MVC architecture

Database & Services

Supabase PostgreSQL (database)

Supabase Authentication

Supabase Storage (file uploads)

Frontend

React or HTML/CSS/JavaScript

Responsive dashboard UI

Background Services

node-cron (warranty reminders)

OCR service (bill scanning)

⭐ 3. High-Level System Architecture
Overall Flow
User (Browser)
      ↓
Frontend UI
      ↓
Express REST API (Node.js)
      ↓
Business Logic Layer
      ↓
Supabase Database + Storage
      ↓
Background Services (OCR + Reminders)

System Components
1️⃣ Client Layer (Frontend)

login/signup UI

dashboard

product entry form

receipt upload

warranty status view

2️⃣ API Layer (Express Server)

Handles:

authentication

product management

warranty tracking

file upload

reminders

OCR processing

3️⃣ Business Logic Layer

warranty expiry calculation

validation rules

OCR text processing

notification logic

4️⃣ Data Layer

Supabase PostgreSQL database

Supabase Storage

Supabase Auth

5️⃣ Background Services

scheduled warranty reminders

OCR processing

notification system

⭐ 4. Backend Architecture (MVC Pattern)
Request Flow
Route → Controller → Service → Repository → Database

Responsibilities
Routes

define API endpoints

route requests

Controllers

handle request and response

call services

Services

business logic

warranty calculation

OCR processing

reminder logic

Repositories

database operations

Supabase queries

Middleware

authentication

validation

error handling

⭐ 5. Backend Folder Structure
backend/
│
├── src/
│   ├── config/
│   │   └── supabase.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── warrantyRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── cron/
│   │   └── warrantyReminderJob.js
│   │
│   ├── utils/
│   └── server.js
│
├── package.json
└── .env

⭐ 6. Frontend Architecture
Structure
frontend/
│
├── pages/
│   ├── Login
│   ├── Signup
│   ├── Dashboard
│   └── ProductDetails
│
├── components/
│   ├── ProductCard
│   ├── UploadForm
│   └── Navbar
│
└── services/
    └── api.js

Frontend Responsibilities

authentication UI

product entry

receipt upload

warranty dashboard

API communication

⭐ 7. Data Flow Design
Product Registration Flow
User uploads receipt
→ Frontend sends request
→ API receives data
→ OCR extracts text (optional)
→ Product saved to database
→ Warranty expiry calculated
→ Response returned to UI

Warranty Reminder Flow
Cron job runs daily
→ Check warranty expiry dates
→ Find expiring warranties
→ Create notification
→ Notify user

⭐ 8. API Design (REST)
Authentication
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/profile

Product Management
POST /api/products
GET /api/products
PUT /api/products/:id
DELETE /api/products/:id

Warranty Tracking
GET /api/warranties/active
GET /api/warranties/expiring

File Upload
POST /api/upload/receipt

⭐ 9. Database Design
Tables
Users
id (Primary Key)
email
password
created_at

Products
id (Primary Key)
user_id (Foreign Key → users)
name
brand
category
purchase_date
created_at

Warranties
id (Primary Key)
product_id (Foreign Key → products)
expiry_date
duration
status

Documents
id (Primary Key)
product_id (Foreign Key → products)
file_url
uploaded_at

Notifications
id (Primary Key)
user_id (Foreign Key → users)
message
status
created_at

Relationships
User → Products (1:N)
Product → Warranty (1:1)
Product → Documents (1:N)
User → Notifications (1:N)

⭐ 10. Security Design

JWT authentication

protected routes

input validation

file upload validation

Supabase row-level security

environment variables

⭐ 11. Scalability & Performance

modular architecture

async operations

database indexing

stateless API

cloud deployment ready

⭐ 12. Innovation Extension Layer (Hackathon Impact)

Optional modules:

receipt OCR scanning

barcode product detection

AI data extraction

warranty analytics dashboard

✅ Architecture Ready

You can now:

✔ save this
✔ show to judges
✔ use to build backend
✔ use to design database