# User Authentication and Transactions API

This project is a simple user authentication backend with SQLite database and JWT token-based authorization. It includes APIs for user registration, login, transactions (CRUD), reports, and portfolio summary. The project is built with Node.js, Express, and SQLite.

---

## 🌐 Hosted API

**Base URL:**  
[https://investor-project-backend.onrender.com](https://investor-project-backend.onrender.com)

---

## 🚀 Features

- User registration & login with hashed passwords (bcrypt)
- JWT-based authorization
- CRUD operations for transactions (POST, PUT, GET, DELETE)
- Reports to GET quarterly reports
- Portfolio summary with total investment and individual investments and user info.
- SQLite database with seeded data
- Modular file structure (routes, middleware, DB init)

---

## 🛠 Technologies Used

- Node.js
- Express.js
- SQLite3
- bcryptjs
- JSON Web Token (JWT)
- cors

---

## 🧾 API Endpoints

### ✅ Auth

- `POST /api/auth/register`  
  Register a new user  
  **Request body:**

  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

  **Response:**

  ```json
  { "token": "jwt_token_here" }
  ```

- `POST /api/auth/login`  
  Login with email and password  
  **Request body:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
  **Response:**
  ```json
  { "token": "jwt_token_here" }
  ```

---

### 🔐 Transactions (JWT protected)

- `GET /api/transactions`  
  Fetch paginated transactions  
  **Query Params:**

  - `page` (optional)
  - `limit` (optional)  
    **Authorization:** `Bearer <token>`  
    **Response:**

  ```json
  {
    "transactions": [...],
    "total": 35
  }
  ```

- `POST /api/transactions`  
  Create a new transaction  
  **Request body:**

  ```json
  {
    "stock": "AAPL",
    "date": "2025-07-24T15:30",
    "type": "deposit",
    "amount": 100
  }
  ```

- `PUT /api/transactions/:id`  
  Update a transaction by ID  
  **Request body:** (same as above)

- `DELETE /api/transactions/:id`  
  Delete a transaction by ID

---

### 📊 Portfolio Summary (JWT protected)

- `GET /api/portfolio`  
  Returns user info and stock-wise summary  
  **Authorization:** `Bearer <token>`  
  **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "summary": {
      "AAPL": 250,
      "TSLA": 100
    },
    "totalInvestment": 350.0
  }
  ```

---

### 📁 Reports (JWT protected)

- `GET /api/reports`  
  Get a list of reports (name, URL, and creation date)  
  **Authorization:** `Bearer <token>`  
  **Response:**
  ```json
  {
    "reports": [
      {
        "name": "report1.pdf",
        "url": "https://example.com/report1.pdf",
        "created_at": "2025-07-22T10:00:00Z"
      }
    ]
  }
  ```

---

## 🧱 Project Structure

```
.
├── db/
│   └── initDb.js           # Database setup and dummy seeding
├── middleware/
│   └── authMiddleware.js   # JWT authentication middleware
├── routes/
│   ├── auth.js             # Register & login routes
│   ├── transactions.js     # CRUD transactions
│   ├── reports.js          # Reports route
│   └── portfolio.js        # Portfolio summary
├── server.js               # Main server entry
├── db.sqlite               # SQLite DB file (auto-generated)
├── .env                    # Environment variables
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
git clone https://github.com/simarsinghsandhu/Investor-Project-Backend.git
cd Investor-Project-Backend
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```
PORT=5000
JWT_SECRET=your_jwt_secret
```

### Run Server

```bash
node server.js
```

> Server will run at: `http://localhost:5000`

---

## 🔐 Notes

- Passwords are securely hashed using `bcrypt`
- Tokens are signed using secret in `.env`
- Transactions table is pre-seeded with 35 entries
- All protected routes require `Authorization: Bearer <token>`

---

## 📦 Future Improvements

- Add user based crud operation for transactions
- Add refresh token handling
- Add role_id to user table
- Add unit and integration tests
- Dockerize for production

---

## 📄 License

MIT License © Simar Singh Sandhu

---

Feel free to open issues or contribute!
