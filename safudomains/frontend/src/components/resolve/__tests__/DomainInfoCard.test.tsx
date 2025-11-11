import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DomainInfoCard } from '../DomainInfoCard';

describe('DomainInfoCard', () => {
  const mockOwner = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`;

  it('should render domain name with .safu extension', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={false}
        isLifetime={false}
      />
    );

    expect(screen.getByText('testdomain')).toBeInTheDocument();
    expect(screen.getByText('.safu')).toBeInTheDocument();
  });

  it('should display owner address', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={false}
        isLifetime={false}
      />
    );

    expect(screen.getByText('Owner:')).toBeInTheDocument();
    expect(screen.getByText(/0x742d/)).toBeInTheDocument();
  });

  it('should show wrapped badge when domain is wrapped', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={true}
        isLifetime={false}
      />
    );

    expect(screen.getByText('Wrapped')).toBeInTheDocument();
  });

  it('should show lifetime badge when domain is lifetime', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={false}
        isLifetime={true}
      />
    );

    const lifetimeBadges = screen.getAllByText(/Lifetime/);
    expect(lifetimeBadges.length).toBeGreaterThan(0);
  });

  it('should display expiry date when provided', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={futureDate}
        isWrapped={false}
        isLifetime={false}
      />
    );

    expect(screen.getByText('Expiry:')).toBeInTheDocument();
    expect(screen.getByText(/Expires/)).toBeInTheDocument();
  });

  it('should show expired status for past dates', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);

    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={pastDate}
        isWrapped={false}
        isLifetime={false}
      />
    );

    expect(screen.getByText(/Expired/)).toBeInTheDocument();
  });

  it('should show lifetime status when isLifetime is true', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={false}
        isLifetime={true}
      />
    );

    expect(screen.getByText('Expiry:')).toBeInTheDocument();
    // Should show ♾️ emoji
    const lifetimeElements = screen.getAllByText(/♾️/);
    expect(lifetimeElements.length).toBeGreaterThan(0);
  });

  it('should show unknown expiry when no date provided and not lifetime', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={false}
        isLifetime={false}
      />
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('should create BSCScan link for owner address', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={false}
        isLifetime={false}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      `https://bscscan.com/address/${mockOwner}`
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={false}
        isLifetime={false}
        className="custom-class"
      />
    );

    const card = container.querySelector('.domain-info-card');
    expect(card).toHaveClass('custom-class');
  });

  it('should show both wrapped and lifetime badges when both are true', () => {
    render(
      <DomainInfoCard
        name="testdomain"
        owner={mockOwner}
        expiryDate={null}
        isWrapped={true}
        isLifetime={true}
      />
    );

    expect(screen.getByText('Wrapped')).toBeInTheDocument();
    const lifetimeBadges = screen.getAllByText(/Lifetime/);
    expect(lifetimeBadges.length).toBeGreaterThan(0);
  });
});
