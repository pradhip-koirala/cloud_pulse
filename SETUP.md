# CloudPulse Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000` with an in-memory MongoDB instance.

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## MongoDB Configuration

### Development (Default)
The app uses `mongodb-memory-server` for local development, which creates an in-memory MongoDB instance. No setup required!

### Production (MongoDB Atlas)
1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `backend/.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cloudpulse
```

## Testing the Integration

Run the integration test script:
```bash
./test-integration.sh
```

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start with auto-reload (requires nodemon)
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Current Features (Phase 3)

✓ URL latency testing with response time measurement  
✓ SSRF protection (blocks private IPs and localhost)  
✓ Error categorization (timeout, DNS, connection refused)  
✓ Test history with pagination  
✓ Clean, responsive UI  
✓ Real-time results display  

## Coming Soon

- Phase 4: Dashboard with charts and analytics
- Phase 5: Multi-URL comparison view
- Phase 6: Comprehensive testing
- Phase 7: Production deployment
