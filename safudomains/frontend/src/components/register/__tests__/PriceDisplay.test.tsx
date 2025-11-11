import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from '../PriceDisplay';

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

describe('PriceDisplay', () => {
  it('should render total price', () => {
    render(
      <PriceDisplay
        basePrice={1000000000000000000n} // 1 token
        premiumPrice={0n}
        totalPrice={1000000000000000000n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.getByText(/1\.0000/)).toBeInTheDocument();
    expect(screen.getByText(/BNB/)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    const { container } = render(
      <PriceDisplay
        basePrice={0n}
        premiumPrice={0n}
        totalPrice={0n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
        isLoading={true}
      />
    );

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should display base price breakdown', () => {
    render(
      <PriceDisplay
        basePrice={1000000000000000000n}
        premiumPrice={0n}
        totalPrice={1000000000000000000n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.getByText('Base Price:')).toBeInTheDocument();
  });

  it('should display premium price when greater than 0', () => {
    render(
      <PriceDisplay
        basePrice={1000000000000000000n}
        premiumPrice={500000000000000000n}
        totalPrice={1500000000000000000n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.getByText('Premium:')).toBeInTheDocument();
  });

  it('should not display premium when 0', () => {
    render(
      <PriceDisplay
        basePrice={1000000000000000000n}
        premiumPrice={0n}
        totalPrice={1000000000000000000n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.queryByText('Premium:')).not.toBeInTheDocument();
  });

  it('should show lifetime indicator when isLifetime is true', () => {
    render(
      <PriceDisplay
        basePrice={10000000000000000000n}
        premiumPrice={0n}
        totalPrice={10000000000000000000n}
        paymentMethod="BNB"
        isLifetime={true}
        duration={1000 * ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.getByText(/Lifetime/)).toBeInTheDocument();
    expect(screen.getByText(/♾️/)).toBeInTheDocument();
  });

  it('should show duration in years for non-lifetime', () => {
    render(
      <PriceDisplay
        basePrice={2000000000000000000n}
        premiumPrice={0n}
        totalPrice={2000000000000000000n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={2 * ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.getByText('2 Years')).toBeInTheDocument();
  });

  it('should show price per year for multi-year durations', () => {
    render(
      <PriceDisplay
        basePrice={3000000000000000000n}
        premiumPrice={0n}
        totalPrice={3000000000000000000n}
        paymentMethod="CAKE"
        isLifetime={false}
        duration={3 * ONE_YEAR_IN_SECONDS}
      />
    );

    // Should show yearly rate
    expect(screen.getByText(/CAKE\/year/)).toBeInTheDocument();
  });

  it('should handle different payment methods', () => {
    const { rerender } = render(
      <PriceDisplay
        basePrice={1000000000000000000n}
        premiumPrice={0n}
        totalPrice={1000000000000000000n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.getAllByText(/BNB/).length).toBeGreaterThan(0);

    rerender(
      <PriceDisplay
        basePrice={1000000000000000000n}
        premiumPrice={0n}
        totalPrice={1000000000000000000n}
        paymentMethod="USD1"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
      />
    );

    expect(screen.getAllByText(/USD1/).length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <PriceDisplay
        basePrice={1000000000000000000n}
        premiumPrice={0n}
        totalPrice={1000000000000000000n}
        paymentMethod="BNB"
        isLifetime={false}
        duration={ONE_YEAR_IN_SECONDS}
        className="custom-class"
      />
    );

    const wrapper = container.querySelector('.price-display');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should show lifetime registration message', () => {
    render(
      <PriceDisplay
        basePrice={10000000000000000000n}
        premiumPrice={0n}
        totalPrice={10000000000000000000n}
        paymentMethod="BNB"
        isLifetime={true}
        duration={1000 * ONE_YEAR_IN_SECONDS}
      />
    );

    expect(
      screen.getByText(/Lifetime registration - Own this domain forever!/)
    ).toBeInTheDocument();
  });
});
