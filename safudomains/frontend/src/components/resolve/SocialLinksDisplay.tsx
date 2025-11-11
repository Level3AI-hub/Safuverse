/**
 * Social Links Display Component
 * Shows social media links and contact information from text records
 */
import { getSocialIcon, getSocialLink } from '@/lib/utils';
import { TextRecord } from '@/types/domain';

interface SocialLinksDisplayProps {
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

export const SocialLinksDisplay: React.FC<SocialLinksDisplayProps> = ({
  textRecords,
  className = '',
}) => {
  const socialRecords = textRecords.filter((record) =>
    SOCIAL_KEYS.includes(record.key)
  );

  if (socialRecords.length === 0) {
    return null;
  }

  return (
    <div className={`social-links-display ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {socialRecords.map((record) => {
          const Icon = getSocialIcon(record.key);
          const link = getSocialLink(record.key, record.value);

          if (!Icon || !link) return null;

          return (
            <a
              key={record.key}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
            >
              <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 capitalize">
                  {record.key.replace('com.', '').replace('org.', '')}
                </div>
                <div className="text-sm font-medium text-gray-800 truncate">
                  {record.value}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinksDisplay;
