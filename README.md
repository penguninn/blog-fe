# Pengunin Blog Frontend

A local development React application built with React, TypeScript, and Vite for blog management.

## Features

- View list of posts
- View post details
- Categorize by categories and tags
- Admin interface for managing posts, categories, and tags
- Support for multiple themes (light/dark)
- Visual editor for writing posts

## Local Development Setup

### Requirements

- Node.js (>= v20.x)
- npm (>= v10.x)
- Backend API running on `http://localhost:8080`
- Keycloak authentication server on `http://localhost:9000`

### Installation

```bash
# Clone repository
git clone <repository-url>

# Navigate to project directory
cd blog-fe

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Configuration

1. **Environment Variables**: Edit `.env` file with your Keycloak settings:

   ```bash
   VITE_KEYCLOAK_URL=http://localhost:9000
   VITE_KEYCLOAK_REALM=blog-realm
   VITE_KEYCLOAK_CLIENT_ID=blog-spa
   VITE_ENABLE_LOGGING=true
   ```

2. **Keycloak Client Setup** (localhost:9000):
   - Client ID: `blog-spa`
   - Client Type: Public
   - Valid Redirect URIs: `http://localhost:5173/*`
   - Web Origins: `http://localhost:5173`

### Running the Application

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for testing
npm run build

# Run tests
npm run test

# Check linting
npm run lint

# Preview built app
npm run preview
```

### API Integration

- Frontend runs on `http://localhost:5173`
- API calls are proxied to `http://localhost:8080` via Vite dev server
- All API calls use relative paths (e.g., `api.get('/posts')`)

### Development Notes

- CSP iframe warnings are disabled for Keycloak in development mode
- Console logging is enabled via `VITE_ENABLE_LOGGING=true`
- Source maps are generated in development builds
