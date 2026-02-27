# Nevada Senior Bar Crawl - Sales Rep Portal

## Overview

This is a Next.js web application for managing sales representatives for the Nevada Senior Bar Crawl. The app provides:

- Application form for new reps
- Individual dashboards for tracking sales and commissions
- Public leaderboard showing top performers
- Integration with Supabase for data storage
- Webhooks to n8n for automation

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **CAPTCHA:** Cloudflare Turnstile

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with your credentials (see `.env.local.example` for required variables).

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL script in `supabase/schema.sql` in your Supabase SQL editor
3. This will create all required tables, views, and RLS policies

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Key Features

### Landing Page (`/`)
- Marketing content explaining the program
- Application form for new reps
- Cloudflare Turnstile for bot protection

### Rep Dashboard (`/dashboard/[handle]`)
- Personal sales statistics
- Commission tracking
- Bonus progress tracker
- Referral link with copy functionality
- Recent sales history

### Leaderboard (`/leaderboard`)
- Public ranking of all reps by points
- Top 3 highlighted with podium design
- Shows shirts sold, tickets sold, points, and commissions

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Domain Configuration

Set up custom domain `reps.nevadaseniorbarcrawl.com` in Vercel.
