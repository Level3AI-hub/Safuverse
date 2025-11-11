/**
 * REFACTORED register.tsx - Using Modular Components
 *
 * This file demonstrates how to refactor the large register.tsx (2203 lines)
 * to use the new modular components.
 *
 * Key Changes:
 * 1. Import ABIs from lib/abis instead of inline definitions
 * 2. Import utility functions from lib/utils
 * 3. Use PaymentMethodSelector, DurationSelector, and PriceDisplay components
 * 4. Extract repeated logic into utility functions
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { Check } from 'lucide-react';
import { intervalToDuration, startOfDay } from 'date-fns';
import { useAccount } from 'wagmi';
import { useWriteContract, useReadContract } from 'wagmi';
import {
  bytesToHex,
  encodeFunctionData,
  namehash,
  encodeAbiParameters,
  keccak256,
  toBytes,
  parseEther,
  zeroAddress,
} from 'viem';
import { useParams, useNavigate } from 'react-router';
import Countdown from 'react-countdown';
import Modal from 'react-modal';
import { buildTextRecords } from '../hooks/setText';
import { useEstimateENSFees, useEthersSigner } from '../hooks/gasEstimation';
import { ethers } from 'ethers';
import { constants, Params } from '../constant';
import UserForm from './userForm';
import { FaPlus } from 'react-icons/fa6';
import { useENSName } from '../hooks/getPrimaryName';
import { normalize } from 'viem/ens';

// ✅ Import modular components
import {
  PaymentMethodSelector,
  DurationSelector,
  PriceDisplay,
} from './register';

// ✅ Import shared types
import { PaymentMethod, RegisterParams } from '@/types/domain';

// ✅ Import utilities
import {
  calculateDurationInSeconds,
  isValidDomainName,
  getDomainValidationError,
  formatPrice,
} from '@/lib/utils';

// ✅ Import ABIs from centralized location
import { ERC20_ABI, CONTROLLER_ABI } from '@/lib/abis';

// Keep existing ABI definitions that aren't extracted yet
const addrResolver = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'node', type: 'bytes32' },
      { internalType: 'address', name: 'a', type: 'address' },
    ],
    name: 'setAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// ... (keep other ABIs that haven't been extracted)

const Register = () => {
  const signer = useEthersSigner();
  const navigate = useNavigate();
  const { label } = useParams<string>();

  // ✅ NEW: Use PaymentMethod type instead of multiple booleans
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BNB');
  const [useToken, setUseToken] = useState(false);
  const [token, setToken] = useState<`0x${string}`>('0x');

  // ✅ NEW: Use duration in seconds with utility function
  const [duration, setDuration] = useState(calculateDurationInSeconds(1));
  const [isLifetime, setIsLifetime] = useState(false);

  const now = useMemo(() => new Date(), []);
  const { address, isDisconnected } = useAccount();
  const { name: myName } = useENSName({ owner: address as `0x${string}` });
  const [isPrimary, setIsPrimary] = useState(myName ? false : true);

  const [isLoading, setIsLoading] = useState(false);
  const [next, setNext] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const { data: commithash, writeContractAsync } = useWriteContract();
  const { writeContractAsync: approve } = useWriteContract();

  const {
    data: registerhash,
    error: registerError,
    isPending: registerPending,
    writeContractAsync: registerContract,
  } = useWriteContract();

  const [owner, setOwner] = useState(
    address || ('0x0000000000000000000000000000000000000000' as `0x${string}`)
  );

  // Profile fields
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [discord, setDiscord] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [referrer, setReferrer] = useState('');

  // ✅ IMPROVED: Fetch prices based on payment method
  const { data: bnbPriceData, isPending: bnbLoading } = useReadContract({
    address: constants.Controller,
    abi: CONTROLLER_ABI,
    functionName: 'rentPrice',
    args: [label as string, duration, isLifetime],
    query: {
      enabled: paymentMethod === 'BNB',
    },
  });

  const { data: tokenPriceData, isPending: tokenLoading } = useReadContract({
    address: constants.Controller,
    abi: CONTROLLER_ABI,
    functionName: 'rentPriceToken',
    args: [
      label as string,
      duration,
      paymentMethod.toLowerCase(),
      isLifetime,
    ],
    query: {
      enabled: paymentMethod !== 'BNB',
    },
  });

  // ✅ IMPROVED: Calculate prices using utility functions
  const priceData = useMemo(() => {
    const data = paymentMethod === 'BNB' ? bnbPriceData : tokenPriceData;
    if (!data) return { base: 0n, premium: 0n, total: 0n };

    const { base, premium } = data as { base: bigint; premium: bigint };
    return {
      base,
      premium,
      total: base + premium,
    };
  }, [bnbPriceData, tokenPriceData, paymentMethod]);

  const isPriceLoading = bnbLoading || tokenLoading;

  // ✅ Load referrer from localStorage
  useEffect(() => {
    const ref = localStorage.getItem('000000000x000000x00000x0x0000000');
    if (ref) {
      setReferrer(normalize(ref));
    }
  }, []);

  // ✅ Update duration when lifetime changes
  useEffect(() => {
    if (isLifetime) {
      setDuration(calculateDurationInSeconds(1000)); // 1000 years for lifetime
    }
  }, [isLifetime]);

  // ... (keep existing commit/register logic)

  const buildCommitData = () => {
    const textRecords = [
      { key: 'description', value: description },
      { key: 'avatar', value: avatar },
      { key: 'com.twitter', value: twitter },
      { key: 'com.github', value: github },
      { key: 'com.discord', value: discord },
      { key: 'email', value: email },
      { key: 'url', value: website },
      { key: 'phone', value: phone },
    ];

    const validTextRecords = textRecords.filter(
      (r) => r.key.trim() !== '' && r.value.trim() !== ''
    );

    const builtData = buildTextRecords(
      validTextRecords,
      namehash(`${label as string}.safu`)
    );

    const addrEncoded = encodeFunctionData({
      abi: addrResolver,
      functionName: 'setAddr',
      args: [namehash(`${label}.safu`), owner],
    });

    return [...builtData, addrEncoded];
  };

  // ... (keep existing registration logic)

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">
          Register <span className="text-[#FFB000]">{label}.safu</span>
        </h1>

        <div className="space-y-6 mt-8">
          {/* ✅ NEW: Use PaymentMethodSelector component */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={(method) => {
                setPaymentMethod(method);
                setUseToken(method !== 'BNB');
                if (method === 'CAKE') {
                  setToken(constants.CAKE_TOKEN as `0x${string}`);
                } else if (method === 'USD1') {
                  setToken(constants.USD1_TOKEN as `0x${string}`);
                }
              }}
              disabled={isLoading}
            />
          </div>

          {/* ✅ NEW: Use DurationSelector component */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Registration Duration</h2>
            <DurationSelector
              duration={duration}
              onDurationChange={setDuration}
              isLifetime={isLifetime}
              onLifetimeChange={setIsLifetime}
              disabled={isLoading}
            />
          </div>

          {/* ✅ NEW: Use PriceDisplay component */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Registration Cost</h2>
            <PriceDisplay
              basePrice={priceData.base}
              premiumPrice={priceData.premium}
              totalPrice={priceData.total}
              paymentMethod={paymentMethod}
              isLifetime={isLifetime}
              duration={duration}
              isLoading={isPriceLoading}
            />
          </div>

          {/* Profile Information Section - Keep existing UI */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Owner Address
                </label>
                <input
                  value={owner}
                  onChange={(e) => setOwner(e.target.value as `0x${string}`)}
                  placeholder="0x..."
                  className="w-full p-3 bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB000]"
                />
              </div>

              {/* Keep existing profile fields */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Avatar URL
                </label>
                <input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 bg-neutral-700 rounded-lg focus:outline-none"
                />
              </div>

              {/* ... (keep other profile fields) */}
            </div>
          </div>

          {/* Registration Button */}
          <button
            onClick={() => {
              // Handle registration
              buildCommitData();
              // ... registration logic
            }}
            disabled={isLoading || isPriceLoading}
            className="w-full py-4 px-6 bg-[#FFB000] text-neutral-900 rounded-lg font-bold text-lg hover:bg-[#FFD000] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Processing...' : `Register ${label}.safu`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
