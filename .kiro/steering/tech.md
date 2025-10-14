# Technology Stack

## Architecture
Single-page web application built with modern React framework, designed for responsive mapping and data visualization. Uses Next.js App Router architecture for optimal performance and SEO.

## Frontend Stack
- **Framework**: Next.js 15.5.5 with App Router
- **UI Library**: React 19.1.0 with functional components and hooks
- **Language**: TypeScript 5+ for type safety and developer experience
- **Styling**: Tailwind CSS 4 with custom design system
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Build Tool**: Turbopack for fast development and production builds

## Development Environment
- **Node.js**: Required for Next.js development
- **Package Manager**: npm (lockfile present)
- **TypeScript**: Strict mode enabled with modern ES2017+ target
- **Linting**: ESLint 9 with Next.js configuration
- **Module Resolution**: Bundler resolution with path aliases (`@/*` → `./src/*`)

## Common Commands
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build with Turbopack optimization
npm run start        # Start production server
npm run lint         # Run ESLint code quality checks
```

## Configuration Files
- `next.config.ts`: Next.js configuration (minimal setup)
- `tsconfig.json`: TypeScript compiler options with strict mode
- `postcss.config.mjs`: PostCSS configuration for Tailwind
- `eslint.config.mjs`: ESLint rules and Next.js integration

## Environment Variables
Currently none defined. Future map API keys and database connections will be configured through environment variables.

## Port Configuration
- **Development**: http://localhost:3000 (Next.js default)
- **Production**: Configurable via PORT environment variable

## Dark Mode Support
Built-in dark mode support using CSS custom properties and `prefers-color-scheme` media query. Tailwind includes dark: variant classes for theming.

## Future Considerations
- Map service integration (Google Maps, Mapbox, or OpenStreetMap)
- Data storage solution (database or API integration)  
- State management (if complex data flows emerge)
- Authentication system (if user accounts needed)