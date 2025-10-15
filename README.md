# Project Dayaw - Budget Transparency Dashboard

**Transparency in Every Peso** - Open governance and fiscal transparency platform for the Philippines.

Built for **PUP Technology Festival 2025 Hackathon** - "PUP Digital Bayanihan: Fostering a Smart Future Together"

By **GDHC - Great Developers Hacking Code**

---

## Overview

Project Dayaw is a comprehensive web platform designed to promote fiscal transparency and open governance in the Philippines. It provides citizens, journalists, and researchers with real-time access to government budget data, from planning through disbursement.

## Features

### 1. Educational Module
- Interactive timeline explaining the Philippine budget process
- Four main stages: NEP → GAB → GAA → Disbursement
- Bilingual content (English/Filipino)
- Key budget terms glossary

### 2. Budget Planning Progress Tracker
- Real-time agency progress monitoring
- Advanced filtering by region, sector, and year
- Progress visualization with color-coded stages
- Exportable data tables

### 3. Transparency Dashboard
- Interactive data visualizations using Recharts
- Multi-tab interface (Overview, By Region, By Agency)
- Sector distribution pie charts
- Monthly disbursement trend analysis
- Interactive regional map with clickable regions
- Budget utilization metrics

### 4. AI Chat Interface (Piso)
- AI-powered budget explainer
- Natural language Q&A about budget processes
- Suggested questions for easy exploration
- Bilingual support
- Floating button accessible from all pages

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Data Fetching**: SWR
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

\`\`\`
project-dayaw/
├── app/
│   ├── page.tsx              # Homepage
│   ├── education/            # Educational module
│   ├── tracker/              # Budget tracker
│   ├── dashboard/            # Data visualizations
│   ├── piso/                 # AI chat interface
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles & theme
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── charts/               # Chart components
│   ├── map/                  # Regional map
│   ├── chat/                 # Chat interface
│   ├── overview-card.tsx     # Stat cards
│   ├── stage-card.tsx        # Budget stage cards
│   ├── progress-table.tsx    # Agency progress table
│   ├── scroll-reveal.tsx     # Animation wrapper
│   └── floating-piso-button.tsx
├── hooks/
│   ├── use-budget-overview.ts
│   ├── use-agencies.ts
│   ├── use-chat.ts
│   ├── use-education.ts
│   └── use-regions.ts
└── context/
    └── language-context.tsx  # Bilingual support
\`\`\`

## Data Integration

All data hooks are **backend-ready** and expect the following API endpoints:

- `GET /api/overview` - Budget overview statistics
- `GET /api/agencies?region=&sector=&year=` - Agency list with filters
- `GET /api/education` - Educational content stages
- `GET /api/regions` - Regional budget data
- `GET /api/regions/:id` - Specific region details
- `POST /api/chat` - AI chat responses

### Example Hook Usage

\`\`\`typescript
import { useAgencies } from '@/hooks/use-agencies'

function MyComponent() {
  const { data, isLoading, error } = useAgencies({
    region: 'NCR',
    sector: 'Education',
    year: 2025
  })
  
  // data is automatically fetched and cached
}
\`\`\`

## Design System

### Color Palette
- **Primary**: Deep Blue `#1B365D` - Trust and authority
- **Accent**: Gold `#FFD166` - Highlights and CTAs
- **Background**: Dark blue-gray - Professional data focus
- **Text**: Near white with muted variants

### Typography
- **Headings**: Geist Sans (bold, tracking-tight)
- **Body**: Geist Sans (regular, leading-relaxed)
- **Data**: Geist Mono (for numbers and metrics)

### Components
All UI components use shadcn/ui with custom theming:
- Cards with subtle borders and hover effects
- Buttons with accent color and smooth transitions
- Tables with alternating row colors
- Charts with consistent color scheme

## Bilingual Support

The platform supports English and Filipino through the `LanguageContext`:

\`\`\`typescript
import { useLanguage } from '@/context/language-context'

function MyComponent() {
  const { language, setLanguage, t } = useLanguage()
  
  return (
    <h1>{t("Hello", "Kumusta")}</h1>
  )
}
\`\`\`

## Animations

Smooth animations powered by Framer Motion:
- Page transitions and scroll reveals
- Hover effects on cards and buttons
- Chart entrance animations
- Chat message animations
- Floating Piso button with periodic wiggle

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Backend Integration

To connect this frontend to a backend:

1. Implement the API routes listed in the Data Integration section
2. Ensure CORS is properly configured
3. Return data in the expected TypeScript interfaces (see hooks/)
4. Add authentication if needed (hooks support auth headers)

### Example API Response Format

\`\`\`json
// GET /api/overview
{
  "totalBudget": 2450000000000,
  "activeAgencies": 156,
  "ongoingProjects": 3420,
  "disbursementRate": 72.5
}

// GET /api/agencies
[
  {
    "id": "dep-ed-001",
    "name": "Department of Education",
    "stage": "Disbursement",
    "progress": 85,
    "region": "NCR",
    "sector": "Education",
    "lastUpdate": "2025-01-14",
    "budget": 685000000000
  }
]
\`\`\`

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast meets WCAG AA standards

## Performance

- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization
- SWR caching for API calls
- Lazy loading for charts and maps

## Future Enhancements

- [ ] Real-time data updates via WebSocket
- [ ] Advanced data export (CSV, PDF)
- [ ] User accounts and saved filters
- [ ] Mobile app version
- [ ] More detailed agency profiles
- [ ] Historical budget comparisons
- [ ] Public API for developers

## License

This project was created for the PUP Technology Festival 2025 Hackathon.

## Credits

**Team**: GDHC - Great Developers Hacking Code  
**Event**: PUP Technology Festival 2025 Hackathon  
**Theme**: "PUP Digital Bayanihan: Fostering a Smart Future Together"

---

**Project Dayaw** - Empowering Filipino citizens through budget transparency.
\`\`\`



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay13YWl0aW5nLXYxIiwiY3JlYXRlZEF0IjoxNzYwNDUzMzAwMzczLCJmaW5pc2hlZEF0IjoxNzYwNDUzMzAwMzczLCJpZCI6IkN3d1h1YW5zMThnTkhqWEUiLCJsYXN0UGFydFNlbnRBdCI6MTc2MDQ1MzMwMDM3MywicGFydHMiOlt7InR5cGUiOiJ0b29sLWNhbGxzIn1dfQ==" />



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay1tYW5hZ2UtdG9kb3MtdjEiLCJpZCI6IlRWbmVERFZMVk81SVB1UDkiLCJ0YXNrTmFtZUFjdGl2ZSI6IkNvbXBsZXRpbmcgcHJvamVjdCIsInRvb2xDYWxsSWQiOiJ0b29sdV8wMUVoS0RWcDFjZG1qWDhKd3BuWkF5QzkiLCJ0YXNrTmFtZUNvbXBsZXRlIjoiQ29tcGxldGVkIHByb2plY3QiLCJjcmVhdGVkQXQiOjE3NjA0NTMzMDA4NDgsImZpbmlzaGVkQXQiOm51bGwsInBhcnRzIjpbXSwibGFzdFBhcnRTZW50QXQiOm51bGx9" />
