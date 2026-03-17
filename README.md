# SmylSync Landing

A modern marketing website for **SmylSync**, a virtual assistant platform that helps U.S. dental practices eliminate administrative chaos and get back to creating smiles.

Built on **Next.js** with **Tailwind CSS**, **Stackbit visual editing**, and **AI-powered features** including a semantic search chatbot powered by OpenAI and Neon Postgres.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Feature Setup Guides](#feature-setup-guides)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## Project Overview

SmylSync Landing is a production-ready marketing website that includes:

- **Content management** via filesystem (`content/` with Markdown pages & JSON data)
- **Visual editing** powered by Stackbit + [Netlify Visual Editor](https://docs.netlify.com/visual-editor/overview/)
- **AI-powered chatbot** (Admin Rescue Assistant / ARA) with semantic search using OpenAI embeddings
- **Intelligent search** (Algolia integration)
- **Contact form** with email notifications
- **Analytics** via click tracking and database persistence
- **Component-driven architecture** mapping content models to React components
- **E2E testing** with Cypress

All pages are optimized for conversion and tailored to dental practice decision-makers.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Next.js 15 (Pages Router) + React 19
- **Styling**: Tailwind CSS 3 + custom CSS
- **Content Management**: Stackbit + Netlify Visual Editor (Git-based)
- **AI/Chatbot**: OpenAI API (chat completion + embeddings)
- **Database**: Neon Postgres (semantic search, click tracking)
- **Search**: Algolia (site-wide search UI)
- **Email**: Nodemailer (contact form)
- **Testing**: Cypress (E2E)
- **Deployment**: Netlify

## Key Features

### 🤖 AI Chatbot (ARA - Admin Rescue Assistant)

An intelligent assistant that answers questions about SmylSync, dental practice workflows, and services using:

- **Semantic search** on vectorized content from Neon Postgres
- **OpenAI GPT** for natural language responses
- **Server-Sent Events** for streaming responses
- **Memory** of conversation history

### 🔍 Site Search

Algolia-powered search to help visitors quickly find information about:

- How SmylSync works
- Services and benefits
- Case studies and testimonials
- Pricing and contact information

### 📬 Contact & Lead Generation

- Contact form with email notifications via Nodemailer
- Automatic email delivery to sales team
- Follow-up confirmation to prospect

### 📊 Analytics & Tracking

- Click tracking for CTA buttons and links
- Database persistence in Neon Postgres
- Privacy-aware tracking (respects browser Do Not Track)

### ✏️ Visual Editing

- Stackbit visual editor for non-technical content updates
- Real-time preview of changes
- Git-backed content (all changes trackable and versionable)

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

Create a `.env.local` file with the following variables (see `.env-example`):

**Essential for chatbot:**

```
OPENAI_API_KEY=sk-...
NETLIFY_DATABASE_URL=postgresql://...
```

**Optional for search:**

```
NEXT_PUBLIC_ALGOLIA_APP_ID=...
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=...
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=...
ALGOLIA_ADMIN_API_KEY=...
```

**Optional for contact form:**

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

**Optional for click tracking:**

```
PERSIST_CLICK_TRACK=true
NETLIFY_DATABASE_URL=postgresql://...
```

### Database Setup

To enable the AI chatbot with semantic search:

```bash
npm run chunk-embed-content-pages
```

This script chunks content pages, generates OpenAI embeddings, and stores them in Neon Postgres for semantic search.

### Visual Editor

To use Stackbit visual editor locally:

```bash
npm install -g @stackbit/cli
stackbit dev
```

This opens the visual editor connected to your local site.

## Architecture

### Routing & Static Generation

- **Catch-all route**: `src/pages/[[...slug]].js` – handles all page requests
- **Static paths**: Built from `content/pages/*.md` and site structure
- **Props resolution**: Loaded from `content/data/` JSON files

### Content Pipeline

1. **Content Source**: Markdown pages + JSON data files in `content/`
2. **Content Loader**: `src/utils/local-content.ts` reads and parses content
3. **Component Registry**: `src/components/components-registry.ts` maps model names (e.g., `GenericSection`, `PageLayout`) to React components
4. **Page Rendering**: Next.js renders components with content props

### AI RAG (Retrieval Augmented Generation) Pipeline

1. **Content Indexing**: `scripts/chunk_and_embed_content_pages.ts` chunks content and generates OpenAI embeddings
2. **Vector Storage**: Embeddings stored in Neon Postgres (`website_chunks` table)
3. **Chat API**: `src/pages/api/chat.js` handles requests by:
   - Running semantic search on the query
   - Sending context + query to OpenAI GPT
   - Streaming response via Server-Sent Events
4. **Chatbot UI**: `src/components/Chatbot/index.tsx` renders the conversation interface

### API Routes

- `/api/chat` – AI chatbot endpoint (requires `OPENAI_API_KEY` + `NETLIFY_DATABASE_URL`)
- `/api/reindex` – Algolia search reindexing
- `/api/send-email` – Contact form submissions (requires email config)
- `/api/click-track` – Click tracking analytics (optional Postgres persistence)

## Available Scripts

| Script                              | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `npm run dev`                       | Start Next.js dev server (http://localhost:3000)  |
| `npm run build`                     | Build for production                              |
| `npm run start`                     | Start production server                           |
| `npm run test`                      | Run Vitest unit tests                             |
| `npm run test:watch`                | Run tests in watch mode                           |
| `npm run chunk-embed-content-pages` | Generate and store embeddings in Neon for chatbot |
| `npm run cypress:open`              | Open Cypress test runner UI                       |
| `npm run cy:e2e`                    | Run E2E tests headlessly                          |
| `npm run cy:ci`                     | Start server and run E2E tests (CI-friendly)      |

## Testing

### E2E Tests (Cypress)

Automated end-to-end tests covering:

- Homepage and navigation
- Individual pages (About, How It Works, Services, etc.)
- Contact form submission
- Chatbot interactions
- Footer functionality

Run tests:

```bash
npm run cy:e2e          # Headless
npm run cypress:open    # Interactive UI
npm run cy:ci           # Start server + run tests
```

Test specifications are in `cypress/e2e/`

### Unit Tests (Vitest)

Component and utility tests:

```bash
npm run test        # Single run
npm run test:watch  # Watch mode
```

## Feature Setup Guides

### AI Chatbot (Admin Rescue Assistant - ARA)

**Overview**: ARA is an intelligent chatbot that answers visitor questions using semantic search and OpenAI GPT. It provides context-aware responses about SmylSync, dental practice administration, and implementation.

**Components:**

- **UI**: `src/components/Chatbot/index.tsx` – Chat interface with toggle button and message history
- **API**: `src/pages/api/chat.js` – Request handler with semantic search + OpenAI integration
- **Search**: `src/utils/semantic-search.js` – Vector-based content search using Neon Postgres

**Setup:**

1. Set environment variables:

   ```
   OPENAI_API_KEY=sk-...
   NETLIFY_DATABASE_URL=postgresql://...
   ```

2. Generate embeddings from content pages:
   ```bash
   npm run chunk-embed-content-pages
   ```
   This chunks content, generates embeddings using OpenAI's `text-embedding-3-small` model, and stores them in the `website_chunks` table.

**Request/Response:**

The `/api/chat` endpoint accepts:

```json
{
  "message": "User question",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

Responses stream as Server-Sent Events (SSE):

```
data: {"type":"text","content":"response text"}
data: {"type":"end"}
```

**Fallback**: If `OPENAI_API_KEY` is missing, the chat still functions with a basic fallback response.

### Algolia Search

Site-wide search powered by Algolia.

**Environment Variables:**

```
NEXT_PUBLIC_ALGOLIA_APP_ID=...
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=...
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=...
ALGOLIA_ADMIN_API_KEY=...
```

**Indexing**: Trigger reindex via `/api/reindex.js` after content changes.

### Contact Form & Email Notifications

Contact form (`/contact-us`) submits to `/api/send-email.js` using Nodemailer.

**Setup:**

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: Use Gmail app passwords, not account passwords.

### Click Tracking Analytics

Track user interactions (button clicks, link follows, etc.) with database persistence.

**Setup:**

```
PERSIST_CLICK_TRACK=true
NETLIFY_DATABASE_URL=postgresql://...
```

**Features:**

- Privacy-aware (respects browser Do Not Track setting)
- Optional Postgres persistence
- Tracks in `smylsync_clicktrack` table
- See `create-smylsync_clicktrack-table.sql` for schema

## Deployment

### Netlify

This site is optimized for deployment on Netlify.

**Build Settings:**

- Build command: `npm run build`
- Publish directory: `.next`

**Environment Variables**: Set the following in Netlify project settings:

- `OPENAI_API_KEY`
- `NETLIFY_DATABASE_URL`
- `EMAIL_USER` and `EMAIL_PASS`
- Algolia keys (if using search)

**Automatic Deployments**: Connect your Git repository to Netlify for automatic builds on every push to main.

### Building for Production

```bash
npm run build
npm run start
```

The production build optimizes:

- Static site generation for fast page loads
- Image optimization via Next.js Image
- Code splitting and minification
- Database query caching where applicable

## Project Structure

```
├── content/                  # Content source (Markdown + JSON)
│   ├── pages/               # Site pages (.md)
│   └── data/                # Site configuration (JSON)
├── sources/local/
│   ├── models/              # Stackbit content models
│   └── presets/             # Layout presets
├── src/
│   ├── components/          # React components
│   │   ├── Chatbot/        # ARA chatbot UI
│   │   ├── atoms/          # Basic elements
│   │   ├── blocks/         # Content blocks
│   │   ├── layouts/        # Page layouts
│   │   ├── sections/       # Major sections
│   │   └── svgs/           # SVG icons/graphics
│   ├── css/                 # Global styles (Tailwind + custom)
│   ├── pages/               # Next.js pages & API routes
│   │   ├── api/            # API endpoints (chat, email, etc.)
│   │   ├── _app.js         # App wrapper
│   │   └── [[...slug]].js  # Catch-all routing
│   └── utils/               # Utility functions
│       ├── semantic-search.js    # Vector search
│       ├── click-tracker.ts      # Analytics
│       └── indexer/             # Algolia indexing
├── scripts/
│   └── chunk_and_embed_content_pages.ts  # Vectorization script
├── cypress/
│   ├── e2e/                 # E2E tests
│   └── support/             # Test helpers
├── public/
│   └── images/              # Static assets
└── stackbit.config.ts       # Stackbit configuration
```
