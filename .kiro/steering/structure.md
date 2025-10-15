# Project Structure

## Root Directory Organization
```
pork-ban-map-app/
├── .kiro/                    # Kiro spec-driven development files
│   └── steering/             # Project steering documents
├── src/                      # Source code (primary development directory)
├── public/                   # Static assets and data files
├── __tests__/                # Test files at root level
├── docs/                     # Project documentation
├── out/                      # Build output (static export)
├── .next/                    # Next.js build cache
└── node_modules/             # Dependencies
```

## Subdirectory Structures

### Source Code (`src/`)
```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with global styles
│   ├── page.tsx             # Home page (map interface)
│   ├── globals.css          # Global CSS with Tailwind directives
│   └── favicon.ico          # Site favicon
├── components/              # Reusable React components
│   ├── MapContainer.tsx     # Map wrapper component
│   ├── MapWithStores.tsx    # Main map with store markers
│   ├── StoreMarker.tsx      # Individual store marker component
│   └── StoreDetail/         # Store detail modal components
│       ├── StoreModal.tsx   # Modal wrapper component
│       ├── StoreInfo.tsx    # Store information display
│       └── __tests__/       # Component-specific tests
├── lib/                     # Utility functions and services
│   ├── google-maps.ts       # Google Maps API integration
│   └── store-data.ts        # Store data fetching and processing
└── types/                   # TypeScript type definitions
    ├── index.ts             # Type exports barrel file
    ├── store.ts             # Store-related type definitions
    ├── map.ts               # Map-related type definitions
    └── __tests__/           # Type validation tests
```

### Public Assets (`public/`)
```
public/
├── data/
│   └── stores.json          # Store data (coordinates, info, images)
├── images/
│   └── stores/              # Store-specific image collections
│       ├── roushouki/       # Individual store image directories
│       ├── shikohroh/       # (exterior.jpg, butaman.jpg, etc.)
│       └── [store-id]/      # Each store has dedicated folder
├── icons/
│   └── butaman-marker.svg   # Custom map marker icon
└── [static-assets]          # Standard Next.js static assets
```

### Testing (`__tests__/` and component `__tests__/`)
```
__tests__/                   # Root-level integration tests
├── env.test.ts             # Environment configuration tests
├── google-maps.test.ts     # Google Maps integration tests
├── map-*.test.tsx          # Map component integration tests
├── store-*.test.ts         # Store data and logic tests
└── next-config.test.ts     # Build configuration tests

src/components/*/__tests__/  # Component-specific unit tests
src/types/__tests__/         # Type definition validation tests
```

## Code Organization Patterns

### Component Architecture
- **Container Components**: Handle state management and business logic (`MapWithStores.tsx`)
- **Presentation Components**: Focus on UI rendering (`StoreInfo.tsx`, `StoreMarker.tsx`)
- **Layout Components**: Provide structure and navigation (`layout.tsx`)
- **Modal Components**: Encapsulate overlay functionality (`StoreModal.tsx`)

### Data Flow Pattern
1. **Static Data**: Store information loaded from `public/data/stores.json`
2. **Client State**: React state for map interactions and modal display
3. **API Integration**: Google Maps API loaded asynchronously
4. **Type Safety**: All data flows through TypeScript interfaces

### Feature Organization
- **Map Features**: `src/components/Map*` + `src/lib/google-maps.ts`
- **Store Features**: `src/components/Store*` + `src/lib/store-data.ts` + `src/types/store.ts`
- **UI Features**: Tailwind CSS classes with responsive design patterns

## File Naming Conventions

### Components
- **PascalCase**: `MapContainer.tsx`, `StoreModal.tsx`
- **Descriptive Names**: Include domain context (`StoreMarker` not just `Marker`)
- **Feature Grouping**: Related components in subdirectories (`StoreDetail/`)

### Types
- **lowercase-kebab**: `store.ts`, `map.ts` for domain separation
- **Barrel Exports**: `index.ts` for clean import statements
- **Test Files**: `.test.ts` suffix in dedicated `__tests__/` directories

### Assets
- **kebab-case**: `butaman-marker.svg`, `exterior.jpg`
- **Organized by Feature**: Store images grouped by store ID
- **Descriptive**: File names indicate content (`exterior.jpg`, `butaman.jpg`)

## Import Organization

### Path Mapping
```typescript
// tsconfig.json path mapping enables clean imports
import { Store } from '@/types/store'
import { loadGoogleMapsAPI } from '@/lib/google-maps'
import MapContainer from '@/components/MapContainer'
```

### Import Hierarchy
1. **React/Next.js Imports**: Framework and hook imports first
2. **External Libraries**: Third-party package imports
3. **Internal Modules**: Local imports with `@/` prefix
4. **Type Imports**: TypeScript types (can use `type` keyword)
5. **Relative Imports**: Only for same-directory references

### Example Import Block
```typescript
import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { loadGoogleMapsAPI } from '@/lib/google-maps'
import { Store } from '@/types/store'
import StoreModal from '@/components/StoreDetail/StoreModal'
```

## Key Architectural Principles

### Static-First Architecture
- **Build-Time Data**: Store information embedded at build time
- **Client-Side Enhancement**: Map interactivity added progressively
- **Offline Capable**: Core content available without network

### Component Composition
- **Single Responsibility**: Each component has one clear purpose
- **Prop Drilling Avoidance**: State lifted to appropriate container level
- **Reusability**: Components designed for multiple use cases

### Type-Driven Development
- **Interface-First**: Define TypeScript interfaces before implementation
- **Strict Typing**: No `any` types, comprehensive type coverage
- **Runtime Safety**: Type guards and validation where needed

### Testing Strategy
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Component interaction and API integration
- **Type Tests**: Validate TypeScript type definitions
- **Coverage**: Focus on critical paths and business logic

### Performance Considerations
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Proper sizing and format selection
- **Bundle Size**: Monitor and optimize dependency usage
- **Static Generation**: Pre-build all possible pages