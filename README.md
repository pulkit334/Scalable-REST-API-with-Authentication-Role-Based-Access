# REST API with Authentication & Role-Based Access Control

A scalable full-stack project demonstrating secure backend API development with JWT authentication, role-based access control, and a modern React frontend.

---

## 🚀 Project Overview

| Aspect | Details |
|--------|---------|
| **Project Type** | Full-stack REST API with Frontend |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) with bcrypt password hashing |
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Documentation** | Swagger UI |

---

## ✨ Features Implemented

### Backend Features
- ✅ User registration & login with secure password hashing (bcrypt)
- ✅ JWT-based authentication with token expiration
- ✅ Role-based access control (user vs admin)
- ✅ CRUD operations for products entity
- ✅ API versioning (/api/v1)
- ✅ Input validation & sanitization (express-validator)
- ✅ Error handling middleware
- ✅ Redis caching for products
- ✅ Rate limiting & security headers (helmet, cors)
- ✅ Pagination, search, and filtering
- ✅ Swagger API documentation at `/api/v1/docs`

### Frontend Features
- ✅ User registration & login UI
- ✅ Protected dashboard (requires JWT)
- ✅ Product listing with pagination
- ✅ Create, edit, delete products
- ✅ Responsive design with Tailwind CSS
- ✅ Error/success notifications
- ✅ Token management via interceptors

---

## 📁 Project Structure

```
inter-project/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, Swagger config
│   │   ├── controllers/    # Route handlers (auth, products)
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas (User, Product)
│   │   ├── routes/          # API routes
│   │   └── index.js         # Express app entry point
│   ├── package.json
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api.js           # Axios API client with interceptors
│   │   ├── AuthContext.jsx  # React context for auth state
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Dashboard.jsx    # Product management UI
│   │   ├── ProtectedRoute.jsx
│   │   └── App.jsx          # Main app with routing
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Redis (optional - Upstash for cloud)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on: **http://localhost:5000**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login user | ❌ |
| GET | `/api/v1/auth/me` | Get current user profile | ✅ |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/products` | List products (paginated) | ✅ |
| POST | `/api/v1/products` | Create product | ✅ |
| GET | `/api/v1/products/:id` | Get single product | ✅ |
| PATCH | `/api/v1/products/:id` | Update product | ✅ |
| DELETE | `/api/v1/products/:id` | Delete product (admin only) | ✅ |

### API Documentation
Visit: **http://localhost:5000/api/v1/docs** (Swagger UI)

---

## 🔐 Security Implementation

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **JWT Tokens**: Signed with secret key, expires in 7 days
3. **Token Storage**: Stored in localStorage on frontend
4. **Protected Routes**: Middleware validates JWT on every request
5. **Role-Based Access**: Admin can delete any product, users can only manage their own
6. **Input Validation**: express-validator sanitizes all inputs
7. **Security Headers**: Helmet.js provides security headers
8. **Rate Limiting**: 100 requests per 15 minutes
9. **CORS**: Enabled for frontend origin

---

## 🧪 API Design Best Practices

- ✅ RESTful principles with proper HTTP status codes
- ✅ Consistent response format (`{ success, message, data }`)
- ✅ Proper error handling with meaningful messages
- ✅ Pagination support for list endpoints
- ✅ API versioning for future flexibility
- ✅ Swagger documentation for API consumers

---

## 💻 Frontend Highlights

- **State Management**: React Context API for auth state
- **API Client**: Axios with request/response interceptors
- **Token Handling**: Auto-attaches JWT to protected requests
- **Error Handling**: Auto-redirects to login on 401
- **Responsive UI**: Tailwind CSS for modern design
- **User Experience**: Loading states, success/error messages

---

## 🔧 Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REDIS_URL=your_redis_url
NODE_ENV=development
```

> **Note**: `.env` is in `.gitignore` - never commit credentials!

---

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| **user** | Create, read, update own products |
| **admin** | Full access - can delete any product |

---

## 📝 Scalability Notes

### Current Architecture
- Monolithic Express server with modular route/controller structure
- MongoDB with Mongoose for flexible schema
- Redis integration for caching

### Future Improvements for Scale
1. **Microservices**: Break into auth-service, product-service
2. **Load Balancing**: Use Nginx/HAProxy
3. **Caching**: Redis for frequently accessed data
4. **Database**: Sharding for large datasets
5. **CI/CD**: Docker containers with automated deployment
6. **Monitoring**: logging with Winston, alerts with Prometheus

---

## 🏆 Interview Talking Points

This project demonstrates:

- ✅ **REST API Design** - Proper endpoints, status codes, versioning
- ✅ **Authentication** - JWT, bcrypt, token management
- ✅ **Security** - Input validation, helmet, rate limiting
- ✅ **Database** - MongoDB schema design, relationships
- ✅ **Frontend Integration** - React, API consumption, error handling
- ✅ **Code Organization** - Modular, scalable structure
- ✅ **Best Practices** - Error handling, documentation

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Created as part of backend developer internship assignment demonstrating full-stack capabilities with focus on secure API design.