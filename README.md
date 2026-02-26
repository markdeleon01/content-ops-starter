# Content Ops Starter

![Content Ops Starter](https://assets.stackbit.com/docs/content-ops-starter-thumb.png)

Netlify starter built on **Next.js** that’s designed for content operations: a flexible content model, a component library, and **visual editing** via [Netlify Visual Editor](https://docs.netlify.com/visual-editor/overview/) backed by a [Git Content Source](https://docs.netlify.com/create/content-sources/git/).

**⚡ View demo:** [https://content-ops-starter.netlify.app/](https://content-ops-starter.netlify.app/)

## Table of Contents

- [What this repo contains](#what-this-repo-contains)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quickstart](#quickstart)
- [Content and visual editing](#content-and-visual-editing)
- [Architecture overview](#architecture-overview)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Testing (Cypress)](#testing-cypress)
- [Search (Algolia)](#search-algolia)
- [Email (contact form)](#email-contact-form)
- [Ara chatbot backend (optional)](#ara-chatbot-backend-optional)
- [Click tracking (optional)](#click-tracking-optional)
- [Deploying to Netlify](#deploying-to-netlify)
- [Building for production](#building-for-production)
- [Support](#support)

## What this repo contains

This project is a production-ready marketing/content site that:

- Uses **filesystem content** in `content/` (Markdown pages + JSON data)
- Uses **Stackbit models and presets** in `sources/local/` to power Netlify Visual Editor
- Renders pages in Next.js by mapping **content model names → React components**
- Includes **Algolia search** (and an API endpoint to reindex)
- Includes optional **contact form email** and **click tracking** API routes

## Tech stack

- **Runtime**: Node.js 18 (see `.nvmrc`)
- **Framework**: Next.js (Pages Router) + React
- **Styling**: Tailwind CSS + global CSS in `src/css/`
- **Content modeling / visual editing**: Stackbit + Netlify Visual Editor
- **Testing**: Cypress (E2E + component)

## Project structure

```txt
.
├── content/
│   ├── data/
│   └── pages/
├── sources/
│   └── local/
│       ├── models/
│       └── presets/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── blocks/
│   │   ├── layouts/
│   │   └── sections/
│   ├── css/
│   ├── pages/
│   │   └── api/
│   └── utils/
├── public/
│   └── images/
├── cypress/
│   ├── e2e/
│   ├── fixtures/
│   └── support/
├── stackbit.config.ts
├── netlify.toml
└── package.json
```

## Quickstart

```txt
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Content and visual editing

- **Content lives in Git** under `content/`
  - `content/pages/`: site pages in Markdown
  - `content/data/`: site data in JSON (header, footer, site settings, theme style, etc.)
- **Visual editor**: install the Netlify Visual Editor CLI and run:

```txt
npm install -g @stackbit/cli
stackbit dev
```

This outputs a Visual Editor URL that loads your local site and connects it to the editor UI.

## Architecture overview

- **Routing**: `src/pages/[[...slug]].js` is the catch-all route. It builds static paths and props from local content.
- **Content loading**: `src/utils/local-content.ts` + static resolvers (`src/utils/static-*.js`) read and normalize `content/`.
- **Component registry**: `src/components/components-registry.ts` maps **model names** (e.g. `GenericSection`, `PageLayout`) to React components using dynamic imports.
- **Stackbit config**: `stackbit.config.ts` defines the Git content source, asset handling (`public/images`), preset dirs, and the site map.

## Environment variables

Create `.env.local` (or set variables in Netlify) as needed. This starter supports:

- **Algolia (search UI)**:
  - `NEXT_PUBLIC_ALGOLIA_APP_ID`
  - `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`
  - `NEXT_PUBLIC_ALGOLIA_INDEX_NAME`
- **Algolia (server-side indexing via `/api/reindex`)**:
  - `ALGOLIA_ADMIN_API_KEY`
- **Email (via `/api/send-email`)**:
  - `EMAIL_USER` (Gmail address)
  - `EMAIL_PASS` (Gmail app password)
- **Click tracking (via `/api/click-track`)**:
  - `PERSIST_CLICK_TRACK` (`true` to write to DB; otherwise the endpoint is a no-op)
  - `NETLIFY_DATABASE_URL` (Neon / Postgres connection string)
- **AI Chatbot (via `/api/chat`)**:
  - `OPENAI_API_KEY` (required): OpenAI API key for embeddings and chat completion
  - `NETLIFY_DATABASE_URL` (required): Neon / Postgres connection string for semantic search

Tip: this repo includes `.env-example` as a starting point.

## Scripts

- `npm run dev`: start Next.js dev server
- `npm run build`: build for production
- `npm run start`: start the production server
- `npm run cy:e2e`: run Cypress E2E tests headlessly
- `npm run cypress:open`: open Cypress runner UI
- `npm run cy:ci`: start server then run E2E tests (CI-friendly)

## Testing (Cypress)

Specs live in `cypress/e2e/`. To run E2E tests:

```txt
npm run cy:e2e
```

## Search (Algolia)

This starter includes Algolia search integration.

- **Search UI** uses the public `NEXT_PUBLIC_*` variables.
- **Indexing** is performed by `src/utils/indexer/` and can be triggered via the API route:
  - `src/pages/api/reindex.js`

## Email (contact form)

The contact form posts to `src/pages/api/send-email.js`, which uses Nodemailer with Gmail.

Set `EMAIL_USER` and `EMAIL_PASS` (app password) before using this endpoint.

## AI Chatbot (ARA - Admin Rescue Assistant)

This starter includes a fully functional AI chatbot powered by OpenAI and semantic search.

### Components

- **UI Component**: `src/components/Chatbot/index.tsx` – A React component that renders the chat interface with toggle button and message history
- **Chat API**: `src/pages/api/chat.js` – Handles incoming chat requests with the following flow:
  1. Performs semantic search on user query to find relevant content from the database
  2. Sends the query + context to OpenAI's GPT model (with streaming response)
  3. Returns the streamed response to the client via Server-Sent Events (SSE)
- **Semantic Search**: `src/utils/semantic-search.js` – Generates embeddings for queries and searches the `website_chunks` table in Neon for similar content (powered by vector similarity)

### Setup

To enable the chatbot, set these environment variables:

- **`OPENAI_API_KEY`**: Your OpenAI API key (required for embeddings and chat completion)
- **`NETLIFY_DATABASE_URL`**: Neon/Postgres connection string (required for semantic search)

You also need to set up the database by running the vectorization script:

```bash
node scripts/chunk_and_embed_content_pages.ts
```

This script:

- Chunks your content pages into manageable segments
- Generates embeddings for each chunk using OpenAI's `text-embedding-3-small` model
- Stores chunks in the `website_chunks` table with their embeddings

### Request/Response

The `/api/chat` endpoint expects:

```json
{
  "message": "User's question",
  "history": [
    { "role": "user", "content": "Previous user message" },
    { "role": "assistant", "content": "Previous assistant response" }
  ]
}
```

Responses are streamed as SSE (Server-Sent Events) with the format:

```
data: {"type":"text","content":"partial response text"}
data: {"type":"end"}
```

If relevant context is not found or if `OPENAI_API_KEY` is not set, a fallback reply is returned so the chat UI still works.

## Click tracking (optional)

Client events can be sent to `src/pages/api/click-track.js`. If `PERSIST_CLICK_TRACK=true`, the endpoint will insert rows into a Postgres table named `smylsync_clicktrack`.

- **DB setup**: see `create-smylsync_clicktrack-table.sql` for the table schema.
- **Privacy**: requests include a `doNotTrack` flag; inserts are skipped when `doNotTrack` indicates “do not track”.

## Deploying to Netlify

If you click "Deploy to Netlify" button, it will create a new repo for you that looks exactly like this one, and sets that repo up immediately for deployment on Netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/content-ops-starter)

## Building for production

To build for production, run:

```shell
npm run build
```

## Support

If you get stuck along the way, get help in our [support forums](https://answers.netlify.com/).
