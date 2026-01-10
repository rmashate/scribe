# Scribe - Development Plan

A simple, modern blog platform inspired by early Blogger and Posterous.

## Vision
Minimal friction blogging: sign up, write, publish. No complexity.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Database | Vercel Postgres + Prisma ORM |
| Auth | NextAuth.js v5 (GitHub, Google) |
| Editor | TipTap (rich text) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Phase 1: Foundation (MVP)

### 1.1 Project Setup
- [ ] Initialize Next.js 15 with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Prisma with Vercel Postgres
- [ ] Configure NextAuth.js (GitHub provider initially)

### 1.2 Database Schema
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  username      String    @unique
  image         String?
  bio           String?
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String
  content     String    @db.Text
  excerpt     String?
  published   Boolean   @default(false)
  publishedAt DateTime?
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([authorId, slug])
}
```

### 1.3 Core Pages
- [ ] `/` - Landing page (featured posts, sign up CTA)
- [ ] `/login` - Authentication page
- [ ] `/dashboard` - User's post management
- [ ] `/dashboard/new` - Create new post
- [ ] `/dashboard/edit/[id]` - Edit existing post
- [ ] `/@[username]` - Public blog homepage
- [ ] `/@[username]/[slug]` - Individual post page

### 1.4 API Routes
- [ ] `POST /api/posts` - Create post
- [ ] `PUT /api/posts/[id]` - Update post
- [ ] `DELETE /api/posts/[id]` - Delete post
- [ ] `POST /api/posts/[id]/publish` - Publish/unpublish

---

## Phase 2: Editor Experience

### 2.1 TipTap Integration
- [ ] Basic formatting (bold, italic, headings)
- [ ] Lists (bullet, numbered)
- [ ] Code blocks with syntax highlighting
- [ ] Image uploads (Vercel Blob)
- [ ] Link embedding
- [ ] Autosave (draft every 30s)

### 2.2 Post Features
- [ ] Markdown import/export
- [ ] Cover images
- [ ] SEO meta fields
- [ ] Reading time estimation

---

## Phase 3: Social Features

### 3.1 Discovery
- [ ] `/explore` - Browse all public posts
- [ ] Tags/categories
- [ ] Search functionality

### 3.2 Engagement
- [ ] Comments (optional per-post)
- [ ] Share buttons
- [ ] RSS feed per blog

---

## Phase 4: Customization

### 4.1 Blog Appearance
- [ ] Theme selection (3-5 minimal themes)
- [ ] Custom header/footer
- [ ] Custom domain support

### 4.2 Analytics
- [ ] Basic view counts
- [ ] Simple dashboard analytics

---

## File Structure

```
scribe/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (marketing)/
│   │   └── page.tsx          # Landing
│   ├── @[username]/
│   │   ├── page.tsx          # Blog home
│   │   └── [slug]/
│   │       └── page.tsx      # Post view
│   ├── dashboard/
│   │   ├── page.tsx          # Posts list
│   │   ├── new/
│   │   │   └── page.tsx      # New post
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx  # Edit post
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── posts/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── editor/
│   │   ├── Editor.tsx
│   │   └── Toolbar.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   └── PostList.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       └── ... (buttons, inputs, etc.)
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Commands for Claude Code

### Initial Setup
```bash
# Clone and setup
git clone https://github.com/rmashate/scribe.git
cd scribe

# Initialize Next.js (replace README)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack

# Install dependencies
npm install prisma @prisma/client
npm install next-auth@beta @auth/prisma-adapter
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install slugify date-fns
npm install -D @types/node

# Initialize Prisma
npx prisma init
```

### Environment Variables Needed
```env
# .env.local
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
```

---

## Development Milestones

| Milestone | Deliverable | Est. Time |
|-----------|-------------|----------|
| M1 | Auth + DB setup | 2 hours |
| M2 | Dashboard CRUD | 3 hours |
| M3 | TipTap editor | 2 hours |
| M4 | Public blog pages | 2 hours |
| M5 | Polish + deploy | 1 hour |

**Total MVP: ~10 hours**

---

## Success Criteria

1. User can sign up/login with GitHub
2. User can create, edit, delete posts
3. User can publish posts to `/@username/slug`
4. Posts render with proper formatting
5. Blog is publicly accessible

---

## References

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js v5](https://authjs.dev)
- [TipTap Docs](https://tiptap.dev)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
