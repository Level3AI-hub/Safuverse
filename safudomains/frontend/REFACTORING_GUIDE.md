# Refactoring Guide: Using Modular Components

This guide shows how to refactor the large `register.tsx` and `resolve.tsx` files to use the new modular components.

## Overview

The original files are monolithic:
- **register.tsx**: 2,203 lines
- **resolve.tsx**: 1,201 lines

The modular architecture breaks these into reusable, testable components and utilities.

## Refactoring register.tsx

### Original Structure (Simplified)

```typescript
// register.tsx - 2203 lines
export default function Register() {
  // Massive component with:
  // - Payment method selection logic
  // - Duration selection logic
  // - Price calculation logic
  // - Form state management
  // - Contract interactions
  // - UI rendering

  return (
    <div>
      {/* Inline payment method UI */}
      {/* Inline duration selector UI */}
      {/* Inline price display UI */}
      {/* Registration form */}
    </div>
  );
}
```

### Refactored Structure

```typescript
// register.tsx - Now much smaller and focused
import {
  PaymentMethodSelector,
  DurationSelector,
  PriceDisplay,
} from './register';
import { PaymentMethod } from '@/types/domain';
import { calculateDurationInSeconds, formatPrice } from '@/lib/utils';
import { ERC20_ABI, CONTROLLER_ABI } from '@/lib/abis';

export default function Register() {
  // State management
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BNB');
  const [duration, setDuration] = useState(calculateDurationInSeconds(1));
  const [isLifetime, setIsLifetime] = useState(false);

  // Price calculation (using hooks/utilities)
  const { data: priceData, isLoading: isPriceLoading } = usePrice({
    domain: domainName,
    duration,
    paymentMethod,
    isLifetime,
  });

  // Contract interactions
  const { write: registerDomain } = useRegisterDomain({
    // ... registration logic
  });

  return (
    <div className="container mx-auto py-8">
      <h1>Register Domain</h1>

      {/* Modular Components */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={setPaymentMethod}
        disabled={isRegistering}
      />

      <DurationSelector
        duration={duration}
        onDurationChange={setDuration}
        isLifetime={isLifetime}
        onLifetimeChange={setIsLifetime}
        disabled={isRegistering}
      />

      <PriceDisplay
        basePrice={priceData?.base ?? 0n}
        premiumPrice={priceData?.premium ?? 0n}
        totalPrice={priceData?.total ?? 0n}
        paymentMethod={paymentMethod}
        isLifetime={isLifetime}
        duration={duration}
        isLoading={isPriceLoading}
      />

      {/* Registration button */}
      <button onClick={handleRegister}>
        Register Domain
      </button>
    </div>
  );
}
```

## Refactoring resolve.tsx

### Original Structure (Simplified)

```typescript
// resolve.tsx - 1201 lines
export default function Resolve() {
  // Massive component with:
  // - Domain info fetching
  // - Text records parsing
  // - Social links rendering
  // - Domain management actions
  // - All UI inline

  return (
    <div>
      {/* Inline domain info display */}
      {/* Inline social links */}
      {/* Inline text records */}
      {/* Management actions */}
    </div>
  );
}
```

### Refactored Structure

```typescript
// resolve.tsx - Now much smaller and focused
import {
  DomainInfoCard,
  SocialLinksDisplay,
  TextRecordsDisplay,
} from './resolve';
import { useTextRecords } from '@/hooks/getTextRecords';
import { useDomainInfo } from '@/hooks/getDomainInfo';

export default function Resolve() {
  const { domain } = useParams();

  // Data fetching
  const { data: domainInfo, isLoading: isDomainLoading } = useDomainInfo(domain);
  const { data: textRecords, isLoading: isRecordsLoading } = useTextRecords(domain);

  if (isDomainLoading) return <LoadingSpinner />;
  if (!domainInfo) return <NotFound />;

  return (
    <div className="container mx-auto py-8">
      {/* Modular Components */}
      <DomainInfoCard
        name={domain}
        owner={domainInfo.owner}
        expiryDate={domainInfo.expiryDate}
        isWrapped={domainInfo.isWrapped}
        isLifetime={domainInfo.isLifetime}
      />

      {!isRecordsLoading && (
        <>
          <SocialLinksDisplay textRecords={textRecords ?? []} />
          <TextRecordsDisplay textRecords={textRecords ?? []} />
        </>
      )}

      {/* Domain management actions */}
      <DomainActions domain={domain} owner={domainInfo.owner} />
    </div>
  );
}
```

## Step-by-Step Refactoring Process

### Step 1: Identify Extractable Components

Look for distinct UI sections that can become components:

```typescript
// Before
<div className="payment-selection">
  <button onClick={() => setMethod('BNB')}>BNB</button>
  <button onClick={() => setMethod('CAKE')}>CAKE</button>
  <button onClick={() => setMethod('USD1')}>USD1</button>
</div>

// After
<PaymentMethodSelector
  selectedMethod={paymentMethod}
  onMethodChange={setPaymentMethod}
/>
```

### Step 2: Extract Utility Functions

Move reusable logic to utility modules:

```typescript
// Before - inline in component
const formatPrice = (wei: bigint) => {
  return (Number(wei) / 1e18).toFixed(4);
};

// After - in lib/utils/priceCalculation.ts
import { formatPrice } from '@/lib/utils';
```

### Step 3: Move ABIs to Separate Files

```typescript
// Before - inline in component
const ERC20_ABI = [ /* ... */ ];
const CONTROLLER_ABI = [ /* ... */ ];

// After - in lib/abis/
import { ERC20_ABI, CONTROLLER_ABI } from '@/lib/abis';
```

### Step 4: Create Type Definitions

```typescript
// Before - inline or missing types
const registerParams = {
  domain: 'test',
  duration: 31536000,
  // ...
};

// After - using shared types
import { RegisterParams, PaymentMethod } from '@/types/domain';

const registerParams: RegisterParams = {
  domain: 'test',
  duration: 31536000,
  // ...
};
```

### Step 5: Extract Components One by One

Refactor incrementally to avoid breaking changes:

1. **Week 1**: Extract PaymentMethodSelector
2. **Week 2**: Extract DurationSelector
3. **Week 3**: Extract PriceDisplay
4. **Week 4**: Test and integrate

### Step 6: Write Tests

As you extract components, write tests:

```typescript
// PaymentMethodSelector.test.tsx
describe('PaymentMethodSelector', () => {
  it('should render all payment methods', () => {
    render(<PaymentMethodSelector selectedMethod="BNB" onMethodChange={vi.fn()} />);
    expect(screen.getByText('BNB')).toBeInTheDocument();
  });
});
```

## Example: Complete Registration Flow

Here's a complete example showing the refactored registration flow:

```typescript
// register.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract } from 'wagmi';
import {
  PaymentMethodSelector,
  DurationSelector,
  PriceDisplay,
} from './register';
import { PaymentMethod, RegisterParams } from '@/types/domain';
import {
  calculateDurationInSeconds,
  isValidDomainName,
  getDomainValidationError,
} from '@/lib/utils';
import { ERC20_ABI, CONTROLLER_ABI } from '@/lib/abis';
import { constants } from '@/constant';

export default function Register() {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const { address } = useAccount();

  // Validate domain
  const domainError = getDomainValidationError(domain ?? '');
  if (domainError) {
    return <div className="error">{domainError}</div>;
  }

  // State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BNB');
  const [duration, setDuration] = useState(calculateDurationInSeconds(1));
  const [isLifetime, setIsLifetime] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Hooks for price fetching
  const { data: priceData, isLoading: isPriceLoading } = useReadContract({
    address: constants.CONTROLLER_ADDRESS,
    abi: CONTROLLER_ABI,
    functionName: paymentMethod === 'BNB' ? 'rentPrice' : 'rentPriceToken',
    args: paymentMethod === 'BNB'
      ? [domain, duration, isLifetime]
      : [domain, duration, paymentMethod, isLifetime],
  });

  // Contract write hook
  const { writeAsync: registerDomain } = useWriteContract();

  // Calculate total price
  const basePrice = priceData?.base ?? 0n;
  const premiumPrice = priceData?.premium ?? 0n;
  const totalPrice = basePrice + premiumPrice;

  // Handle registration
  const handleRegister = async () => {
    if (!address) return;

    setIsRegistering(true);
    try {
      // 1. Approve token if needed
      if (paymentMethod !== 'BNB') {
        await approveToken();
      }

      // 2. Register domain
      const params: RegisterParams = {
        domain: domain!,
        duration,
        resolver: constants.RESOLVER_ADDRESS,
        data: [],
        reverseRecord: true,
        ownerControlledFuses: 0,
        lifetime: isLifetime,
        referree: getReferrer(),
      };

      await registerDomain({
        address: constants.CONTROLLER_ADDRESS,
        abi: CONTROLLER_ABI,
        functionName: paymentMethod === 'BNB' ? 'register' : 'registerWithToken',
        args: buildRegisterArgs(params, paymentMethod),
        value: paymentMethod === 'BNB' ? totalPrice : 0n,
      });

      // 3. Navigate to domain page
      navigate(`/${domain}.safu`);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">
        Register {domain}.safu
      </h1>

      <div className="space-y-6">
        {/* Payment Method */}
        <div className="card">
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
            disabled={isRegistering}
          />
        </div>

        {/* Duration */}
        <div className="card">
          <DurationSelector
            duration={duration}
            onDurationChange={setDuration}
            isLifetime={isLifetime}
            onLifetimeChange={setIsLifetime}
            disabled={isRegistering}
          />
        </div>

        {/* Price */}
        <div className="card">
          <PriceDisplay
            basePrice={basePrice}
            premiumPrice={premiumPrice}
            totalPrice={totalPrice}
            paymentMethod={paymentMethod}
            isLifetime={isLifetime}
            duration={duration}
            isLoading={isPriceLoading}
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={isRegistering || isPriceLoading || !address}
          className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isRegistering ? 'Registering...' : `Register ${domain}.safu`}
        </button>
      </div>
    </div>
  );
}
```

## Benefits of Refactored Code

### 1. **Easier to Read**
- Components are small and focused
- Clear separation of concerns
- Self-documenting through component names

### 2. **Easier to Test**
- Small components are unit-testable
- Utilities can be tested independently
- Mock dependencies are simpler

### 3. **Easier to Maintain**
- Changes are localized to specific files
- Bugs are easier to isolate
- New features can be added incrementally

### 4. **Reusable**
- Components can be used in different contexts
- Utilities are shared across the app
- Less code duplication

### 5. **Type-Safe**
- Shared TypeScript types ensure consistency
- Catch errors at compile time
- Better IDE support

## Migration Checklist

- [ ] Set up testing infrastructure
- [ ] Extract utility functions to `lib/utils/`
- [ ] Move ABIs to `lib/abis/`
- [ ] Create shared types in `types/`
- [ ] Extract PaymentMethodSelector component
- [ ] Extract DurationSelector component
- [ ] Extract PriceDisplay component
- [ ] Extract DomainInfoCard component
- [ ] Extract SocialLinksDisplay component
- [ ] Extract TextRecordsDisplay component
- [ ] Write unit tests for all modules
- [ ] Refactor register.tsx to use new components
- [ ] Refactor resolve.tsx to use new components
- [ ] Update documentation
- [ ] Run full test suite
- [ ] Deploy and monitor

## Conclusion

The modular architecture makes the codebase:
- ✅ More maintainable
- ✅ More testable
- ✅ More reusable
- ✅ More scalable
- ✅ Easier to onboard new developers

Start refactoring incrementally, one component at a time, and you'll see immediate benefits!
