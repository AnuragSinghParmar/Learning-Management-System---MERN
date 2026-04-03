# EDU Portal - School Management System

A premium MERN stack application for managing school activities, built with React, Tailwind CSS, Express, and MongoDB.

## Features

- **Admin Dashboard**: Manage users, events, and announcements.
- **Teacher Dashboard**: Class schedules, attendance, assignments, and notes.
- **Student Dashboard**: View assignments, download notes, lost & found, chat.
- **Authentication**: Secure role-based login (Admin, Teacher, Student).

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Deployment**: Configured for Vercel.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    - Create a `.env` file in the root directory.
    - Copy the contents from `.env.example` into it.
    - Fill in your `MONGO_URI` and `JWT_SECRET`.

3.  **Database Seeding**:
    - Run the seed script to create an initial Admin account:
    ```bash
    node seed.js
    ```
    - **Default Admin Credentials:**
      - Email: `admin@example.com`
      - Password: `admin123`

4.  **Run Locally**:
    - **Frontend**: `npm run dev`
    - **Backend**: `node server/index.js` (or use `nodemon server/index.js`)


## Project Structure

- `/src`: Frontend React Application
- `/server`: Backend Express Application logic
- `/api`: Serverless entry point for Vercel
