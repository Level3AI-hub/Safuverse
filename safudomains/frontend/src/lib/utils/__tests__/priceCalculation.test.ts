import { describe, it, expect } from 'vitest';
import {
  calculateTotalPrice,
  formatPrice,
  calculateDurationInSeconds,
  calculatePricePerYear,
  getLifetimeMultiplier,
  calculateLifetimePrice,
} from '../priceCalculation';

describe('priceCalculation', () => {
  describe('calculateTotalPrice', () => {
    it('should add base and premium prices', () => {
      expect(calculateTotalPrice(100n, 50n)).toBe(150n);
      expect(calculateTotalPrice(1000n, 0n)).toBe(1000n);
      expect(calculateTotalPrice(0n, 500n)).toBe(500n);
    });

    it('should handle large BigInt values', () => {
      const base = 1000000000000000000n; // 1 ETH in wei
      const premium = 500000000000000000n; // 0.5 ETH in wei
      expect(calculateTotalPrice(base, premium)).toBe(1500000000000000000n);
    });
  });

  describe('formatPrice', () => {
    it('should format wei to ETH with default decimals', () => {
      const oneEth = 1000000000000000000n;
      expect(formatPrice(oneEth)).toBe('1.0000');
    });

    it('should format with custom decimal places', () => {
      const oneEth = 1000000000000000000n;
      expect(formatPrice(oneEth, 2)).toBe('1.00');
      expect(formatPrice(oneEth, 6)).toBe('1.000000');
    });

    it('should handle fractional amounts', () => {
      const halfEth = 500000000000000000n;
      expect(formatPrice(halfEth, 4)).toBe('0.5000');

      const quarterEth = 250000000000000000n;
      expect(formatPrice(quarterEth, 4)).toBe('0.2500');
    });

    it('should handle small amounts', () => {
      const smallAmount = 1000000000000000n; // 0.001 ETH
      expect(formatPrice(smallAmount, 4)).toBe('0.0010');
    });
  });

  describe('calculateDurationInSeconds', () => {
    it('should calculate duration for 1 year', () => {
      const oneYear = 365 * 24 * 60 * 60;
      expect(calculateDurationInSeconds(1)).toBe(oneYear);
    });

    it('should calculate duration for multiple years', () => {
      const twoYears = 2 * 365 * 24 * 60 * 60;
      expect(calculateDurationInSeconds(2)).toBe(twoYears);

      const fiveYears = 5 * 365 * 24 * 60 * 60;
      expect(calculateDurationInSeconds(5)).toBe(fiveYears);
    });

    it('should handle fractional years', () => {
      const halfYear = 0.5 * 365 * 24 * 60 * 60;
      expect(calculateDurationInSeconds(0.5)).toBe(halfYear);
    });
  });

  describe('calculatePricePerYear', () => {
    it('should calculate price per year for 1 year duration', () => {
      const totalPrice = 1000n;
      const oneYear = 365 * 24 * 60 * 60;
      expect(calculatePricePerYear(totalPrice, oneYear)).toBe(1000n);
    });

    it('should calculate price per year for multi-year duration', () => {
      const totalPrice = 2000n;
      const twoYears = 2 * 365 * 24 * 60 * 60;
      expect(calculatePricePerYear(totalPrice, twoYears)).toBe(1000n);
    });

    it('should handle fractional results', () => {
      const totalPrice = 150n;
      const twoYears = 2 * 365 * 24 * 60 * 60;
      const pricePerYear = calculatePricePerYear(totalPrice, twoYears);
      expect(pricePerYear).toBe(75n);
    });
  });

  describe('getLifetimeMultiplier', () => {
    it('should return 100x for 2-character domains', () => {
      expect(getLifetimeMultiplier(2)).toBe(100);
    });

    it('should return 50x for 3-character domains', () => {
      expect(getLifetimeMultiplier(3)).toBe(50);
    });

    it('should return 25x for 4-character domains', () => {
      expect(getLifetimeMultiplier(4)).toBe(25);
    });

    it('should return 10x for 5+ character domains', () => {
      expect(getLifetimeMultiplier(5)).toBe(10);
      expect(getLifetimeMultiplier(6)).toBe(10);
      expect(getLifetimeMultiplier(10)).toBe(10);
      expect(getLifetimeMultiplier(100)).toBe(10);
    });
  });

  describe('calculateLifetimePrice', () => {
    it('should calculate lifetime price for 2-char domain', () => {
      const yearlyPrice = 100n;
      expect(calculateLifetimePrice(yearlyPrice, 2)).toBe(10000n); // 100 * 100
    });

    it('should calculate lifetime price for 3-char domain', () => {
      const yearlyPrice = 100n;
      expect(calculateLifetimePrice(yearlyPrice, 3)).toBe(5000n); // 100 * 50
    });

    it('should calculate lifetime price for 4-char domain', () => {
      const yearlyPrice = 100n;
      expect(calculateLifetimePrice(yearlyPrice, 4)).toBe(2500n); // 100 * 25
    });

    it('should calculate lifetime price for 5+ char domain', () => {
      const yearlyPrice = 100n;
      expect(calculateLifetimePrice(yearlyPrice, 5)).toBe(1000n); // 100 * 10
      expect(calculateLifetimePrice(yearlyPrice, 10)).toBe(1000n); // 100 * 10
    });

    it('should handle large prices', () => {
      const largeYearlyPrice = 1000000000000000000n; // 1 ETH
      expect(calculateLifetimePrice(largeYearlyPrice, 2)).toBe(
        100000000000000000000n
      ); // 100 ETH
    });
  });
});
