# Technology Stack

## Architecture
**Static Site Generation (SSG)** with client-side interactivity for optimal performance and SEO. The application uses Next.js with static export for Netlify deployment, ensuring fast loading times and offline capabilities while maintaining dynamic map functionality through client-side rendering.

## Frontend Framework & Libraries
- **Next.js 15.5.5**: App Router architecture with React Server Components
- **React 19.1.0**: Latest React with concurrent features and improved performance
- **TypeScript 5**: Strict type checking enabled for enhanced code quality
- **Tailwind CSS 4**: Utility-first CSS framework with PostCSS integration
- **Google Maps JavaScript API**: Interactive mapping with custom markers and info windows

## Core Dependencies
- **@types/google.maps**: TypeScript definitions for Google Maps API integration
- **dynamic imports**: For client-side map rendering (SSR disabled for map components)

## Development Environment
### Required Tools
- **Node.js**: Latest LTS version for package management and build process
- **npm/yarn/pnpm/bun**: Package manager (npm scripts configured)
- **TypeScript Compiler**: For type checking and compilation
- **ESLint**: Code linting with Next.js configuration
- **Jest**: Testing framework with jsdom environment

### Development Setup
```bash
npm install          # Install dependencies
npm run dev          # Start development server with Turbopack
npm run build        # Build for production (static export)
npm run start        # Serve production build
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
```

## Common Commands
- **Development**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build` (static export for Netlify)
- **Type Check**: TypeScript integrated in build process
- **Linting**: `npm run lint` with ESLint Next.js config
- **Testing**: `npm run test` with Jest and React Testing Library

## Environment Variables
### Required
- **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**: Google Maps JavaScript API key for map rendering
  - Must be prefixed with `NEXT_PUBLIC_` for client-side access
  - Configured in `next.config.ts` for build-time availability

### Configuration Files
- **next.config.ts**: Next.js configuration with static export and image optimization
- **tsconfig.json**: TypeScript configuration with strict mode and path mapping
- **tailwind.config.js**: Tailwind CSS configuration (via PostCSS)
- **jest.config.js**: Jest testing configuration with Next.js integration

## Port Configuration
- **Development Server**: http://localhost:3000 (default Next.js port)
- **Production**: Static files served via Netlify CDN

## Build & Deployment
- **Build Output**: Static files exported to `out/` directory
- **Deployment Target**: Netlify static hosting
- **Image Optimization**: Disabled for static export compatibility
- **Asset Handling**: Static assets served from `public/` directory

## Testing Framework
- **Jest 30.2.0**: Test runner with Next.js integration
- **React Testing Library 16.3.0**: Component testing utilities
- **jsdom Environment**: Browser environment simulation for testing
- **@testing-library/jest-dom**: Enhanced DOM matchers for assertions

## Type System
- **Strict TypeScript**: Full type coverage with no build errors allowed
- **Custom Types**: Comprehensive type definitions for Store, Map, and Coordinates
- **API Integration**: Typed Google Maps API integration
- **Path Mapping**: `@/*` aliases for clean imports from `src/`

## Performance Optimizations
- **Turbopack**: Fast bundler for development builds
- **Dynamic Imports**: Code splitting for map components
- **Static Generation**: Pre-built pages for optimal loading
- **Image Optimization**: Configured for web-optimized formats
- **Tree Shaking**: Automatic unused code elimination