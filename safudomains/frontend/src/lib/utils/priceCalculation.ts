/**
 * Price Calculation Utilities
 * Functions for calculating domain registration prices
 */
import { formatEther } from 'viem';

/**
 * Calculate total price from base and premium
 * @param base - Base price in wei
 * @param premium - Premium price in wei
 * @returns Total price in wei
 */
export const calculateTotalPrice = (base: bigint, premium: bigint): bigint => {
  return base + premium;
};

/**
 * Format price for display
 * @param priceInWei - Price in wei
 * @param decimals - Number of decimals to show
 * @returns Formatted price string
 */
export const formatPrice = (priceInWei: bigint, decimals: number = 4): string => {
  const ethValue = formatEther(priceInWei);
  return parseFloat(ethValue).toFixed(decimals);
};

/**
 * Calculate duration in seconds
 * @param years - Number of years
 * @returns Duration in seconds
 */
export const calculateDurationInSeconds = (years: number): number => {
  return years * 365 * 24 * 60 * 60;
};

/**
 * Calculate price per year
 * @param totalPrice - Total price in wei
 * @param duration - Duration in seconds
 * @returns Price per year in wei
 */
export const calculatePricePerYear = (totalPrice: bigint, duration: number): bigint => {
  const durationInYears = duration / (365 * 24 * 60 * 60);
  return BigInt(Math.floor(Number(totalPrice) / durationInYears));
};

/**
 * Get lifetime price multiplier based on domain length
 * @param domainLength - Length of domain name
 * @returns Multiplier for lifetime registration
 */
export const getLifetimeMultiplier = (domainLength: number): number => {
  if (domainLength === 2) return 100; // 100x for 2 char
  if (domainLength === 3) return 50;  // 50x for 3 char
  if (domainLength === 4) return 25;  // 25x for 4 char
  return 10; // 10x for 5+ char
};

/**
 * Calculate lifetime registration price
 * @param yearlyPrice - Yearly price in wei
 * @param domainLength - Length of domain name
 * @returns Lifetime price in wei
 */
export const calculateLifetimePrice = (yearlyPrice: bigint, domainLength: number): bigint => {
  const multiplier = getLifetimeMultiplier(domainLength);
  return yearlyPrice * BigInt(multiplier);
};
