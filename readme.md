User Authentication and Transactions API

This project is a simple user authentication backend with SQLite database and JWT token-based authorization. It includes APIs for user registration, login, and fetching paginated transaction data. The project is built with Node.js, Express, and SQLite.

---

Features

- User registration with hashed passwords (bcrypt)
- User login with JWT token generation
- JWT-protected transactions API with pagination
- SQLite database with seeded dummy transactions
- Modular project structure (routes, middleware, db initialization)

---

Technologies Used

- Node.js
- Express.js
- SQLite3
- bcryptjs
- JSON Web Token (JWT)
- dotenv
- cors

---

Getting Started

Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

Installation

1. Clone the repo:

   git clone https://github.com/your-username/your-repo.git
   cd your-repo

2. Install dependencies:

   npm install

3. Create a `.env` file in the root directory and add:

   PORT=5000
   JWT_SECRET=your_jwt_secret

4. Start the server:

   node server.js

5. Server will run on: http://localhost:5000

---

API Endpoints

Auth

- POST /api/register

  Register a new user.

  Request body:

  {
  "email": "user@example.com",
  "password": "your_password"
  }

  Response:

  {
  "token": "jwt_token_here"
  }

- POST /api/login

  Login with email and password.

  Request body:

  {
  "email": "user@example.com",
  "password": "your_password"
  }

  Response:

  {
  "token": "jwt_token_here"
  }

Transactions (Protected, requires Authorization header with Bearer token)

- GET /api/transactions

  Get paginated transactions.

  Query parameters:

  - page (optional) - page number (default: 1)
  - limit (optional) - number of transactions per page (default: 10)

  Response:

  {
  "transactions": [
  {
  "id": 1,
  "date": "2025-07-22T12:34:56.789Z",
  "amount": 75.50,
  "type": "deposit",
  "stock": "AAPL"
  },
  ...
  ],
  "total": 35
  }

---

Project Structure

.
├── controllers/ # (optional) Controllers if used
├── db/
│ └── initDb.js # DB setup and seeding
├── middleware/
│ └── authMiddleware.js # JWT authentication middleware
├── routes/
│ ├── auth.js # Auth routes (register, login)
│ └── transactions.js # Transactions route
├── server.js # Main Express server entry
├── db.sqlite # SQLite DB file (auto-created)
├── .env # Environment variables
└── package.json

---

Notes

- Passwords are hashed using bcrypt with salt rounds of 8.
- JWT tokens are signed with the secret defined in `.env`.
- Transactions table is seeded with 35 dummy entries on first run.
- Transactions API is protected and requires a valid JWT token in the Authorization header.
- You can customize seeding data and database path in `initDb.js`.

---

Future Improvements

- Add user profile management.
- Implement refresh tokens.
- Add APIs to create new transactions.
- Add unit/integration tests.
- Dockerize the app for easier deployment.

---

License

MIT License © Simar Singh Sandhu

---

Feel free to open issues or contribute!
