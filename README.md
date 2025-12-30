# FleaxovA 🚀
### **Premium Student Freelancing Marketplace**

FleaxovA is a corporate-grade, full-stack platform designed exclusively for students to offer professional services. Built with a focus on trust and security, it ensures that student talent is fairly compensated through a "payment-first" escrow system.

---

## ✨ Features

*   🎓 **Student-First Ecosystem**: Registration and verified profiles designed specifically for student freelancers.
*   💳 **Secure Escrow Payments**: No more "free work." Payments are collected upfront and released only upon successful delivery.
*   🛍️ **Service Marketplace**: A sleek discovery interface for services ranging from Web Development to AI Research.
*   📊 **Professional Dashboard**: Dedicated tracking systems for both Clients (buyers) and Students (sellers) to manage active orders.
*   🔐 **Role-Based Access**: Secure JWT-based authentication with distinct workflows for Students, Clients, and Admins.
*   🌑 **Corporate Aesthetic**: A minimalist, high-end UI/UX built with TailwindCSS for maximum credibility.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), TailwindCSS, React Router, Lucide Icons |
| **Backend** | Node.js, Express.js (MVC Architecture) |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens), Bcryptjs |
| **State Management** | React Context API |

---

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18 or higher)
*   **MongoDB** (Local instance or MongoDB Atlas URL)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ali-5427/FleaxovA.git
   cd FleaxovA
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install Client & Server dependencies
   npm run install-all
   ```

3. **Environment Setup**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   ```

4. **Seed the Database** (Optional - Adds sample services)
   ```bash
   cd server
   node seed.js
   cd ..
   ```

5. **Run the Application**
   ```bash
   npm run dev
   ```
   *   Frontend: `http://localhost:5173`
   *   Backend: `http://localhost:5000`

---

## 📁 Project Structure

```text
FleaxovA/
├── client/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth & Global state
│   │   └── pages/         # Page views (Home, Services, etc.)
│   └── tailwind.config.js
├── server/                # Node.js API Backend
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API endpoints
│   │   └── middleware/    # Auth & Security
│   └── seed.js            # Sample data script
└── package.json           # Root automation scripts
```

---

## 🤝 Roadmap

- [x] Global Rename to FleaxovA
- [x] Initial MVP Architecture
- [x] Service Marketplace & Seeding
- [ ] Real Payment Gateway Integration (Razorpay/Stripe)
- [ ] AWS S3 Work Delivery Submission
- [ ] Mobile-native App (Expo/React Native)

---

## 📄 License
Distributed under the ISC License. See `LICENSE` for more information.

---
**Developed with ❤️ by the FleaxovA Team**
