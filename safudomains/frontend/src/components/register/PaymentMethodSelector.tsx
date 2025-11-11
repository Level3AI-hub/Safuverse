/**
 * Payment Method Selector Component
 * Allows users to choose their preferred payment token for domain registration
 */
import { useMemo } from 'react';
import { PaymentMethod } from '@/types/domain';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  className?: string;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon?: string }[] = [
  { value: 'BNB', label: 'BNB', icon: '💎' },
  { value: 'CAKE', label: 'CAKE', icon: '🥞' },
  { value: 'USD1', label: 'USD1', icon: '💵' },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`payment-method-selector ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Payment Method
      </label>
      <div className="grid grid-cols-3 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.value}
            type="button"
            onClick={() => onMethodChange(method.value)}
            disabled={disabled}
            className={`
              px-4 py-3 rounded-lg border-2 transition-all duration-200
              flex items-center justify-center gap-2
              ${
                selectedMethod === method.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {method.icon && <span className="text-xl">{method.icon}</span>}
            <span className="font-semibold">{method.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
