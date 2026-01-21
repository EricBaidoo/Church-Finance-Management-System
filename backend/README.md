# Church Finance Management - Backend API

Node.js + Express + TypeScript REST API for church finance management system.

## Quick Start

### Setup
```bash
npm install
cp .env.example .env
```

### Configure Database
Edit `.env`:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=church_finance
DB_USER=root
DB_PASSWORD=
```

### Create Database
```bash
mysql -u root
CREATE DATABASE church_finance;
EXIT;
```

### Run Migrations & Seeds
```bash
npm run db:migrate
npm run db:seed
```

### Start Development Server
```bash
npm run dev
```

Server: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Donations
- `GET /api/donations` - List
- `POST /api/donations` - Create
- `GET /api/donations/:id` - Get
- `PUT /api/donations/:id` - Update
- `DELETE /api/donations/:id` - Delete

### Expenses
- `GET /api/expenses` - List
- `POST /api/expenses` - Create
- `GET /api/expenses/:id` - Get
- `PUT /api/expenses/:id` - Update
- `PUT /api/expenses/:id/approve` - Approve
- `PUT /api/expenses/:id/reject` - Reject
- `DELETE /api/expenses/:id` - Delete

### Budgets
- `GET /api/budgets` - List
- `POST /api/budgets` - Create
- `GET /api/budgets/:id` - Get
- `PUT /api/budgets/:id` - Update
- `DELETE /api/budgets/:id` - Delete

### Reports
- `GET /api/reports` - List
- `POST /api/reports/generate` - Generate
- `GET /api/reports/:id` - Get
- `GET /api/reports/dashboard` - Dashboard data

## Default Credentials
- Email: admin@church.local
- Password: password

## Scripts
- `npm run dev` - Development mode
- `npm run build` - Build for production
- `npm start` - Production mode
- `npm test` - Run tests
- `npm run lint` - Lint code
