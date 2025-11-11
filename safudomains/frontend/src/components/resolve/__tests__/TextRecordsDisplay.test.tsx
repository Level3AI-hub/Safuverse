import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextRecordsDisplay } from '../TextRecordsDisplay';
import { TextRecord } from '@/types/domain';

describe('TextRecordsDisplay', () => {
  it('should render text records', () => {
    const textRecords: TextRecord[] = [
      { key: 'description', value: 'My cool domain' },
      { key: 'url', value: 'https://example.com' },
    ];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    expect(screen.getByText('Text Records')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('My cool domain')).toBeInTheDocument();
    expect(screen.getByText('Url')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('should show message when no records available', () => {
    const textRecords: TextRecord[] = [];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    expect(screen.getByText('Text Records')).toBeInTheDocument();
    expect(
      screen.getByText('No additional text records configured')
    ).toBeInTheDocument();
  });

  it('should filter out social media records', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'twitter_user' },
      { key: 'description', value: 'My description' },
      { key: 'com.github', value: 'github_user' },
      { key: 'url', value: 'https://example.com' },
    ];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    // Social records should not be displayed
    expect(screen.queryByText('twitter_user')).not.toBeInTheDocument();
    expect(screen.queryByText('github_user')).not.toBeInTheDocument();

    // Non-social records should be displayed
    expect(screen.getByText('My description')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('should format keys with dots properly', () => {
    const textRecords: TextRecord[] = [
      { key: 'custom.field.name', value: 'Value' },
    ];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    // Should capitalize each part
    expect(screen.getByText('Custom Field Name')).toBeInTheDocument();
  });

  it('should format single word keys', () => {
    const textRecords: TextRecord[] = [
      { key: 'description', value: 'My description' },
      { key: 'avatar', value: 'ipfs://...' },
    ];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Avatar')).toBeInTheDocument();
  });

  it('should handle long values', () => {
    const longValue = 'a'.repeat(100);
    const textRecords: TextRecord[] = [{ key: 'longfield', value: longValue }];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    expect(screen.getByText(longValue)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const textRecords: TextRecord[] = [
      { key: 'description', value: 'Test' },
    ];

    const { container } = render(
      <TextRecordsDisplay textRecords={textRecords} className="custom-class" />
    );

    const wrapper = container.querySelector('.text-records-display');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should render multiple records in order', () => {
    const textRecords: TextRecord[] = [
      { key: 'field1', value: 'value1' },
      { key: 'field2', value: 'value2' },
      { key: 'field3', value: 'value3' },
    ];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    const values = screen.getAllByText(/value[123]/);
    expect(values).toHaveLength(3);
    expect(values[0]).toHaveTextContent('value1');
    expect(values[1]).toHaveTextContent('value2');
    expect(values[2]).toHaveTextContent('value3');
  });

  it('should show empty state when only social records exist', () => {
    const textRecords: TextRecord[] = [
      { key: 'com.twitter', value: 'user' },
      { key: 'com.github', value: 'user' },
      { key: 'email', value: 'user@example.com' },
    ];

    render(<TextRecordsDisplay textRecords={textRecords} />);

    expect(
      screen.getByText('No additional text records configured')
    ).toBeInTheDocument();
  });
});
