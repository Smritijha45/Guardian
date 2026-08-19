import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../button';

describe('Button Component Accessibility & Functionality Tests', () => {
  it('renders button with children and default type="button"', () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('handles click events when not disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit Report</Button>);
    const btn = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button and prevents click when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Action</Button>);
    const btn = screen.getByRole('button', { name: /disabled action/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders icon with aria-hidden="true"', () => {
    render(
      <Button icon={<span data-testid="test-icon">Icon</span>}>
        With Icon
      </Button>
    );
    const iconContainer = screen.getByTestId('test-icon').parentElement;
    expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports custom button types like submit', () => {
    render(<Button type="submit">Form Submit</Button>);
    const btn = screen.getByRole('button', { name: /form submit/i });
    expect(btn).toHaveAttribute('type', 'submit');
  });
});
