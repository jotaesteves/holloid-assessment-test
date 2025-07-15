import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils/test-utils';
import { ThemeToggle } from '../ThemeToggle';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock window.matchMedia
const matchMediaMock = vi.fn();

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    // Reset DOM
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders theme toggle button', () => {
    matchMediaMock.mockReturnValue({ matches: false });
    localStorageMock.getItem.mockReturnValue(null);

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toBeInTheDocument();
  });

  it('starts with light mode when no saved preference and system prefers light', () => {
    matchMediaMock.mockReturnValue({ matches: false });
    localStorageMock.getItem.mockReturnValue(null);

    render(<ThemeToggle />);

    // Should show moon icon (indicating light mode)
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('starts with dark mode when no saved preference and system prefers dark', () => {
    matchMediaMock.mockReturnValue({ matches: true });
    localStorageMock.getItem.mockReturnValue(null);

    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('respects saved preference from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles from light to dark mode when clicked', () => {
    matchMediaMock.mockReturnValue({ matches: false });
    localStorageMock.getItem.mockReturnValue(null);

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });

    // Initial state should be light
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Click to toggle to dark
    fireEvent.click(button);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('chakra-ui-color-mode', 'dark');
  });

  it('toggles from dark to light mode when clicked', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });

    // Initial state should be dark
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click to toggle to light
    fireEvent.click(button);

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('chakra-ui-color-mode', 'light');
  });

  it('sets correct CSS variables for light mode', () => {
    matchMediaMock.mockReturnValue({ matches: false });
    localStorageMock.getItem.mockReturnValue(null);

    render(<ThemeToggle />);

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--chakra-colors-bg')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--chakra-colors-text')).toBe('#1a202c');
    expect(root.style.getPropertyValue('--chakra-colors-card-bg')).toBe('rgba(255, 255, 255, 0.8)');
  });

  it('sets correct CSS variables for dark mode', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(<ThemeToggle />);

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--chakra-colors-bg')).toBe('#1a202c');
    expect(root.style.getPropertyValue('--chakra-colors-text')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--chakra-colors-card-bg')).toBe('#2d3748');
  });

  it('removes previous theme class when toggling', () => {
    localStorageMock.getItem.mockReturnValue('light');

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });

    // Should start with light class
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark
    fireEvent.click(button);

    // Should now have dark class and not light class
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('has correct accessibility attributes', () => {
    matchMediaMock.mockReturnValue({ matches: false });
    localStorageMock.getItem.mockReturnValue(null);

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toHaveAttribute('aria-label', 'Toggle color mode');
  });
});
