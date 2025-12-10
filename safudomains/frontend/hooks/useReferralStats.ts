'use client';

import { useReadContract } from 'wagmi';
import { constants } from '../constant';

const REFERRAL_ABI = [
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nativeEarnings',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'codes',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function useReferralStats(address: `0x${string}` | undefined) {
  const { data: earnings, isLoading: earningsLoading } = useReadContract({
    address: constants.Referral,
    abi: REFERRAL_ABI,
    functionName: 'nativeEarnings',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: referralCode, isLoading: codeLoading } = useReadContract({
    address: constants.Referral,
    abi: REFERRAL_ABI,
    functionName: 'codes',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    earnings: earnings as bigint | undefined,
    referralCode: referralCode as string | undefined,
    isLoading: earningsLoading || codeLoading,
  };
}
