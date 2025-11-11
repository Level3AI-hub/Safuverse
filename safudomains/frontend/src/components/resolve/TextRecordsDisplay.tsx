/**
 * Text Records Display Component
 * Shows all text records associated with a domain
 */
import { TextRecord } from '@/types/domain';

interface TextRecordsDisplayProps {
  textRecords: TextRecord[];
  className?: string;
}

const SOCIAL_KEYS = [
  'com.twitter',
  'com.github',
  'com.reddit',
  'org.telegram',
  'com.youtube',
  'email',
  'com.whatsapp',
  'com.snapchat',
];

export const TextRecordsDisplay: React.FC<TextRecordsDisplayProps> = ({
  textRecords,
  className = '',
}) => {
  // Filter out social records as they're displayed separately
  const otherRecords = textRecords.filter(
    (record) => !SOCIAL_KEYS.includes(record.key)
  );

  if (otherRecords.length === 0) {
    return (
      <div className={`text-records-display ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Text Records</h3>
        <div className="text-center py-8 text-gray-500">
          No additional text records configured
        </div>
      </div>
    );
  }

  const formatKey = (key: string) => {
    return key
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  return (
    <div className={`text-records-display ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Text Records</h3>
      <div className="space-y-3">
        {otherRecords.map((record, index) => (
          <div
            key={`${record.key}-${index}`}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="font-medium text-gray-700 text-sm">
                {formatKey(record.key)}
              </div>
              <div className="text-gray-900 break-all font-mono text-sm bg-gray-50 px-3 py-1 rounded">
                {record.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextRecordsDisplay;
