# ProductAPI - Scalable REST API with Production Frontend

A full-stack MERN application with secure REST API, role-based authentication, Redis caching, and a production-grade React UI featuring a responsive dashboard, product catalog, admin panel, and polished user experience.

---

## Project Overview

| Aspect | Details |
|--------|---------|
| **Stack** | MongoDB, Express, React, Node.js |
| **Frontend** | React 18 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Express.js with JWT auth, bcrypt, role-based access |
| **Caching** | Redis (Upstash) with BullMQ for background jobs |
| **Testing** | Jest + Supertest + MongoMemoryServer (26 passing tests) |
| **Documentation** | Swagger UI at `/api/v1/docs` |

---

## Features

### Backend
- JWT authentication with bcrypt password hashing
- Role-based access control (user / admin)
- CRUD operations for products with validation
- Redis caching for frequently accessed data
- BullMQ queue for async background processing
- Rate limiting, CORS, Helmet security headers
- Pagination, search, and sorting
- Swagger API documentation

### Frontend
- **Landing Page** - Hero section with animated feature cards and terminal mockup
- **Authentication** - Split-layout login/register with form validation
- **Dashboard** - Welcome banner, live stats, product grid/table with CRUD, modals, pagination
- **Products Catalog** - Search, filter by category, sort, grid/list toggle, "Coming Soon" section
- **Admin Panel** - User management, role editing, system status, activity logs
- **Profile** - Editable name, password change, account stats, security status
- **Layout** - Collapsible sidebar with profile icon, sticky header, responsive footer
- **UX** - Framer Motion animations, toast notifications, skeleton loaders, glass morphism

---

## Project Structure

```
inter-project/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Redis, queue config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── queue/           # BullMQ workers
│   │   └── index.js         # Express entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout with sidebar/header/footer
│   │   ├── pages/           # Products, Admin pages
│   │   ├── App.jsx          # Router with protected routes
│   │   ├── Dashboard.jsx    # Stats, product CRUD, modals
│   │   ├── Profile.jsx      # User profile & settings
│   │   ├── Landing.jsx      # Animated landing page
│   │   ├── Login.jsx        # Auth pages
│   │   ├── AuthContext.jsx  # Auth state management
│   │   ├── ToastContext.jsx # Notification system
│   │   └── api.js           # Axios client with interceptors
│   ├── index.html           # Google Fonts
│   ├── index.css            # Tailwind + custom animations
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional - Upstash for cloud)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on **http://localhost:5000**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
NODE_ENV=production npm start
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/products` | List products (paginated) | Yes |
| POST | `/api/v1/products` | Create product | Yes |
| GET | `/api/v1/products/:id` | Get single product | Yes |
| PATCH | `/api/v1/products/:id` | Update product | Yes |
| DELETE | `/api/v1/products/:id` | Delete product (admin) | Yes |

### Swagger Docs

Visit **http://localhost:5000/api/v1/docs** for interactive API documentation.

---

## Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REDIS_URL=your_redis_url
NODE_ENV=development
```

> **Note:** `.env` is gitignored. Never commit credentials. Use `.env.example` as a template.

---

## Security

1. Password hashing with bcrypt (12 salt rounds)
2. JWT tokens with 7-day expiration
3. Role-based middleware for admin routes
4. Input validation via express-validator
5. Helmet security headers
6. Rate limiting (100 req / 15 min)
7. CORS configured for frontend origin
8. Auto-logout on 401 via Axios interceptor

---

## User Roles

| Role | Permissions |
|------|-------------|
| **user** | View, create, update own products |
| **admin** | Full access including delete, user management |

---

## Frontend Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page with hero and features | Public |
| `/login` | Split-layout login form | Public |
| `/register` | Registration form | Public |
| `/dashboard` | Stats, product CRUD, grid/table view | Authenticated |
| `/products` | Product catalog with search, filters, coming soon | Authenticated |
| `/profile` | User info, password change, account stats | Authenticated |
| `/admin` | User management, system status, logs | Admin only |

---

## Future Improvements

1. Microservices architecture (auth-service, product-service)
2. Docker containerization with docker-compose
3. CI/CD pipeline with GitHub Actions
4. Real-time notifications with WebSocket
5. File upload for product images
6. Email verification and password reset
7. Analytics dashboard with charts
8. i18n support for multi-language

---

## License

MIT License

---

## Author

Built as part of a backend developer internship assignment, demonstrating full-stack development with secure API design, production-grade UI, and scalable architecture.
