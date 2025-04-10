# Pengunin Blog Frontend

A blog application built with React, TypeScript, and Vite, optimized for production environments.

## Features

- View list of posts
- View post details
- Categorize by categories and tags
- Admin interface for managing posts, categories, and tags
- Support for multiple themes (light/dark)
- Visual editor for writing posts

## Project Structure

```
my-react-app/
├── .github/                   # CI/CD workflows and GitHub configuration
├── public/                    # Static files
├── src/
│   ├── assets/                # Static resources (images, fonts, etc.)
│   ├── components/            # Reusable components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── layouts/               # Layout components
│   ├── lib/                   # Libraries and utilities
│   ├── pages/                 # Page components
│   ├── services/              # API calls, services
│   ├── store/                 # State management
│   ├── types/                 # TypeScript interfaces, types
│   ├── utils/                 # Helper functions
```

## Getting Started

### Requirements

- Node.js (>= v20.x)
- npm (>= v10.x)

### Installation

```bash
# Clone repository
git clone <repository-url>

# Navigate to project directory
cd blog-fe

# Install dependencies
npm install
```

### Running the Project

```bash
# Run development environment
npm run dev

# Build for production
npm run build:prod

# Run tests
npm test

# Check linting
npm run lint
```

## Environment

The project uses environment variables for configuration:

- `.env` - Development environment
- `.env.production` - Production environment

## Deployment

The project uses GitHub Actions for CI/CD pipeline. Each push to the `main` branch will automatically test, build, and deploy the code.

## Optimizations

- Code splitting and lazy loading
- Bundle size optimization
- Separating large dependencies into separate chunks
- Automatic minification in production environment
