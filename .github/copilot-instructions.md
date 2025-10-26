# AI Agent Instructions for M6O4 Solutions Web Project

This guide helps AI coding agents understand the key patterns and workflows of this Next.js + Payload CMS project.

## Project Architecture

- **Frontend**: Next.js 14 app router with TypeScript and Shadcn UI components
- **CMS**: Payload CMS with MongoDB backend and Cloudflare R2 storage
- **Key Directories**:
  - `/src/app/(web)` - Public website routes and components
  - `/src/app/(payload)` - Admin panel and CMS API routes
  - `/src/payload/collections` - CMS content models and fields
  - `/src/components/ui` - Reusable UI components built with Shadcn

## Development Workflow

```bash
# Install dependencies
pnpm install

# Start development server with Turbopack
pnpm dev

# Generate Payload types after schema changes
pnpm generate:types

# Update CMS import map
pnpm generate:importmap
```

## Key Patterns

### Content Model Structure

- Each collection is defined in `/src/payload/collections/[name]/schema.ts`
- Common fields are abstracted in `/src/payload/fields/`
- Follow existing patterns for adding new fields and relationships

### Component Conventions

- UI components use the Shadcn architecture with Radix primitives
- Components are function components with TypeScript types
- Theme customization happens in `components.json` and `css-variables.js`

### Data Flow

- CMS data is fetched server-side in page components
- Live Preview is enabled for supported content types
- Authentication flows through `/src/app/(auth)` routes
- Admin customization lives in `/src/app/(payload)/admin`

### Environment Variables

Essential variables needed for development:

- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - CMS encryption key
- `NEXT_PUBLIC_SERVER_URL` - Backend API URL
- `RESEND_API_KEY` - For email functionality

### Common Tasks

1. Adding a new collection:
   - Create schema in `/src/payload/collections/[name]/schema.ts`
   - Add to collections array in `/src/payload/collections/index.ts`
   - Generate types with `pnpm generate:types`

2. Creating new pages:
   - Add route in `/src/app/(web)/[route]/page.tsx`
   - Include metadata exports for SEO
   - Use server components by default

## Integration Points

- PayloadCMS plugins configured in `payload.config.ts`
- Cloudflare R2 storage setup in media collection
- Resend email provider in `/src/payload/fields/resend.ts`
- SEO metadata generation in `/src/payload/utilities/generate-meta.ts`
