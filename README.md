# CloudPulse

A lightweight cloud latency monitoring and performance analysis app. Enter a URL, CloudPulse measures response time, status, and size, stores the result, and visualizes trends over time.

## Status

✅ **Phase 0-5 Complete** — Core functionality ready!  
📊 Dashboard with charts and analytics  
🔄 Multi-URL comparison view  
📱 Responsive design for mobile, tablet, and desktop  
♿ Accessibility features (ARIA labels, keyboard navigation)

See `docs/memory.md` for detailed progress and `docs/phases.md` for the build roadmap.

## Features

### ✅ Current Features (Phases 0-5)

- **URL Latency Testing**: Measure response time, status code, and response size
- **SSRF Protection**: Blocks localhost, private IPs, and cloud metadata endpoints  
- **Error Categorization**: Timeout, DNS failure, connection refused, etc.
- **Test History**: View all past tests with pagination
- **Dashboard Analytics**:
  - Stats cards (total tests, avg/min/max latency)
  - Line chart showing latency trends over time
  - Bar chart comparing multiple URLs
  - Full history table with delete functionality
- **Compare View**: Test multiple URLs side-by-side with performance summary
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### 🚧 Coming Soon

- **Phase 6**: Comprehensive testing and security hardening
- **Phase 7**: Production deployment to Render and Vercel

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Chart.js, Axios |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB Atlas (production) / mongodb-memory-server (development) |
| **Charts** | Chart.js via react-chartjs-2 |
| **Hosting** | Vercel (frontend), Render (backend) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Quick Setup

1. **Clone the repository**
```bash
git clone https://github.com/<your-username>/cloudpulse.git
cd cloudpulse
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Backend runs on http://localhost:5000

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on http://localhost:5173

4. **Open your browser** and navigate to http://localhost:5173

### MongoDB Configuration

**Development (Default)**  
Uses `mongodb-memory-server` for local development — no setup required!

**Production (MongoDB Atlas)**  
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cloudpulse
```

## Usage

### Home Page
1. Enter a URL (e.g., `https://example.com`)
2. Click "Analyze"
3. View the result with response time, status, and size
4. See your test appear in the recent tests table

### Dashboard
- View overall statistics (total tests, avg/min/max latency)
- Select a URL to see its latency trend over time
- Compare all tested URLs in a bar chart
- Delete old test records

### Compare View
1. Enter multiple URLs (up to 10)
2. Click "Run All Tests"
3. View side-by-side comparison with fastest/slowest highlighted
4. See performance summary table

## Testing

### Integration Test
```bash
./test-integration.sh
```

### Build Test
```bash
cd frontend && npm run build
cd ../backend && npm start
```

## Project Structure

```
cloudpulse/
├── frontend/          # React app (Vite + Tailwind)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── charts/        # Chart.js components
│   │   ├── pages/         # Route pages (Home, Dashboard, Compare)
│   │   ├── services/      # API client
│   │   └── utils/         # Formatters and helpers
│   └── package.json
│
├── backend/           # Express API
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── middleware/        # Error handling, validation
│   ├── services/          # Business logic (latency measurement)
│   ├── config/            # Database connection
│   └── server.js
│
├── docs/              # Project documentation
│   ├── memory.md          # Progress tracker
│   ├── phases.md          # Build roadmap
│   ├── architecture.md    # Technical architecture
│   └── rules.md           # Development constraints
│
└── README.md
```

## API Endpoints

- `POST /api/tests` - Run a latency test
- `GET /api/tests` - Get test history (with pagination and filtering)
- `GET /api/stats?url=<url>` - Get statistics for a URL
- `DELETE /api/tests/:id` - Delete a test record

See `docs/architecture.md` for detailed API documentation.

## Security

- **SSRF Protection**: Blocks requests to localhost, private IPs, and metadata endpoints
- **Protocol Validation**: Only HTTP/HTTPS allowed
- **Error Handling**: No stack traces leaked to clients
- **Input Validation**: URL format and safety checks

## Documentation

- `SETUP.md` - Detailed setup guide
- `PHASE4_FEATURES.md` - Dashboard and charts documentation
- `docs/` folder - Complete project documentation
- `test-integration.sh` - Integration test script

## License

Not yet decided.

## Contributing

This project follows the phase-based development approach outlined in `docs/phases.md`.  
Currently in Phase 6 (Testing & Hardening).