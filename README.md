# Zyperr

A full-stack streaming platform for movies, web series, and anime — built with Next.js, Express, Prisma, and PostgreSQL.

**Live:** [zyperr.vercel.app](https://zyperr.vercel.app)

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Zustand (global state)
- Axios

**Backend**
- Node.js + Express
- TypeScript
- Prisma ORM
- Neon Serverless PostgreSQL
- JWT Authentication
- Google OAuth 2.0
- Zod (validation)

---

## Features

- Browse movies, web series, and anime in one place
- Hero banner with auto-rotating featured content
- Google Sign-In and email/password authentication
- Watchlist — save content to your personal list
- Search and filter by genre or content type
- Admin panel to add, edit, and delete content
- Fully responsive design

---

## Project Structure

```
Zyperr/
├── client/        # Next.js frontend
│   └── src/
│       ├── app/          # Pages and layouts
│       ├── components/   # Reusable UI components
│       ├── lib/          # Axios API client
│       └── store/        # Zustand auth store
│
└── server/        # Express backend
    └── src/
        ├── controllers/  # Route handlers
        ├── middlewares/  # Auth & admin guards
        ├── routes/       # API route definitions
        └── config/       # Database connection
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Google Cloud](https://console.cloud.google.com) OAuth 2.0 Client ID

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
DATABASE_URL=your_neon_postgres_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000
```

Run database migrations:

```bash
npx prisma db push
```

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env.local` file in `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register with email | — |
| POST | `/api/auth/login` | Login with email | — |
| POST | `/api/auth/google` | Google OAuth login | — |
| GET | `/api/auth/me` | Get current user | JWT |
| GET | `/api/movies` | List all content (paginated) | — |
| GET | `/api/movies/featured` | Get featured content | — |
| GET | `/api/movies/banner` | Get banner content | — |
| GET | `/api/movies/trending` | Get trending content | — |
| GET | `/api/movies/genres` | Get all genres | — |
| GET | `/api/movies/:id` | Get content by ID | — |
| POST | `/api/movies` | Add new content | Admin |
| PUT | `/api/movies/:id` | Update content | Admin |
| DELETE | `/api/movies/:id` | Delete content | Admin |
| GET | `/api/watchlist` | Get user watchlist | JWT |
| POST | `/api/watchlist` | Add to watchlist | JWT |
| DELETE | `/api/watchlist/:movieId` | Remove from watchlist | JWT |
| GET | `/api/watchlist/check/:movieId` | Check if in watchlist | JWT |

---

## License

MIT
