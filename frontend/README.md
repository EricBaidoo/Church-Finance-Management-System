# Church Finance Management - Frontend

React + TypeScript + Tailwind CSS web application for church finance management.

## Quick Start

### Setup
```bash
npm install
cp .env.example .env
```

### Environment
Create `.env`:
```
VITE_API_URL=http://localhost:3000
```

### Development
```bash
npm run dev
```

Frontend: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Features
- User authentication with JWT
- Dashboard with financial overview
- Donation tracking and management
- Expense tracking with approval workflow
- Budget management and monitoring
- Financial reports generation
- Role-based access control
- Responsive design

## Project Structure
```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── services/       # API services
├── store/          # Redux state
├── types/          # TypeScript types
└── App.tsx         # Root component
```

## Available Pages
- `/login` - Login page
- `/dashboard` - Financial overview
- `/donations` - Donation management
- `/expenses` - Expense tracking
- `/budgets` - Budget management
- `/reports` - Financial reports

## Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Lint code
- `npm test` - Run tests
