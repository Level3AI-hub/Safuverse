import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentMethodSelector } from '../PaymentMethodSelector';
import { PaymentMethod } from '@/types/domain';

describe('PaymentMethodSelector', () => {
  it('should render all payment method options', () => {
    const mockOnChange = vi.fn();
    render(
      <PaymentMethodSelector
        selectedMethod="BNB"
        onMethodChange={mockOnChange}
      />
    );

    expect(screen.getByText('BNB')).toBeInTheDocument();
    expect(screen.getByText('CAKE')).toBeInTheDocument();
    expect(screen.getByText('USD1')).toBeInTheDocument();
  });

  it('should highlight the selected method', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <PaymentMethodSelector
        selectedMethod="CAKE"
        onMethodChange={mockOnChange}
      />
    );

    const cakeButton = screen.getByText('CAKE').closest('button');
    expect(cakeButton).toHaveClass('border-blue-500');
    expect(cakeButton).toHaveClass('bg-blue-50');
  });

  it('should call onMethodChange when a method is clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <PaymentMethodSelector
        selectedMethod="BNB"
        onMethodChange={mockOnChange}
      />
    );

    const cakeButton = screen.getByText('CAKE').closest('button');
    fireEvent.click(cakeButton!);

    expect(mockOnChange).toHaveBeenCalledWith('CAKE');
  });

  it('should disable all buttons when disabled prop is true', () => {
    const mockOnChange = vi.fn();
    render(
      <PaymentMethodSelector
        selectedMethod="BNB"
        onMethodChange={mockOnChange}
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should not call onMethodChange when disabled', () => {
    const mockOnChange = vi.fn();
    render(
      <PaymentMethodSelector
        selectedMethod="BNB"
        onMethodChange={mockOnChange}
        disabled={true}
      />
    );

    const cakeButton = screen.getByText('CAKE').closest('button');
    fireEvent.click(cakeButton!);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <PaymentMethodSelector
        selectedMethod="BNB"
        onMethodChange={mockOnChange}
        className="custom-class"
      />
    );

    const wrapper = container.querySelector('.payment-method-selector');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should handle all payment method types', () => {
    const mockOnChange = vi.fn();
    const methods: PaymentMethod[] = ['BNB', 'CAKE', 'USD1'];

    methods.forEach((method) => {
      const { unmount } = render(
        <PaymentMethodSelector
          selectedMethod={method}
          onMethodChange={mockOnChange}
        />
      );

      const button = screen.getByText(method).closest('button');
      expect(button).toHaveClass('border-blue-500');

      unmount();
    });
  });
});
