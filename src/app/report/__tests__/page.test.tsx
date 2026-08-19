import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReportPage from '../page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/report',
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams('category=hazard'),
}));

// Mock dynamic leaflet map component
vi.mock('@/components/map/SafetyMapComponent', () => ({
  default: () => <div data-testid="mock-map">Interactive Safety Map Mock</div>,
}));

// Mock Toast provider
vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Mock Safety Context Provider
const mockAddReport = vi.fn().mockResolvedValue({ id: 'REP-TEST-101' });

vi.mock('@/lib/store', () => ({
  useSafety: () => ({
    addReport: mockAddReport,
    reports: [],
    currentUser: { id: 'usr-1', name: 'Test Student', email: 'test@mmumullana.org', role: 'student' },
    currentRole: 'student',
  }),
}));

describe('Report Issue Page Accessibility & Form Tests', () => {
  it('renders all form input fields with explicit labels and ids', () => {
    render(<ReportPage />);

    expect(screen.getByLabelText(/report title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/detailed description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select campus landmark/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/submit anonymously/i)).toBeInTheDocument();
  });

  it('allows selecting category option buttons with aria-pressed state update', () => {
    render(<ReportPage />);

    const lightingCategoryBtn = screen.getByRole('button', { name: /lighting outage/i });
    expect(lightingCategoryBtn).toBeInTheDocument();

    fireEvent.click(lightingCategoryBtn);
    expect(lightingCategoryBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('submits form when required fields are filled out', async () => {
    render(<ReportPage />);

    const titleInput = screen.getByLabelText(/report title/i);
    const descInput = screen.getByLabelText(/detailed description/i);

    fireEvent.change(titleInput, { target: { value: 'Test Lighting Outage' } });
    fireEvent.change(descInput, { target: { value: 'Streetlight is unlit near Hostel complex' } });

    const submitBtn = screen.getByRole('button', { name: /submit incident report/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockAddReport).toHaveBeenCalledTimes(1);
    });
  });
});
