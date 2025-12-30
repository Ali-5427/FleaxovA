# FleaxovA - Premium Student Freelancing Platform

FleaxovA is a corporate-grade, full-stack freelancing platform designed exclusively for students to offer paid services.

## Technical Stack

*   **Frontend**: React (Vite), TailwindCSS, React Router, Axios, Lucide Icons
*   **Backend**: Node.js, Express, Mongoose (MongoDB)
*   **Authentication**: JWT (JSON Web Tokens), Role-Based Access Control (Student vs Client)
*   **Security**: Bcrypt, Helmet, CORS, Private/Protected Routes

## Prerequisites

*   Node.js (v14 or higher)
*   MongoDB (Must be running locally on default port 27017)

## Installation & Setup

1.  **Install Dependencies**
    Run the following command in the root directory:
    ```bash
    npm install
    npm run install-all
    ```
    *(This installs `concurrently` in root, and all dependencies in `server` and `client` folders)*

2.  **Environment Configuration**
    *   **Server**: Check `server/.env`. Default configuration:
        ```env
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/fleaxova
        JWT_SECRET=fleaxova_secret_key_change_this_for_production
        ```

3.  **Run the Application**
    From the root directory, run:
    ```bash
    npm run dev
    ```
    This will start:
    *   **Backend API** at `http://localhost:5000`
    *   **Frontend App** at `http://localhost:5173` (or similar port)

## User Flows

1.  **Register**: Sign up as a "Student" (to sell) or "Client" (to buy).
2.  **Dashboard**: 
    *   Students see their services and orders.
    *   Clients see their placed orders.
3.  **Create Service** (Student Only): Post a new paid-only service.
4.  **Order Service** (Client): Browse services -> Click "Order Now" -> "Secure Payment" -> Order confirmed.

## Project Structure

*   **/server**: Express API Backend
    *   `src/models`: Database Schemas (User, Profile, Service, Order)
    *   `src/controllers`: Business Logic
    *   `src/routes`: API Endpoints
    *   `src/middleware`: Auth protection
*   **/client**: React Frontend
    *   `src/pages`: Full page views
    *   `src/components`: Reusable UI parts (Navbar, ProtectedRoute)
    *   `src/context`: Global Auth State
