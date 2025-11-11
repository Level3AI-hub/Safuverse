import { describe, it, expect } from 'vitest';
import { getSocialIcon, getSocialLink } from '../socialIcons';

describe('socialIcons', () => {
  describe('getSocialIcon', () => {
    it('should return icon component for valid social platforms', () => {
      expect(getSocialIcon('com.twitter')).toBeTruthy();
      expect(getSocialIcon('com.github')).toBeTruthy();
      expect(getSocialIcon('com.reddit')).toBeTruthy();
      expect(getSocialIcon('org.telegram')).toBeTruthy();
      expect(getSocialIcon('com.youtube')).toBeTruthy();
      expect(getSocialIcon('email')).toBeTruthy();
      expect(getSocialIcon('com.whatsapp')).toBeTruthy();
      expect(getSocialIcon('com.snapchat')).toBeTruthy();
    });

    it('should return null for invalid platforms', () => {
      expect(getSocialIcon('invalid.platform')).toBeNull();
      expect(getSocialIcon('com.invalid')).toBeNull();
      expect(getSocialIcon('')).toBeNull();
    });
  });

  describe('getSocialLink', () => {
    describe('Twitter links', () => {
      it('should generate correct Twitter link', () => {
        expect(getSocialLink('com.twitter', 'username')).toBe(
          'https://twitter.com/username'
        );
      });

      it('should handle @ symbol in username', () => {
        expect(getSocialLink('com.twitter', '@username')).toBe(
          'https://twitter.com/username'
        );
      });
    });

    describe('GitHub links', () => {
      it('should generate correct GitHub link', () => {
        expect(getSocialLink('com.github', 'username')).toBe(
          'https://github.com/username'
        );
      });
    });

    describe('Reddit links', () => {
      it('should generate correct Reddit link', () => {
        expect(getSocialLink('com.reddit', 'username')).toBe(
          'https://reddit.com/u/username'
        );
      });
    });

    describe('Telegram links', () => {
      it('should generate correct Telegram link', () => {
        expect(getSocialLink('org.telegram', 'username')).toBe(
          'https://t.me/username'
        );
      });
    });

    describe('YouTube links', () => {
      it('should generate correct YouTube link', () => {
        expect(getSocialLink('com.youtube', 'channelname')).toBe(
          'https://youtube.com/@channelname'
        );
      });
    });

    describe('Email links', () => {
      it('should generate correct mailto link', () => {
        expect(getSocialLink('email', 'user@example.com')).toBe(
          'mailto:user@example.com'
        );
      });
    });

    describe('WhatsApp links', () => {
      it('should generate correct WhatsApp link', () => {
        expect(getSocialLink('com.whatsapp', '1234567890')).toBe(
          'https://wa.me/1234567890'
        );
      });
    });

    describe('Snapchat links', () => {
      it('should generate correct Snapchat link', () => {
        expect(getSocialLink('com.snapchat', 'username')).toBe(
          'https://snapchat.com/add/username'
        );
      });
    });

    describe('Invalid platforms', () => {
      it('should return null for invalid platforms', () => {
        expect(getSocialLink('invalid.platform', 'username')).toBeNull();
        expect(getSocialLink('com.invalid', 'username')).toBeNull();
        expect(getSocialLink('', 'username')).toBeNull();
      });
    });
  });
});
