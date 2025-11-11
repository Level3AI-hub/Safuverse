/**
 * Price Display Component
 * Shows domain registration price with breakdown
 */
import { formatPrice } from '@/lib/utils';
import { PaymentMethod } from '@/types/domain';

interface PriceDisplayProps {
  basePrice: bigint;
  premiumPrice: bigint;
  totalPrice: bigint;
  paymentMethod: PaymentMethod;
  isLifetime: boolean;
  duration: number; // in seconds
  isLoading?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  basePrice,
  premiumPrice,
  totalPrice,
  paymentMethod,
  isLifetime,
  duration,
  isLoading = false,
  className = '',
}) => {
  const durationInYears = duration / (365 * 24 * 60 * 60);

  if (isLoading) {
    return (
      <div className={`price-display animate-pulse ${className}`}>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={`price-display bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200 ${className}`}>
      <div className="space-y-3">
        {/* Total Price */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Total Price:</span>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {formatPrice(totalPrice)} {paymentMethod}
            </div>
            {!isLifetime && durationInYears > 1 && (
              <div className="text-sm text-gray-500">
                {formatPrice(totalPrice / BigInt(Math.floor(durationInYears)))} {paymentMethod}/year
              </div>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-3 border-t border-blue-200 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Base Price:</span>
            <span>{formatPrice(basePrice)} {paymentMethod}</span>
          </div>
          {premiumPrice > 0n && (
            <div className="flex justify-between text-gray-600">
              <span>Premium:</span>
              <span>{formatPrice(premiumPrice)} {paymentMethod}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Duration:</span>
            <span>
              {isLifetime ? 'Lifetime ♾️' : `${Math.floor(durationInYears)} ${durationInYears === 1 ? 'Year' : 'Years'}`}
            </span>
          </div>
        </div>

        {isLifetime && (
          <div className="mt-3 p-3 bg-purple-100 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Lifetime registration - Own this domain forever!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;
