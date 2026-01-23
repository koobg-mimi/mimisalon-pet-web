import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks() // Clear all mock call history and implementations
})

// Mock Next.js router
beforeAll(() => {
  // Mock next/navigation
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
    redirect: vi.fn(),
  }))

  // Mock next/headers
  vi.mock('next/headers', () => ({
    headers: vi.fn(() => new Headers()),
    cookies: vi.fn(() => ({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      has: vi.fn(),
      getAll: vi.fn(() => []),
    })),
  }))

  // Mock environment variables for testing
  process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-vitest-testing-only'
  process.env.BETTER_AUTH_URL = 'http://localhost:3000'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.SKIP_ENV_VALIDATION = 'true'
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {}

  observe() {}

  takeRecords() {
    return []
  }

  unobserve() {}
} as unknown as typeof IntersectionObserver

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}

  disconnect() {}

  observe() {}

  unobserve() {}
} as unknown as typeof ResizeObserver
