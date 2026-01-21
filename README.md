# Church Finance Management System

A modern, full-stack web application for managing church finances with a Node.js/Express backend and React frontend. Features donation tracking, expense management, budget planning, and comprehensive financial reporting.

## 🏗️ Project Structure

```
church-finance/
├── backend/              # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript types
│   │   └── server.ts     # Entry point
│   ├── database/
│   │   ├── migrations/   # Database migrations
│   │   └── seeders/      # Sample data
│   └── package.json
├── frontend/             # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API calls
│   │   ├── store/        # Redux state
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Root component
│   └── package.json
└── README.md (this file)
```

## 📋 Features

- ✅ **User Management** - Admin, Accountant, Pastor, Member roles
- ✅ **Authentication** - JWT-based with secure password hashing
- ✅ **Donation Tracking** - Record and categorize donations
- ✅ **Expense Management** - Track expenses with approval workflow
- ✅ **Budget Planning** - Create and monitor budgets
- ✅ **Financial Reports** - Generate monthly/quarterly/yearly reports
- ✅ **Dashboard** - Real-time financial analytics
- ✅ **Responsive Design** - Works on desktop, tablet, mobile

## 🛠️ Tech Stack

**Backend:**
- Node.js 18+
- Express.js
- TypeScript
- Sequelize ORM
- MySQL 8.0+
- JWT Authentication

**Frontend:**
- React 18+
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router v6

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MySQL 8.0+

### Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your MySQL credentials
npm run db:migrate
npm run db:seed
npm run dev
```

Backend runs on `http://localhost:3000`

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 Default Credentials

```
Email: admin@church.local
Password: password
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Donations
- `GET /api/donations` - List all
- `POST /api/donations` - Create
- `GET /api/donations/:id` - Get one
- `PUT /api/donations/:id` - Update
- `DELETE /api/donations/:id` - Delete

### Expenses
- `GET /api/expenses` - List all
- `POST /api/expenses` - Create
- `GET /api/expenses/:id` - Get one
- `PUT /api/expenses/:id` - Update
- `DELETE /api/expenses/:id` - Delete
- `PUT /api/expenses/:id/approve` - Approve
- `PUT /api/expenses/:id/reject` - Reject

### Budgets
- `GET /api/budgets` - List all
- `POST /api/budgets` - Create
- `GET /api/budgets/:id` - Get one
- `PUT /api/budgets/:id` - Update
- `DELETE /api/budgets/:id` - Delete

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:id` - Get report details
- `GET /api/dashboard` - Dashboard summary

## 🚀 Deployment

### Local Development (XAMPP)
Both backend and frontend run in development mode on your local machine.

### Production (Hostinger)
1. Upload both `backend` and `frontend` folders
2. Configure environment variables
3. Build frontend: `cd frontend && npm run build`
4. Build backend: `cd backend && npm run build`
5. Use PM2 for backend process management
6. Configure Nginx reverse proxy
7. Point domain to frontend build

See detailed instructions in backend/README.md and frontend/README.md

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=church_finance
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📚 Database Models

- **Users** - Church members, staff, admin
- **Donations** - Donation records (tithe, offering, special)
- **Expenses** - Church expenses with approval workflow
- **Budgets** - Budget allocations by category
- **FinancialReports** - Generated financial reports

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS protection
- SQL injection prevention (Sequelize ORM)

## 📦 Installation & Builds

### Backend
```bash
npm install          # Install dependencies
npm run build        # Build TypeScript
npm run dev          # Development mode
npm start            # Production mode
npm test             # Run tests
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Development mode
npm run build        # Production build
npm run preview      # Preview build
npm test             # Run tests
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

Proprietary - Church Use Only

## 🆘 Support

For issues or questions, contact the development team.

---

**Created**: January 2026  
**Last Updated**: January 21, 2026
