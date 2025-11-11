/**
 * REFACTORED resolve.tsx - Using Modular Components
 *
 * This file demonstrates how to refactor the large resolve.tsx (1201 lines)
 * to use the new modular components.
 *
 * Key Changes:
 * 1. Import ABIs from lib/abis
 * 2. Use DomainInfoCard, SocialLinksDisplay, and TextRecordsDisplay
 * 3. Simplify the component structure
 * 4. Extract inline UI into reusable components
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { keccak256, namehash, toBytes, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { useTextRecords } from '../hooks/getTextRecords';
import { useENSName } from '../hooks/getPrimaryName';
import { Switch } from '@headlessui/react';
import { useAccount } from 'wagmi';
import Update from './updateTextRecords';
import Renew from './renew';
import Unwrap from './unwrap';
import ChangeResolver from './changeResolver';
import Wrap from './wrap';
import { FastForwardIcon } from '@heroicons/react/solid';
import { Avatar } from './useAvatar';
import { constants } from '../constant';
import ReferralProgress from '@/components/Refferal';
import DomainImage from './DomainImage';

// ✅ Import modular components
import {
  DomainInfoCard,
  SocialLinksDisplay,
  TextRecordsDisplay,
} from './resolve';

// ✅ Import shared utilities
import { getSocialIcon, getSocialLink } from '@/lib/utils';

// ✅ Import ABIs from centralized location
import { REFERRAL_ABI, RESOLVE_ABI, AVAILABLE_ABI } from '@/lib/abis';

// Keep existing ABIs that haven't been extracted yet
const expiresAbi = [
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'nameExpires',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const getData = [
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'getData',
    outputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint32', name: 'fuses', type: 'uint32' },
      { internalType: 'uint64', name: 'expiry', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const isWrapped = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'isWrapped',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const Resolve = () => {
  const { label } = useParams<string>();
  const [expiry, setExpiry] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [tab, setTab] = useState('profile');
  const [isOpen, setIsOpen] = useState(false);
  const { address: walletAddress } = useAccount();

  const node = namehash(`${label}.safu`);
  const id = keccak256(label as any);

  // ✅ Fetch domain data
  const { data: available, isLoading: availableLoading } = useReadContract({
    address: constants.Controller,
    abi: AVAILABLE_ABI,
    functionName: 'available',
    args: [label as string],
  });

  const { data: wrapped } = useReadContract({
    abi: isWrapped,
    functionName: 'isWrapped',
    address: constants.NameWrapper,
    args: [node],
  });

  const { data: domainData, isLoading: domainLoading } = useReadContract({
    abi: getData,
    functionName: 'getData',
    address: constants.NameWrapper,
    args: [node],
  });

  const { data: expires, isLoading: expiryLoading } = useReadContract({
    abi: expiresAbi,
    functionName: 'nameExpires',
    address: constants.BaseRegistrar,
    args: [id],
  });

  // ✅ Use the hook for text records
  const { data: textRecords, isLoading: recordsLoading } = useTextRecords(
    label as string
  );

  // ✅ Calculate domain info for DomainInfoCard
  const domainInfo = useMemo(() => {
    if (!domainData || !expires) return null;

    const [owner, fuses, wrapperExpiry] = domainData as [
      `0x${string}`,
      number,
      bigint
    ];

    const expiryTimestamp = Number(expires);
    const expiryDate = new Date(expiryTimestamp * 1000);
    const isLifetime = expiryTimestamp === 31536000000; // Check for lifetime

    return {
      owner,
      expiryDate: isLifetime ? null : expiryDate,
      isWrapped: Boolean(wrapped),
      isLifetime,
    };
  }, [domainData, expires, wrapped]);

  // ✅ Format expiry display
  useEffect(() => {
    if (expires) {
      const timestamp = Number(expires);
      const date = new Date(timestamp * 1000);

      if (timestamp === 31536000000) {
        setExpiry('Lifetime');
        setExpiryTime('♾️ Forever');
      } else {
        setExpiry(date.toLocaleDateString());
        setExpiryTime(date.toLocaleTimeString());
      }
    }
  }, [expires]);

  // ✅ Show loading state
  if (availableLoading || domainLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB000] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading domain...</p>
        </div>
      </div>
    );
  }

  // ✅ Show available message if domain isn't registered
  if (available) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            {label}.safu is available!
          </h1>
          <p className="text-gray-400 mb-6">
            This domain hasn't been registered yet.
          </p>
          <a
            href={`/register/${label}`}
            className="inline-block px-6 py-3 bg-[#FFB000] text-neutral-900 font-semibold rounded-lg hover:bg-[#FFD000] transition"
          >
            Register Now
          </a>
        </div>
      </div>
    );
  }

  if (!domainInfo) return null;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ✅ NEW: Use DomainInfoCard component */}
        <div className="mb-8">
          <DomainInfoCard
            name={label as string}
            owner={domainInfo.owner}
            expiryDate={domainInfo.expiryDate}
            isWrapped={domainInfo.isWrapped}
            isLifetime={domainInfo.isLifetime}
          />
        </div>

        {/* Tabs */}
        <div className="bg-neutral-800 rounded-xl overflow-hidden mb-8">
          <div className="flex border-b border-neutral-700">
            <button
              onClick={() => setTab('profile')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                tab === 'profile'
                  ? 'bg-neutral-700 text-[#FFB000]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setTab('details')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                tab === 'details'
                  ? 'bg-neutral-700 text-[#FFB000]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setTab('manage')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                tab === 'manage'
                  ? 'bg-neutral-700 text-[#FFB000]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Manage
            </button>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {tab === 'profile' && (
              <div className="space-y-6">
                {/* Domain Image/Avatar */}
                <div className="flex justify-center">
                  <DomainImage label={label as string} />
                </div>

                {/* ✅ NEW: Use SocialLinksDisplay component */}
                {!recordsLoading && textRecords && textRecords.length > 0 && (
                  <SocialLinksDisplay textRecords={textRecords} />
                )}

                {/* ✅ NEW: Use TextRecordsDisplay component */}
                {!recordsLoading && (
                  <TextRecordsDisplay
                    textRecords={textRecords || []}
                  />
                )}

                {recordsLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB000] mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading records...</p>
                  </div>
                )}
              </div>
            )}

            {/* Details Tab */}
            {tab === 'details' && (
              <div className="space-y-4">
                <div className="bg-neutral-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Registration Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Registrant:</span>
                      <span className="font-mono">
                        {domainInfo.owner.slice(0, 6)}...
                        {domainInfo.owner.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expiry Date:</span>
                      <span>{expiry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expiry Time:</span>
                      <span>{expiryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-500">Active</span>
                    </div>
                  </div>
                </div>

                {/* Referral Progress */}
                {walletAddress && (
                  <ReferralProgress address={walletAddress} label={label} />
                )}
              </div>
            )}

            {/* Manage Tab */}
            {tab === 'manage' && (
              <div className="space-y-4">
                {walletAddress === domainInfo.owner ? (
                  <>
                    <Update label={label as string} />
                    <Renew label={label as string} />
                    {domainInfo.isWrapped ? (
                      <Unwrap label={label as string} />
                    ) : (
                      <Wrap label={label as string} />
                    )}
                    <ChangeResolver label={label as string} />
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Only the domain owner can manage this domain.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resolve;
