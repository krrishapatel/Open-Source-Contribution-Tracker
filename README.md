# Open Source Contribution Tracker

A MERN learning project that helps developers track GitHub issues they want to contribute to, bookmark repositories, monitor pull requests, write notes, and measure contribution progress.

## What You Will Learn

- API design with Express route/controller/service layers
- MongoDB modeling with relationships between users, repos, issues, pull requests, and notes
- GitHub OAuth plus JWT-based app sessions
- Calling external APIs with Octokit
- Background syncing for GitHub issue and PR status changes
- React app structure with protected routes and server-state fetching
- Automated backend/frontend tests
- GitHub Actions CI and deploy-ready project structure

## Architecture

```txt
client/ React + Vite dashboard
server/ Express + MongoDB API
.github/workflows/ CI pipeline
docker-compose.yml Local MongoDB
```

The frontend never talks directly to MongoDB or GitHub. It calls your Express API. The API validates the request, checks the user session, reads/writes MongoDB, and calls GitHub when needed.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start MongoDB:

```bash
docker compose up -d
```

4. Run the app:

```bash
npm run dev
```

The API runs on `http://localhost:5001`.
The React app runs on `http://localhost:5173`.

## GitHub OAuth Setup

Create an OAuth app in GitHub Developer Settings:

- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:5001/api/auth/github/callback`

Put the client ID and secret in `server/.env`.

## Branch and PR Practice

Use this repo like a real team project:

```bash
git checkout -b codex/feature-auth
git add .
git commit -m "feat: add github oauth login"
git push origin codex/feature-auth
```

Every PR should include:

- Summary
- Screenshots for UI changes
- Test plan
- Any environment variables added

## Suggested Build Order

1. Auth and protected routes
2. Repository saving/bookmarking
3. Issue tracking
4. Pull request tracking
5. Notes and contribution progress
6. GitHub sync job
7. Tests
8. CI/CD and deployment
