import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../Navbar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock Safety Provider store
vi.mock('@/lib/store', () => ({
  useSafety: () => ({
    currentRole: 'student',
    setRole: vi.fn(),
    currentUser: { id: 'usr-1', name: 'Aarav Sharma', email: 'aarav@mmumullana.org', role: 'student' },
    activeAlertCount: 2,
    signOut: vi.fn(),
    isAuthenticated: true,
  }),
}));

describe('Navbar Component Accessibility & Navigation Tests', () => {
  it('renders brand logo and main navigation landmark with aria-label', () => {
    render(<Navbar />);
    expect(screen.getByText('Guardian')).toBeInTheDocument();

    const mainNav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(mainNav).toBeInTheDocument();
  });

  it('marks active link with aria-current="page"', () => {
    render(<Navbar />);
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders role context button with aria-haspopup and aria-expanded', () => {
    render(<Navbar />);
    const roleBtn = screen.getByRole('button', { name: /switch role context/i });
    expect(roleBtn).toBeInTheDocument();
    expect(roleBtn).toHaveAttribute('aria-haspopup', 'menu');
    expect(roleBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(roleBtn);
    expect(roleBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu', { name: /role choices/i })).toBeInTheDocument();
  });
});
