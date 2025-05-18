# Law Practice App

A modern web application built with Next.js, TypeScript, and Tailwind CSS for managing law practice operations.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd law-practice-app
```

2. Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=your_api_url_here
```

Replace `your_api_url_here` with your actual API URL.

## Development

To run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Features

- Modern UI components using Radix UI
- Form handling with React Hook Form and Zod validation
- Data visualization with Recharts
- State management with React Query
- Responsive design with Tailwind CSS
- Type safety with TypeScript

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Query
- React Hook Form
- Zod

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
law-practice-app/
├── app/              # Next.js app directory
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── public/          # Static assets
└── styles/          # Global styles
```
