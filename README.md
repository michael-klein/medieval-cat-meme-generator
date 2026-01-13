# Medieval Cat Meme Generator

A modern reimplementation of the medieval cat meme generator using Angular 19 and Cloudflare Workers.

## Quick Links

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Detailed project structure and architecture
- **Original Project**: The old implementation has been moved to `/old` (untracked)

## Project Structure

```
.
├── frontend/          # Angular 19 application
├── backend/           # Cloudflare Worker (API)
├── old/              # Original implementation (untracked)
└── .env.local        # Local development environment variables
```

## Prerequisites

- Node.js (v18 or higher)
- npm
- Cloudflare account (for deployment)

## Local Development

### Backend (Cloudflare Worker)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:8787`

### Frontend (Angular)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:4200`

### Testing the API

Once both servers are running, the frontend will automatically call the `/hello_world` endpoint on the backend and log the response to the browser console.

## Deployment

### Backend Deployment (Cloudflare Worker)

1. Login to Cloudflare:
   ```bash
   cd backend
   npx wrangler login
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

3. Update the frontend environment file with your deployed worker URL:
   ```typescript
   // frontend/src/environments/environment.ts
   export const environment = {
     production: true,
     apiUrl: 'https://your-worker.your-subdomain.workers.dev'
   };
   ```

### Frontend Deployment (Cloudflare Pages)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist/frontend/browser --project-name=medieval-cat-meme-generator
   ```

   Or connect your GitHub repository to Cloudflare Pages with these build settings:
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `frontend/dist/frontend/browser`
   - **Root directory**: `/`

## API Endpoints

### GET /hello_world

Returns a simple greeting message.

**Response:**
```
hello back
```

## Technology Stack

- **Frontend**: Angular 19, TypeScript, SCSS
- **Backend**: Cloudflare Workers, TypeScript
- **Deployment**: Cloudflare Pages (frontend), Cloudflare Workers (backend)

## Development Notes

- The backend uses Cloudflare Workers' fetch handler format
- CORS is enabled for local development
- The frontend uses Angular's standalone components (best practice for Angular 19)
- Environment configuration is handled through Angular's environment files

## License

ISC
