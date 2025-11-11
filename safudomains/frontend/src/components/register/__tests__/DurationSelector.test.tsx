import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DurationSelector } from '../DurationSelector';

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

describe('DurationSelector', () => {
  it('should render all duration options', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={false}
        onLifetimeChange={mockOnLifetimeChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Lifetime Registration')).toBeInTheDocument();
  });

  it('should highlight the selected duration', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={2 * ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={false}
        onLifetimeChange={mockOnLifetimeChange}
      />
    );

    const twoYearButton = screen.getByText('2').closest('button');
    expect(twoYearButton).toHaveClass('border-blue-500');
  });

  it('should call onDurationChange when a year is selected', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={false}
        onLifetimeChange={mockOnLifetimeChange}
      />
    );

    const threeYearButton = screen.getByText('3').closest('button');
    fireEvent.click(threeYearButton!);

    expect(mockOnDurationChange).toHaveBeenCalledWith(3 * ONE_YEAR_IN_SECONDS);
    expect(mockOnLifetimeChange).toHaveBeenCalledWith(false);
  });

  it('should highlight lifetime when selected', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={1000 * ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={true}
        onLifetimeChange={mockOnLifetimeChange}
      />
    );

    const lifetimeButton = screen
      .getByText('Lifetime Registration')
      .closest('button');
    expect(lifetimeButton).toHaveClass('border-purple-500');
    expect(lifetimeButton).toHaveClass('bg-purple-50');
  });

  it('should toggle lifetime registration', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={false}
        onLifetimeChange={mockOnLifetimeChange}
      />
    );

    const lifetimeButton = screen
      .getByText('Lifetime Registration')
      .closest('button');
    fireEvent.click(lifetimeButton!);

    expect(mockOnLifetimeChange).toHaveBeenCalledWith(true);
    expect(mockOnDurationChange).toHaveBeenCalled();
  });

  it('should disable year options when lifetime is selected', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={1000 * ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={true}
        onLifetimeChange={mockOnLifetimeChange}
      />
    );

    const oneYearButton = screen.getByText('1').closest('button');
    expect(oneYearButton).toBeDisabled();
    expect(oneYearButton).toHaveClass('opacity-50');
  });

  it('should disable all options when disabled prop is true', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={false}
        onLifetimeChange={mockOnLifetimeChange}
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should apply custom className', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    const { container } = render(
      <DurationSelector
        duration={ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={false}
        onLifetimeChange={mockOnLifetimeChange}
        className="custom-class"
      />
    );

    const wrapper = container.querySelector('.duration-selector');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should show checkmark when lifetime is selected', () => {
    const mockOnDurationChange = vi.fn();
    const mockOnLifetimeChange = vi.fn();

    render(
      <DurationSelector
        duration={1000 * ONE_YEAR_IN_SECONDS}
        onDurationChange={mockOnDurationChange}
        isLifetime={true}
        onLifetimeChange={mockOnLifetimeChange}
      />
    );

    // Check for SVG checkmark
    const svg = screen
      .getByText('Lifetime Registration')
      .closest('button')
      ?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
