import { beforeEach, vi } from "vitest";

// Mock js-cookie for tests
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock fetch for tests
global.fetch = vi.fn();

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.clearAllMocks();
});
