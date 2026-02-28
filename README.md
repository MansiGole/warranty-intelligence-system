Warranty Intelligence System
------------------------------------------------------
A full-stack Warranty Management & Reminder Platform built using React (Vite), Node.js, Express, and Supabase (PostgreSQL).
Developed as part of a hackathon team project.

---------------
🌐 Live Demo
--------------------------------
Frontend (Vercel):
👉 https://warranty-intelligence-system.vercel.app

---------------
🚀 Key Features
-----------------------------------------
JWT-based user authentication

Add, manage, and track product warranties

Receipt upload with OCR-based data extraction

Automated email reminders before warranty expiry

Real-time warranty status dashboard

Secure backend integration with Supabase


--------------------
🛠 Tech Stack
---------------------------
Frontend
--
React (Vite)

Tailwind CSS

Axios

Backend
-----------
Node.js

Express.js

Supabase (PostgreSQL)

JWT Authentication

Nodemailer (SMTP Email Service)


📂 Project Structure
--------------------
Backend/
frontend/

---------------------
🔐 Environment Setup
-----------------------------------------
Create a .env file inside the Backend folder:

PORT=5000

SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

JWT_SECRET=your_secret

EMAIL_USER=your_email

EMAIL_PASS=your_app_password


💻 Local Installation
---------------------------------
Backend

cd Backend

npm install

npm start

Frontend

cd frontend

npm install

npm run dev

--------------------------------
👩‍💻 My Contribution
---------------------------------------------
Implemented backend API routes using Express.js

Integrated Supabase database connectivity

Configured JWT-based authentication

Built automated email reminder module using Nodemailer

Collaborated in a team-based hackathon environment

----------------------------
🔮 Future Improvements
---------------------------------
Backend deployment (Render/Railway)

Role-based access control

Analytics dashboard

Cloud storage integration for receipts

------------
Now run:

git add README.md

git commit -m "Final professional README with live demo link"
git push
