import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialLinksDisplay } from '../SocialLinksDisplay';
import { TextRecord } from '@/types/domain';

describe('SocialLinksDisplay', () => {
  it('should render social media links', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'testuser' },
      { key: 'com.github', value: 'testuser' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    expect(screen.getByText('Social Links')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should render nothing when no social records provided', () => {
    const textRecords: TextRecord[] = [
      { key: 'description', value: 'Not a social link' },
      { key: 'url', value: 'https://example.com' },
    ];

    const { container } = render(<SocialLinksDisplay textRecords={textRecords} />);

    expect(container.querySelector('.social-links-display')).toBeNull();
  });

  it('should create correct Twitter link', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'testuser' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://twitter.com/testuser');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should create correct GitHub link', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.github', value: 'testuser' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/testuser');
  });

  it('should create correct Telegram link', () => {
    const textRecords: TextRecord[] = [
      { key: 'org.telegram', value: 'testuser' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://t.me/testuser');
  });

  it('should create correct email link', () => {
    const textRecords: TextRecord[] = [
      { key: 'email', value: 'test@example.com' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('should render multiple social links', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'twitter_user' },
      { key: 'com.github', value: 'github_user' },
      { key: 'org.telegram', value: 'telegram_user' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    expect(screen.getByText('twitter_user')).toBeInTheDocument();
    expect(screen.getByText('github_user')).toBeInTheDocument();
    expect(screen.getByText('telegram_user')).toBeInTheDocument();
  });

  it('should filter out non-social records', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'testuser' },
      { key: 'description', value: 'Not displayed' },
      { key: 'com.github', value: 'testuser2' },
      { key: 'url', value: 'https://example.com' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('testuser2')).toBeInTheDocument();
    expect(screen.queryByText('Not displayed')).not.toBeInTheDocument();
    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'testuser' },
    ];

    const { container } = render(
      <SocialLinksDisplay textRecords={textRecords} className="custom-class" />
    );

    const wrapper = container.querySelector('.social-links-display');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should display platform name correctly', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'user1' },
      { key: 'com.github', value: 'user2' },
      { key: 'org.telegram', value: 'user3' },
    ];

    render(<SocialLinksDisplay textRecords={textRecords} />);

    expect(screen.getByText('twitter')).toBeInTheDocument();
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('telegram')).toBeInTheDocument();
  });
});
