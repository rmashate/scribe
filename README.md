# Scribe

A simple, modern blog platform inspired by early Blogger and Posterous. Minimal friction blogging: sign up, write, publish.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Vercel Postgres + Prisma ORM
- **Auth**: NextAuth.js v5 (GitHub OAuth)
- **Editor**: TipTap (rich text)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Vercel Postgres)
- GitHub OAuth app credentials

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `AUTH_GITHUB_ID`: Your GitHub OAuth App Client ID
   - `AUTH_GITHUB_SECRET`: Your GitHub OAuth App Client Secret

5. Set up the database:
   ```bash
   npx prisma db push
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

- GitHub OAuth authentication
- Rich text editor with TipTap
- Create, edit, delete, and publish posts
- Public blog pages at `/@username` and `/@username/slug`
- Dark mode support

## Project Structure

```
scribe/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Auth pages (login)
│   ├── (marketing)/     # Marketing pages (landing)
│   ├── [username]/      # Public blog routes
│   ├── dashboard/       # Dashboard routes
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Utility functions
└── prisma/              # Database schema
```

## Deployment

Deploy to Vercel for the best experience:

1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

## License

MIT
