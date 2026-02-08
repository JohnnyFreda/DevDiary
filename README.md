# Dev Diary App

A full-stack developer diary application for logging daily progress, tracking mood, projects, and tags.

## Live Demo

**[Try the app →](https://dev-diary-psi.vercel.app)**

Use **Continue as guest** to explore without signing up. The demo may take a moment to load after inactivity (free-tier backend spin-up).

## Features

- User authentication with JWT (access + refresh tokens)
- Daily entry logging with markdown support
- Project and tag management
- Calendar view with entry visualization
- Dashboard with insights (streak, mood trends)
- Dark mode support
- Mobile responsive design

## Tech Stack

### Backend
- FastAPI
- Python
- SQLAlchemy + Alembic
- PostgreSQL
- JWT Authentication

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- React Query
- React Router

## Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and secret key
```

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env
# Leave VITE_API_URL empty for dev (proxy forwards /api to backend). For production, set to your backend URL.
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`. With the backend running and the dev proxy (or `VITE_API_URL`) configured, the frontend uses the FastAPI backend and PostgreSQL for all data; app data is no longer stored in localStorage.

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core utilities (auth, config, security)
│   │   ├── db/           # Database models and session
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── tests/        # Tests
│   ├── alembic/          # Database migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── components/   # React components
│   │   ├── context/      # React context (auth, theme)
│   │   ├── pages/        # Page components
│   │   └── App.tsx
│   └── package.json
└── specs.txt            # Project specifications
```

## API Documentation

Once the backend server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

### Backend Tests
```bash
cd backend
pytest
```

## Deployment

The live demo uses a fully free stack:

| Component | Service | Notes |
|-----------|---------|--------|
| Frontend | [Vercel](https://vercel.com) | Root directory: `frontend`. Env: `VITE_API_URL` = backend URL. |
| Backend | [Render](https://render.com) | Web Service, root: `backend`. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Python 3.12 (`runtime.txt`). |
| Database | [Neon](https://neon.tech) | PostgreSQL. Connection string as `DATABASE_URL` on Render. |

**Backend env (Render):** `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS` (your Vercel frontend URL, e.g. `https://dev-diary-psi.vercel.app`).

**Frontend env (Vercel):** `VITE_API_URL` = your Render backend URL only (no path, no trailing slash).

Push to `main` to trigger automatic redeploys on both Vercel and Render. For step-by-step hosting instructions, see [HOSTING_LIVE_DEMO.md](HOSTING_LIVE_DEMO.md) (if present in the repo).

## License

MIT

