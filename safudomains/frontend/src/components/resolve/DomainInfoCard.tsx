/**
 * Domain Info Card Component
 * Displays key information about a domain (owner, expiry, status)
 */
import { formatDistance } from 'date-fns';
import { FastForwardIcon } from '@heroicons/react/solid';

interface DomainInfoCardProps {
  name: string;
  owner: `0x${string}`;
  expiryDate: Date | null;
  isWrapped: boolean;
  isLifetime: boolean;
  className?: string;
}

export const DomainInfoCard: React.FC<DomainInfoCardProps> = ({
  name,
  owner,
  expiryDate,
  isWrapped,
  isLifetime,
  className = '',
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExpiryText = () => {
    if (isLifetime) {
      return (
        <span className="text-purple-600 font-semibold flex items-center gap-1">
          <span>♾️</span> Lifetime
        </span>
      );
    }

    if (!expiryDate) {
      return <span className="text-gray-500">Unknown</span>;
    }

    const now = new Date();
    const isExpired = expiryDate < now;

    if (isExpired) {
      return (
        <span className="text-red-600 font-semibold">
          Expired {formatDistance(expiryDate, now, { addSuffix: true })}
        </span>
      );
    }

    return (
      <span className="text-green-600">
        Expires {formatDistance(expiryDate, now, { addSuffix: true })}
      </span>
    );
  };

  return (
    <div className={`domain-info-card bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="space-y-4">
        {/* Domain Name */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 break-all">
            {name}
            <span className="text-blue-600">.safu</span>
          </h2>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {isWrapped && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              Wrapped
            </span>
          )}
          {isLifetime && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full flex items-center gap-1">
              <span>♾️</span> Lifetime
            </span>
          )}
        </div>

        {/* Owner */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Owner:</span>
            <a
              href={`https://bscscan.com/address/${owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-mono text-sm hover:underline"
            >
              {formatAddress(owner)}
            </a>
          </div>
        </div>

        {/* Expiry */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Expiry:</span>
          <div className="flex items-center gap-2">
            {!isLifetime && <FastForwardIcon className="w-4 h-4 text-gray-400" />}
            {getExpiryText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainInfoCard;
