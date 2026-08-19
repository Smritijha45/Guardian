import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminDashboardPage from '../page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock Toast provider
vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const mockUpdateStatus = vi.fn().mockResolvedValue(true);
const mockDeleteReport = vi.fn().mockResolvedValue(true);
const mockSetRole = vi.fn();

let mockRole: 'student' | 'admin' = 'admin';

vi.mock('@/lib/store', () => ({
  useSafety: () => ({
    currentRole: mockRole,
    setRole: mockSetRole,
    reports: [
      {
        id: 'REP-101',
        title: 'Broken Staircase',
        category: 'hazard',
        description: 'Dangerous cracked step near MMEC building',
        latitude: 30.2520,
        longitude: 77.0474,
        status: 'reported',
        severity: 'high',
        location_name: 'MMEC Engineering Block, MMDU',
        created_at: '2026-08-19T10:00:00Z',
        updated_at: '2026-08-19T10:00:00Z',
      },
    ],
    updateReportStatus: mockUpdateStatus,
    deleteReport: mockDeleteReport,
  }),
}));

describe('Admin Dashboard Page Access Control & Accessibility Tests', () => {
  it('renders admin console and incident table when role is admin', () => {
    mockRole = 'admin';
    render(<AdminDashboardPage />);

    expect(screen.getByText(/campus admin response console/i)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /campus incident reports list/i })).toBeInTheDocument();
    expect(screen.getByText('REP-101')).toBeInTheDocument();
  });

  it('renders search input and dropdown filters with accessible labels', () => {
    mockRole = 'admin';
    render(<AdminDashboardPage />);

    expect(screen.getByLabelText(/search incidents by id or location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
  });

  it('opens response modal when Respond & Action button is clicked', () => {
    mockRole = 'admin';
    render(<AdminDashboardPage />);

    const actionBtn = screen.getByRole('button', { name: /respond and action incident rep-101/i });
    expect(actionBtn).toBeInTheDocument();

    fireEvent.click(actionBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/assign action/i)).toBeInTheDocument();
  });
});
