/**
 * Social Media Icon Mapping
 * Maps social platform keys to their corresponding React icons
 */
import { RiTelegramFill } from 'react-icons/ri';
import { FaXTwitter, FaYoutube, FaRedditAlien, FaSnapchatGhost, FaGithub } from 'react-icons/fa6';
import { IoMailSharp, IoLogoWhatsapp } from 'react-icons/io5';
import { SiBnbchain } from 'react-icons/si';

export type SocialIconKey =
  | 'com.twitter'
  | 'com.github'
  | 'com.reddit'
  | 'org.telegram'
  | 'com.youtube'
  | 'email'
  | 'com.whatsapp'
  | 'com.snapchat'
  | 'bnb';

export const socialIcons: Record<SocialIconKey, React.ComponentType<any>> = {
  'com.twitter': FaXTwitter,
  'com.github': FaGithub,
  'com.reddit': FaRedditAlien,
  'org.telegram': RiTelegramFill,
  'com.youtube': FaYoutube,
  'email': IoMailSharp,
  'com.whatsapp': IoLogoWhatsapp,
  'com.snapchat': FaSnapchatGhost,
  'bnb': SiBnbchain,
};

export const getSocialIcon = (key: string): React.ComponentType<any> | null => {
  return socialIcons[key as SocialIconKey] || null;
};

export const getSocialLink = (key: string, value: string): string | null => {
  switch (key) {
    case 'com.twitter':
      return `https://twitter.com/${value.replace('@', '')}`;
    case 'com.github':
      return `https://github.com/${value}`;
    case 'com.reddit':
      return `https://reddit.com/u/${value}`;
    case 'org.telegram':
      return `https://t.me/${value}`;
    case 'com.youtube':
      return `https://youtube.com/@${value}`;
    case 'email':
      return `mailto:${value}`;
    case 'com.whatsapp':
      return `https://wa.me/${value}`;
    case 'com.snapchat':
      return `https://snapchat.com/add/${value}`;
    default:
      return null;
  }
};
