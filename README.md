# Open Source Contribution Tracker

A full-stack MERN application for tracking open source repositories, issues, pull requests, and contribution notes from GitHub.

The app lets users sign in with GitHub, save repositories they want to contribute to, track issues, link pull requests, write research notes, and view contribution progress from one dashboard.

## Features

- GitHub OAuth login
- JWT-based app sessions
- Save GitHub repositories by `owner/name`
- Track GitHub issues and contribution status
- Track pull requests and whether they are merged
- Add notes to tracked issues
- Dashboard stats for repositories, issues, pull requests, and merged PRs
- Background GitHub sync job
- Demo dashboard mode for viewing the UI without OAuth credentials
- Backend and frontend tests
- GitHub Actions CI workflow
- Example deployment workflows for frontend and backend

## Tech Stack

- React
- Vite
- Express
- MongoDB
- Mongoose
- Passport GitHub OAuth
- JWT
- Octokit
- Vitest
- Supertest
- Docker Compose
- GitHub Actions

## Project Structure

```txt
.
├── client/                 # React frontend
├── server/                 # Express API
├── docs/                   # Supporting documentation
├── .github/workflows/      # CI and deployment workflows
├── docker-compose.yml      # Local MongoDB service
├── package.json            # Root workspace scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- Docker Desktop
- GitHub OAuth app credentials

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create local env files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env`:

```bash
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/contrib_tracker
JWT_ACCESS_SECRET=replace-with-a-random-secret
JWT_REFRESH_SECRET=replace-with-a-random-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

Update `client/.env` if needed:

```bash
VITE_API_URL=http://localhost:5001
```

### GitHub OAuth Setup

Create a GitHub OAuth app from GitHub Developer Settings.

Use these local development URLs:

```txt
Homepage URL:
http://localhost:5173

Authorization callback URL:
http://localhost:5001/api/auth/github/callback
```

Copy the client ID and client secret into `server/.env`.

## Running Locally

Start MongoDB:

```bash
docker compose up -d
```

Run the frontend and backend:

```bash
npm run dev
```

App URLs:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:5001
Health:   http://localhost:5001/health
```

If GitHub OAuth is not configured yet, use the `Try demo dashboard` button on the landing page.

## Available Scripts

Run both frontend and backend:

```bash
npm run dev
```

Run lint checks:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

Build the frontend:

```bash
npm run build
```

Run only the backend:

```bash
npm start --workspace server
```

Run only the frontend:

```bash
npm run dev --workspace client
```

## API Overview

```txt
GET    /health
GET    /api/auth/github
GET    /api/auth/github/callback
POST   /api/auth/refresh
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/dashboard

GET    /api/repos
POST   /api/repos

GET    /api/issues
GET    /api/issues/:id
POST   /api/issues
PATCH  /api/issues/:id

GET    /api/pull-requests
POST   /api/pull-requests

POST   /api/notes
DELETE /api/notes/:id
```

## Testing

The backend uses Vitest, Supertest, and MongoDB Memory Server.

The frontend uses Vitest, React Testing Library, and jsdom.

Run the full test suite:

```bash
npm test
```

## CI/CD

The CI workflow runs on pushes to `main` and `dev`, and on pull requests.

It checks:

- dependency installation
- linting
- backend tests
- frontend tests
- frontend production build

Deployment workflow examples are included for:

- Vercel frontend deployment
- Render backend deploy hook

## Deployment Notes

Recommended deployment setup:

- Frontend: Vercel
- Backend: Render, Railway, or Fly.io
- Database: MongoDB Atlas

Required production environment variables:

```bash
CLIENT_URL=
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Status

This project currently includes the core full-stack scaffold and main contribution-tracking flows. Planned improvements include repository search, edit/delete actions, GitHub webhooks, richer loading states, and broader test coverage.
