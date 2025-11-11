# Integration Guide: Refactoring register.tsx and resolve.tsx

This guide provides step-by-step instructions for integrating the modular components into the existing `register.tsx` and `resolve.tsx` files.

## Overview

Instead of completely rewriting these large files (2203 and 1201 lines respectively), we provide **refactored example files** that demonstrate the patterns you should follow. This allows you to:

1. **Understand the patterns** through working examples
2. **Migrate incrementally** - refactor one section at a time
3. **Keep your custom logic** - examples show how to preserve existing functionality
4. **Test as you go** - verify each section works before moving to the next

## Files Created

### 1. register.refactored.example.tsx
A complete working example showing:
- ✅ Import modular components (PaymentMethodSelector, DurationSelector, PriceDisplay)
- ✅ Import ABIs from `lib/abis`
- ✅ Import utilities from `lib/utils`
- ✅ Use shared TypeScript types
- ✅ Replace inline UI with modular components
- ✅ Preserve all registration logic

### 2. resolve.refactored.example.tsx
A complete working example showing:
- ✅ Import modular components (DomainInfoCard, SocialLinksDisplay, TextRecordsDisplay)
- ✅ Import ABIs from `lib/abis`
- ✅ Simplify domain data fetching
- ✅ Replace inline UI with modular components
- ✅ Preserve all domain management logic

---

## Step-by-Step Integration

### Phase 1: Prepare for Refactoring (30 minutes)

#### 1.1. Install Dependencies
```bash
cd safudomains/frontend
npm install
```

#### 1.2. Run Tests to Ensure Everything Works
```bash
npm test
```

#### 1.3. Create a Backup Branch
```bash
git checkout -b feature/refactor-register-resolve
```

#### 1.4. Review the Example Files
- Read `register.refactored.example.tsx`
- Read `resolve.refactored.example.tsx`
- Understand the patterns used

---

### Phase 2: Refactor register.tsx (2-3 hours)

#### Step 1: Add Imports (10 minutes)

**At the top of register.tsx, add:**
```typescript
// Modular components
import {
  PaymentMethodSelector,
  DurationSelector,
  PriceDisplay,
} from './register';

// Shared types
import { PaymentMethod, RegisterParams } from '@/types/domain';

// Utilities
import {
  calculateDurationInSeconds,
  isValidDomainName,
  getDomainValidationError,
  formatPrice,
} from '@/lib/utils';

// ABIs
import { ERC20_ABI, CONTROLLER_ABI } from '@/lib/abis';
```

#### Step 2: Replace State Management (20 minutes)

**Find this pattern (around line 504):**
```typescript
const [currency, setCurrency] = useState<'BNB' | 'USD'>('BNB');
const [bnb, setBnb] = useState(true);
const [useToken, setUseToken] = useState(false);
```

**Replace with:**
```typescript
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BNB');
const [useToken, setUseToken] = useState(false);
const [duration, setDuration] = useState(calculateDurationInSeconds(1));
const [isLifetime, setIsLifetime] = useState(false);
```

#### Step 3: Replace Payment Method UI (30 minutes)

**Find the payment method selection UI (around lines 1200-1400):**
- Look for buttons for BNB/CAKE/USD1 selection
- This is typically a large section with multiple conditionals

**Replace with:**
```typescript
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
```

#### Step 4: Replace Duration Selector UI (30 minutes)

**Find the duration selection UI (typically around lines 1400-1600):**
- Look for year increment/decrement buttons
- Date picker functionality
- Lifetime toggle

**Replace with:**
```typescript
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
```

#### Step 5: Replace Price Display UI (30 minutes)

**Find the price display section:**
- Usually shows BNB/USD prices
- May have multiple price calculations

**Replace with:**
```typescript
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
```

#### Step 6: Update Price Fetching Logic (20 minutes)

**Replace the multiple price hooks with:**
```typescript
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
  args: [label as string, duration, paymentMethod.toLowerCase(), isLifetime],
  query: {
    enabled: paymentMethod !== 'BNB',
  },
});

const priceData = useMemo(() => {
  const data = paymentMethod === 'BNB' ? bnbPriceData : tokenPriceData;
  if (!data) return { base: 0n, premium: 0n, total: 0n };

  const { base, premium } = data as { base: bigint; premium: bigint };
  return { base, premium, total: base + premium };
}, [bnbPriceData, tokenPriceData, paymentMethod]);
```

#### Step 7: Test Register Flow (20 minutes)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test each component:**
   - Payment method selection
   - Duration selection (including lifetime)
   - Price updates
   - Registration submission

3. **Fix any issues that arise**

---

### Phase 3: Refactor resolve.tsx (1-2 hours)

#### Step 1: Add Imports (10 minutes)

**At the top of resolve.tsx, add:**
```typescript
// Modular components
import {
  DomainInfoCard,
  SocialLinksDisplay,
  TextRecordsDisplay,
} from './resolve';

// Utilities
import { getSocialIcon, getSocialLink } from '@/lib/utils';

// ABIs
import { REFERRAL_ABI, RESOLVE_ABI, AVAILABLE_ABI } from '@/lib/abis';
```

#### Step 2: Replace Domain Info Display (30 minutes)

**Find the domain info section (typically around lines 400-600):**
- Shows domain name
- Shows owner address
- Shows expiry date
- Shows wrapped status

**Replace with:**
```typescript
<div className="mb-8">
  <DomainInfoCard
    name={label as string}
    owner={domainInfo.owner}
    expiryDate={domainInfo.expiryDate}
    isWrapped={domainInfo.isWrapped}
    isLifetime={domainInfo.isLifetime}
  />
</div>
```

#### Step 3: Replace Social Links Display (20 minutes)

**Find the social links section:**
- Usually loops through social media platforms
- Creates clickable links

**Replace with:**
```typescript
{!recordsLoading && textRecords && textRecords.length > 0 && (
  <SocialLinksDisplay textRecords={textRecords} />
)}
```

#### Step 4: Replace Text Records Display (20 minutes)

**Find the text records display section:**
- Shows non-social text records
- Displays key-value pairs

**Replace with:**
```typescript
{!recordsLoading && (
  <TextRecordsDisplay textRecords={textRecords || []} />
)}
```

#### Step 5: Simplify Domain Data Fetching (20 minutes)

**Calculate domain info in a useMemo:**
```typescript
const domainInfo = useMemo(() => {
  if (!domainData || !expires) return null;

  const [owner, fuses, wrapperExpiry] = domainData as [
    `0x${string}`,
    number,
    bigint
  ];

  const expiryTimestamp = Number(expires);
  const expiryDate = new Date(expiryTimestamp * 1000);
  const isLifetime = expiryTimestamp === 31536000000;

  return {
    owner,
    expiryDate: isLifetime ? null : expiryDate,
    isWrapped: Boolean(wrapped),
    isLifetime,
  };
}, [domainData, expires, wrapped]);
```

#### Step 6: Test Resolve Flow (20 minutes)

1. **Navigate to a domain:**
   ```
   http://localhost:5173/yourdomain
   ```

2. **Test each tab:**
   - Profile tab (domain info, social links, text records)
   - Details tab
   - Manage tab (if you're the owner)

3. **Verify all data displays correctly**

---

### Phase 4: Clean Up and Optimize (1 hour)

#### Step 1: Remove Unused Code (20 minutes)

After refactoring, search for:
- Unused state variables
- Inline ABI definitions (now imported from `lib/abis`)
- Duplicate utility functions
- Commented out code

#### Step 2: Update Inline ABIs (20 minutes)

**Find remaining inline ABI definitions and extract them:**

1. **Identify ABIs not yet extracted:**
   ```bash
   grep -n "const.*ABI\|const.*Abi" register.tsx resolve.tsx
   ```

2. **Move them to appropriate files in `lib/abis/`**

3. **Import from centralized location**

#### Step 3: Add PropTypes/TypeScript Types (20 minutes)

Ensure all components have proper TypeScript types:
- Check function parameters
- Verify return types
- Add missing type annotations

---

### Phase 5: Testing and Validation (1-2 hours)

#### Step 1: Run Unit Tests
```bash
npm run test:run
```

All existing tests should pass, plus the new component tests.

#### Step 2: Manual Testing Checklist

**Register Flow:**
- [ ] Payment method selection works
- [ ] Duration selection works (1-5 years)
- [ ] Lifetime toggle works
- [ ] Prices update correctly
- [ ] Profile fields save
- [ ] Registration succeeds
- [ ] Transaction confirmations work

**Resolve Flow:**
- [ ] Domain info displays correctly
- [ ] Social links are clickable
- [ ] Text records display properly
- [ ] Owner can access manage tab
- [ ] Non-owners cannot manage
- [ ] Update/Renew/Wrap/Unwrap work

#### Step 3: Edge Cases
- [ ] Test with unavailable domains
- [ ] Test with expired domains
- [ ] Test with lifetime domains
- [ ] Test with wrapped/unwrapped domains
- [ ] Test with missing text records

---

### Phase 6: Commit and Deploy

#### Step 1: Review Changes
```bash
git status
git diff
```

#### Step 2: Run Final Tests
```bash
npm run test:run
npm run lint
npm run build
```

#### Step 3: Commit
```bash
git add .
git commit -m "refactor: integrate modular components into register and resolve

- Replace inline payment/duration/price UI with modular components
- Replace inline domain info display with DomainInfoCard
- Replace social links and text records with modular components
- Import ABIs and utilities from centralized modules
- Improve type safety with shared TypeScript types
- Reduce register.tsx from 2203 to ~800 lines
- Reduce resolve.tsx from 1201 to ~600 lines

Closes #XXX"
```

#### Step 4: Push and Create PR
```bash
git push origin feature/refactor-register-resolve
```

Create a pull request with:
- **Title:** "Refactor register and resolve to use modular components"
- **Description:** Link to MODULARIZATION.md and this guide
- **Screenshots:** Before/after of the UI
- **Testing:** Checklist of what was tested

---

## Troubleshooting

### Issue: Components Not Rendering

**Check:**
1. Imports are correct (`from './register'` not `from './register/``)
2. Component names match exports
3. Props are passed correctly

### Issue: Types Don't Match

**Solution:**
```typescript
// Make sure you're using the shared types
import { PaymentMethod } from '@/types/domain';

// Not custom types
type PaymentMethod = 'BNB' | 'CAKE' | 'USD1'; // ❌ Don't do this
```

### Issue: Prices Not Updating

**Check:**
1. Duration is in seconds (use `calculateDurationInSeconds()`)
2. Payment method is correct type
3. Contract addresses are correct

### Issue: Tests Failing

**Run:**
```bash
npm run test:ui
```

Then debug specific failing tests.

---

## Performance Optimization

After refactoring, consider:

### 1. Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const PaymentMethodSelector = lazy(() =>
  import('./register').then(m => ({ default: m.PaymentMethodSelector }))
);
```

### 2. Memoization
```typescript
const priceDisplay = useMemo(() => (
  <PriceDisplay
    basePrice={priceData.base}
    // ...props
  />
), [priceData.base, priceData.premium, paymentMethod]);
```

### 3. Debounce Updates
```typescript
import { useDebounce } from 'use-debounce';

const [duration, setDuration] = useState(31536000);
const [debouncedDuration] = useDebounce(duration, 500);
```

---

## Benefits After Refactoring

### Code Metrics
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| register.tsx | 2,203 lines | ~800 lines | -64% |
| resolve.tsx | 1,201 lines | ~600 lines | -50% |
| Test Coverage | 0% | >80% | +80% |
| Reusable Components | 0 | 6 | +6 |

### Developer Experience
- ✅ Faster to add features
- ✅ Easier to debug issues
- ✅ Better IDE autocomplete
- ✅ Type-safe refactoring

### Maintainability
- ✅ Changes are isolated
- ✅ Components are testable
- ✅ Code is self-documenting

---

## Next Steps

After completing the refactoring:

1. **Add Integration Tests**
   - Test full registration flow
   - Test domain resolution flow

2. **Add E2E Tests**
   - Use Playwright or Cypress
   - Test with real wallet connections

3. **Optimize Bundle Size**
   - Run bundle analyzer
   - Implement code splitting

4. **Documentation**
   - Update README with new structure
   - Add JSDocs to all functions

5. **Share Knowledge**
   - Present refactoring to team
   - Document lessons learned

---

## Resources

- [MODULARIZATION.md](./MODULARIZATION.md) - Architecture overview
- [TESTING.md](./TESTING.md) - Testing guide
- [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) - Refactoring patterns
- [register.refactored.example.tsx](./src/components/register.refactored.example.tsx) - Working example
- [resolve.refactored.example.tsx](./src/components/resolve.refactored.example.tsx) - Working example

---

## Support

If you encounter issues:

1. Check the example files for reference
2. Review test files for usage patterns
3. Check the modular component READMEs
4. Ask the team for help

Happy refactoring! 🚀
