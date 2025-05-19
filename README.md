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

## Testing

The application uses Vitest and React Testing Library for testing. Tests are located alongside the components they test in `__tests__` directories.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

Tests are organized following these conventions:

- Test files are named `*.test.tsx` or `*.test.ts`
- Tests are placed in `__tests__` directories next to the components they test
- Each test file focuses on a single component or feature

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

describe("ComponentName", () => {
  it("should render correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Component Testing**

   - Test component rendering
   - Test user interactions
   - Test error states
   - Test loading states

2. **Mocking**

   - Use `vi.mock()` for mocking dependencies
   - Mock API calls using `vi.fn()`
   - Mock React Query hooks when needed

3. **Async Testing**

   - Use `waitFor` for asynchronous operations
   - Test loading and error states
   - Verify API calls and responses

4. **Form Testing**
   - Test form validation
   - Test form submission
   - Test error handling
   - Test success scenarios

### Common Testing Patterns

```typescript
// Mocking API calls
vi.mock("@/lib/api", () => ({
  api: {
    getData: vi.fn(),
  },
}));

// Testing async operations
await waitFor(() => {
  expect(screen.getByText("Data Loaded")).toBeInTheDocument();
});

// Testing user interactions
fireEvent.click(screen.getByRole("button", { name: /submit/i }));
```

### Coverage

The project aims to maintain high test coverage. Run `pnpm test:coverage` to generate a coverage report and identify areas that need more testing.
