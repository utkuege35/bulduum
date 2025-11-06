# Bulduum - Service Marketplace Platform

## Overview

Bulduum is a Turkish-language marketplace platform that connects service providers with customers across multiple categories including education, home services, care services, and handmade products. The platform facilitates trust-based connections through verified profiles, real-time messaging, and review systems.

**Core Value Proposition**: A localized, trust-centered marketplace that makes finding and connecting with service providers effortless through clarity, professionalism, and human-centered design.

**Tech Stack**:
- Frontend: React + TypeScript with Vite
- Backend: Express.js (Node.js)
- Database: PostgreSQL (via Neon serverless)
- ORM: Drizzle
- UI Framework: Shadcn/ui with Tailwind CSS
- Authentication: Replit Auth (OpenID Connect)
- State Management: TanStack Query (React Query)
- Routing: Wouter

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

**Monorepo Organization**:
- `/client` - React frontend application
- `/server` - Express backend API
- `/shared` - Shared TypeScript schemas and types
- `/migrations` - Database migration files

**Rationale**: Collocated frontend and backend code enables type sharing and unified deployment while maintaining clear separation of concerns.

### Frontend Architecture

**Component Strategy**:
- Shadcn/ui component library with customized theme (New York style)
- Design system based on marketplace platforms (Airbnb, TaskRabbit, Fiverr)
- Responsive-first approach with mobile breakpoint at 768px
- Component structure: reusable UI components in `/components/ui`, feature components in `/components`

**State Management**:
- TanStack Query for server state with aggressive caching (`staleTime: Infinity`)
- React hooks for local component state
- Custom `useAuth` hook for authentication state
- Query invalidation on mutations for optimistic UI updates

**Routing**:
- Client-side routing via Wouter (lightweight alternative to React Router)
- Key routes: Home (`/`), Categories, Providers, Profile Setup, Messages, Provider Profiles
- Authentication-aware navigation patterns

**Design System**:
- Custom Tailwind configuration with HSL-based color tokens
- CSS custom properties for themeable components
- Typography: Inter font family (Google Fonts)
- Spacing based on Tailwind's 4px grid system
- Elevation system with `hover-elevate` and `active-elevate-2` utilities

**Alternatives Considered**: 
- Next.js was considered but rejected in favor of simpler Vite setup for this use case
- React Router vs Wouter: Wouter chosen for bundle size (~1.2KB)

### Backend Architecture

**API Design**:
- RESTful API with resource-based endpoints
- Express middleware chain: JSON parsing, request logging, authentication
- Credential-based session authentication (cookies)
- Request/response logging with truncation for readability

**Key Endpoints**:
- `/api/auth/*` - Authentication flows (login, logout, user info)
- `/api/profile` - Profile CRUD operations
- `/api/categories` - Category and subcategory listing
- `/api/providers` - Provider search and filtering
- `/api/messages` - Messaging system
- `/api/reviews` - Review submission and retrieval

**Authentication Flow**:
- Replit Auth (OpenID Connect) for identity provider
- Session-based authentication with PostgreSQL session store
- `isAuthenticated` middleware guard for protected routes
- Token refresh mechanism using `updateUserSession`

**Alternatives Considered**:
- JWT authentication was considered but session-based chosen for better security defaults and Replit platform integration

### Data Layer

**Database Schema**:
- PostgreSQL via Neon serverless driver with WebSocket support
- Connection pooling for performance
- Tables: `users`, `profiles`, `categories`, `subcategories`, `messages`, `reviews`, `sessions`

**ORM Strategy**:
- Drizzle ORM for type-safe database access
- Schema defined in `/shared/schema.ts` for type sharing
- Zod integration via `drizzle-zod` for runtime validation
- Schema-first approach with migrations in `/migrations`

**Key Schema Decisions**:
- `profiles` table separated from `users` for flexible user types (provider/customer)
- Category hierarchy: categories → subcategories for organized service browsing
- Review ratings stored as integers (1-5 scale)
- Message threading by sender/receiver pairs
- Soft verification via `isVerified` boolean flag

**Data Access Patterns**:
- Storage abstraction layer (`/server/storage.ts`) implementing `IStorage` interface
- Eager loading of relationships using Drizzle joins
- Query optimization through selective field retrieval

**Pros**: Type safety from database to client, excellent TypeScript integration
**Cons**: Migration tooling less mature than Prisma

### Session Management

**Implementation**:
- `connect-pg-simple` for PostgreSQL-backed session storage
- 7-day session TTL with sliding expiration
- Secure cookie configuration (httpOnly, secure, maxAge)
- Session table with automatic cleanup via TTL

**Rationale**: Database-backed sessions provide persistence across server restarts and enable horizontal scaling.

## External Dependencies

### Infrastructure Services

**Neon Database**:
- Serverless PostgreSQL database
- WebSocket connection support for real-time capabilities
- Configuration via `DATABASE_URL` environment variable
- Connection pooling via `@neondatabase/serverless` package

**Replit Platform**:
- Integrated authentication provider (OpenID Connect)
- Development tooling: Cartographer, dev banner, runtime error modal
- Environment detection via `REPL_ID` variable

### Third-Party Libraries

**UI Components**:
- Radix UI primitives (30+ packages) for accessible, unstyled components
- Lucide React for iconography
- Class Variance Authority (CVA) for component variants
- Date-fns with Turkish locale for date formatting

**Form Management**:
- React Hook Form for performant form handling
- Zod for schema validation
- `@hookform/resolvers` for Zod integration

**Development Tools**:
- Vite for fast development builds and HMR
- ESBuild for production bundling
- TypeScript with strict mode enabled
- Path aliases (`@/`, `@shared/`, `@assets/`) for clean imports

### Assets

**Image Management**:
- Generated images stored in `/attached_assets/generated_images/`
- Logo and brand assets in `/attached_assets/`
- Vite asset import resolution via `@assets` alias

### Build and Deployment

**Development Mode**:
- `npm run dev` - Runs Vite dev server with HMR and Express backend
- Environment: `NODE_ENV=development`
- TypeScript checking via `npm run check`

**Production Build**:
- Frontend: Vite build to `/dist/public`
- Backend: ESBuild bundle to `/dist/index.js` (ESM format)
- Database migrations: `npm run db:push` (Drizzle Kit)

**Environment Variables**:
- `DATABASE_URL` - PostgreSQL connection string (required)
- `SESSION_SECRET` - Session encryption key (required)
- `ISSUER_URL` - OpenID Connect issuer (defaults to Replit)
- `REPL_ID` - Replit environment identifier

**Deployment Strategy**: Single-command build creates production bundle with static assets and server code ready for Node.js execution.