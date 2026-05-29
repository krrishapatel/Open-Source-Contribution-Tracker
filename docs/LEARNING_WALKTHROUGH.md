# Learning Walkthrough

This project is built in layers. Each layer teaches one real full-stack skill.

## 1. Authentication

GitHub OAuth answers: "Who is this person on GitHub?"

JWT answers: "Can this browser call our API?"

After GitHub redirects back to the server, the server creates:

- a short-lived access token for API calls
- a refresh token in an HTTP-only cookie

The frontend stores the access token and sends it in the `Authorization` header.

## 2. API Design

Routes define the URL shape:

```txt
GET /api/repos
POST /api/repos
GET /api/issues
POST /api/issues
PATCH /api/issues/:id
POST /api/notes
```

Controllers translate HTTP requests into service calls.

Services contain business logic. This is where GitHub and MongoDB work happens.

Models define how data is stored in MongoDB.

## 3. Database Modeling

The important relationship is:

```txt
User -> Repository -> TrackedIssue -> Note
User -> Repository -> PullRequest
PullRequest -> optional TrackedIssue
```

Almost every query includes `{ user: req.user.id }`. That is the core permission check.

## 4. GitHub API Sync

When you save `facebook/react`, the server calls GitHub and stores a snapshot in MongoDB.

When you track issue `#123`, the server calls GitHub and stores the current title, labels, state, URL, and update time.

A cron job periodically refreshes saved repositories, issues, and pull requests.

## 5. Frontend Data Flow

React components call the API wrapper in `client/src/api/http.js`.

The dashboard fetches:

- stats
- repositories
- issues
- pull requests

When you add or update something, the dashboard reloads those resources.

Later, a good upgrade would be TanStack Query, which gives caching, refetching, retries, and optimistic updates.

## 6. Testing

Backend tests use:

- Vitest as the test runner
- Supertest to call Express routes
- MongoDB Memory Server so tests do not touch your real database

Frontend tests use:

- Vitest
- React Testing Library

## 7. CI/CD

GitHub Actions runs on pushes to `main` and `dev`, and on every PR:

```txt
npm ci
npm run lint
npm test
npm run build
```

This catches broken code before it reaches deployment.

## 8. Deployment Path

Recommended simple deployment:

- Frontend: Vercel
- Backend: Render, Railway, or Fly.io
- Database: MongoDB Atlas

Environment variables move from `.env` files into platform secrets.

## Feature Branch Practice

Use one branch per learning milestone:

```txt
codex/feature-auth
codex/feature-save-repos
codex/feature-track-issues
codex/feature-pr-tracking
codex/feature-ci
codex/feature-deploy
```

For each PR, write:

- What changed
- Why it changed
- How you tested it
- Screenshots for UI work
