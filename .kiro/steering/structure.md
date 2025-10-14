# Project Structure

## Root Directory Organization
```
/
├── .kiro/                  # Spec-driven development files
│   ├── steering/          # Project context and guidelines  
│   └── specs/             # Feature specifications
├── .claude/               # Claude Code commands and configuration
├── .next/                 # Next.js build output (auto-generated)
├── public/                # Static assets served at root
├── src/                   # Source code
│   └── app/              # Next.js App Router pages and layouts
├── node_modules/          # Dependencies (auto-generated)
├── CLAUDE.md             # Claude Code project instructions
├── README.md             # Project documentation
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
├── postcss.config.mjs    # PostCSS/Tailwind configuration
└── eslint.config.mjs     # ESLint configuration
```

## Source Code Structure (`src/`)
```
src/
└── app/                   # Next.js App Router directory
    ├── globals.css        # Global styles with Tailwind imports
    ├── layout.tsx         # Root layout component
    ├── page.tsx           # Home page component  
    └── favicon.ico        # Site favicon
```

## Public Assets (`public/`)
- **SVG Icons**: next.svg, vercel.svg, file.svg, globe.svg, window.svg
- **Static Files**: Served directly at application root URL

## Code Organization Patterns

### App Router Structure
- **Layouts**: `layout.tsx` files define shared UI for route segments
- **Pages**: `page.tsx` files define route endpoints and render UI
- **Global Styles**: Single `globals.css` file with Tailwind imports
- **Metadata**: Exported from layout files for SEO optimization

### Component Architecture (Future)
```
src/
├── app/                   # App Router pages and layouts
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI elements (buttons, inputs)
│   ├── map/              # Map-specific components
│   └── common/           # Shared components (header, footer)
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── styles/               # Additional CSS modules if needed
```

## File Naming Conventions
- **React Components**: PascalCase for files and exports (`MapView.tsx`)
- **Pages/Layouts**: lowercase with Next.js conventions (`page.tsx`, `layout.tsx`)
- **Utilities**: camelCase for functions, kebab-case for files (`map-utils.ts`)
- **Types**: PascalCase interfaces/types in `types/` directory
- **CSS Files**: kebab-case (`component-name.module.css`)

## Import Organization
```typescript
// 1. External libraries
import React from 'react'
import { NextPage } from 'next'

// 2. Internal utilities and types
import { MapLocation } from '@/types'
import { formatLocation } from '@/lib/utils'

// 3. Components (general to specific)
import { Button } from '@/components/ui'
import { MapView } from '@/components/map'

// 4. Relative imports
import './page.css'
```

## Key Architectural Principles
- **App Router**: Leverage Next.js 13+ App Router for file-based routing
- **TypeScript-First**: All components and utilities should be typed
- **Component Composition**: Build complex UI from smaller, reusable components
- **CSS-in-JS**: Use Tailwind classes with CSS custom properties for theming
- **Path Aliases**: Use `@/*` imports to avoid relative path complexity
- **Separation of Concerns**: Keep business logic separate from UI components

## Development Workflow
1. **Feature Development**: Start in `src/app/` for pages, move reusable code to `src/components/`
2. **Type Definitions**: Add interfaces to `src/types/` as data models emerge
3. **Utility Functions**: Place shared logic in `src/lib/` directory
4. **Styling**: Use Tailwind classes primarily, CSS modules for complex styling needs