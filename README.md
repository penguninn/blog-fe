# Pengunin Blog

> **Live Demo:** [blog.penguninn.com](https://blog.penguninn.com)  
> **Backend Repository:** [penguninn/blog-be](https://github.com/penguninn/blog-be)

A modern, full-stack blog platform featuring a React TypeScript frontend with rich content creation capabilities, secure authentication, and a professional admin interface.

## ✨ Features

### 📝 Content Management
- **Rich Text Editor** - TipTap-powered WYSIWYG editor with advanced formatting
- **Post Management** - Create, edit, delete, and organize blog posts
- **Category System** - Organize content with hierarchical categories
- **SEO-Optimized** - Slug-based URLs and metadata support

### 🔐 Authentication & Authorization  
- **Keycloak Integration** - Enterprise-grade authentication
- **Role-Based Access** - User and admin role management
- **Protected Routes** - Secure access to admin features
- **User Profiles** - Profile management and editing

### 🎨 User Experience
- **Responsive Design** - Mobile-first, fully responsive interface
- **Dark/Light Theme** - System-aware theme switching
- **Modern UI Components** - Radix UI-based component library
- **Loading States** - Lazy loading and smooth transitions

### ⚡ Performance & Developer Experience
- **Vite Build System** - Lightning-fast development and builds
- **TypeScript** - Full type safety and IntelliSense
- **Code Splitting** - Optimized bundle splitting for faster loads
- **ESLint & Prettier** - Automated code formatting and linting

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Build Tool:** Vite 6 with optimized bundles
- **UI Library:** Radix UI primitives with shadcn/ui
- **Editor:** TipTap rich text editor
- **Authentication:** Keycloak with React integration
- **HTTP Client:** Axios with proxy configuration
- **Routing:** React Router v7 with lazy loading
- **Styling:** Tailwind CSS v4 with custom design system

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x  
- **Backend API** running on port 8080 ([setup guide](https://github.com/penguninn/blog-be))
- **Keycloak** authentication server on port 9000

### Installation

```bash
# Clone the repository
git clone https://github.com/penguninn/blog-fe.git
cd blog-fe

# Install dependencies  
npm install

# Setup environment variables
cp .env.example .env
```

### Environment Configuration

Edit `.env` with your settings:

```env
# Keycloak Authentication (Required)
VITE_KEYCLOAK_URL=http://localhost:9000
VITE_KEYCLOAK_REALM=blog-realm
VITE_KEYCLOAK_CLIENT_ID=blog-spa

# API Configuration (Optional - uses Vite proxy by default)
VITE_API_BASE_URL=http://localhost:8080
```

### Keycloak Setup

Configure your Keycloak client:

- **Client ID:** `blog-spa`
- **Client Type:** Public
- **Valid Redirect URIs:** `http://localhost:5173/*`  
- **Web Origins:** `http://localhost:5173`
- **Root URL:** `http://localhost:5173`

### Development

```bash
# Start development server
npm run dev              # → http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run typecheck

# Format code  
npm run format
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── common/         # Shared components
│   └── forms/          # Form components
├── pages/              # Route components
│   ├── Home.tsx        # Blog homepage
│   ├── PostDetails.tsx # Individual post view
│   ├── ListPost.tsx    # Post listing page
│   └── admin/          # Admin interface
├── layouts/            # Layout components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── constants/          # App constants
```

## 🔧 API Integration

The frontend communicates with the backend through:

- **Development:** Vite proxy (`/api` → `http://localhost:8080`)
- **Production:** Direct API calls to configured backend URL
- **Authentication:** Keycloak JWT tokens in request headers
- **Error Handling:** Axios interceptors with user-friendly messages

## 🚢 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm run analyze
```

### Environment Variables (Production)

```env
VITE_KEYCLOAK_URL=https://your-keycloak-server.com
VITE_KEYCLOAK_REALM=production-realm  
VITE_KEYCLOAK_CLIENT_ID=blog-spa-prod
VITE_API_BASE_URL=https://your-api-server.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Application:** [blog.penguninn.com](https://blog.penguninn.com)
- **Backend Repository:** [penguninn/blog-be](https://github.com/penguninn/blog-be)
- **Documentation:** [Project Wiki](../../wiki)

---

Built with ❤️ by [penguninn](https://github.com/penguninn)
