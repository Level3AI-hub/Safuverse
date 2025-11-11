# SafuDomains Frontend Modularization

This document describes the modularization of the register and resolve components for better code organization and maintainability.

## Overview

The large monolithic `register.tsx` (2203 lines) and `resolve.tsx` (1201 lines) files have been refactored into smaller, reusable modules organized by functionality.

## Directory Structure

```
src/
├── components/
│   ├── register/
│   │   ├── PaymentMethodSelector.tsx   # Payment token selection
│   │   ├── DurationSelector.tsx        # Duration and lifetime toggle
│   │   ├── PriceDisplay.tsx            # Price breakdown display
│   │   ├── index.ts                    # Module exports
│   │   └── README.md                   # Component documentation
│   │
│   ├── resolve/
│   │   ├── DomainInfoCard.tsx          # Domain info display
│   │   ├── SocialLinksDisplay.tsx      # Social media links
│   │   ├── TextRecordsDisplay.tsx      # Text records display
│   │   ├── index.ts                    # Module exports
│   │   └── README.md                   # Component documentation
│   │
│   ├── register.tsx                    # Main register component (refactored)
│   └── resolve.tsx                     # Main resolve component (refactored)
│
├── lib/
│   ├── abis/
│   │   ├── erc20.ts                    # ERC20 ABI
│   │   ├── controller.ts               # Controller ABI
│   │   ├── referral.ts                 # Referral ABI
│   │   ├── registry.ts                 # Registry & resolve ABIs
│   │   └── index.ts                    # All ABIs export
│   │
│   └── utils/
│       ├── socialIcons.tsx             # Social media icon mapping
│       ├── domainValidation.ts         # Domain validation utilities
│       ├── priceCalculation.ts         # Price calculation helpers
│       └── index.ts                    # All utils export
│
└── types/
    └── domain.ts                       # Shared type definitions
```

## Benefits

### 1. **Better Code Organization**
- **Separation of Concerns**: Each component has a single responsibility
- **Logical Grouping**: Related functionality is grouped together
- **Easy Navigation**: Clear structure makes finding code easier

### 2. **Improved Reusability**
- **Modular Components**: Components can be used in different contexts
- **Shared Utilities**: Common functions centralized and reusable
- **Type Safety**: Shared types ensure consistency

### 3. **Enhanced Maintainability**
- **Smaller Files**: Easier to understand and modify
- **Isolated Changes**: Changes in one module don't affect others
- **Better Testing**: Smaller units are easier to test

### 4. **Developer Experience**
- **Clear Imports**: Import only what you need
- **Auto-completion**: Better IDE support with types
- **Documentation**: Each module has its own documentation

## Usage Examples

### Register Components

```tsx
import {
  PaymentMethodSelector,
  DurationSelector,
  PriceDisplay,
} from '@/components/register';
import { PaymentMethod } from '@/types/domain';

// Use in your component
<PaymentMethodSelector
  selectedMethod={paymentMethod}
  onMethodChange={setPaymentMethod}
/>

<DurationSelector
  duration={duration}
  onDurationChange={setDuration}
  isLifetime={isLifetime}
  onLifetimeChange={setIsLifetime}
/>

<PriceDisplay
  basePrice={basePrice}
  premiumPrice={premiumPrice}
  totalPrice={totalPrice}
  paymentMethod={paymentMethod}
  isLifetime={isLifetime}
  duration={duration}
/>
```

### Resolve Components

```tsx
import {
  DomainInfoCard,
  SocialLinksDisplay,
  TextRecordsDisplay,
} from '@/components/resolve';

// Use in your component
<DomainInfoCard
  name={domainName}
  owner={ownerAddress}
  expiryDate={expiryDate}
  isWrapped={isWrapped}
  isLifetime={isLifetime}
/>

<SocialLinksDisplay textRecords={textRecords} />

<TextRecordsDisplay textRecords={textRecords} />
```

### Utility Functions

```tsx
import {
  isValidDomainName,
  formatPrice,
  getSocialIcon,
  getSocialLink,
} from '@/lib/utils';

// Validate domain name
if (!isValidDomainName(name)) {
  const error = getDomainValidationError(name);
  console.error(error);
}

// Format price
const formattedPrice = formatPrice(priceInWei, 4);

// Get social icon and link
const Icon = getSocialIcon('com.twitter');
const link = getSocialLink('com.twitter', 'username');
```

### ABIs

```tsx
import { ERC20_ABI, CONTROLLER_ABI, REFERRAL_ABI } from '@/lib/abis';

// Use in wagmi hooks
const { data } = useReadContract({
  address: tokenAddress,
  abi: ERC20_ABI,
  functionName: 'allowance',
  args: [owner, spender],
});
```

### Types

```tsx
import { RegisterParams, PaymentMethod, DomainInfo } from '@/types/domain';

const registerParams: RegisterParams = {
  domain: 'myname',
  duration: 31536000,
  resolver: '0x...',
  data: [],
  reverseRecord: true,
  ownerControlledFuses: 0,
  lifetime: false,
  referree: '',
};
```

## Migration Guide

### For Existing `register.tsx` Usage

**Before:**
```tsx
// All logic in one massive file
import Register from '@/components/register';
```

**After:**
```tsx
// Import modular components
import {
  PaymentMethodSelector,
  DurationSelector,
  PriceDisplay,
} from '@/components/register';

// Import utilities
import { formatPrice, calculateTotalPrice } from '@/lib/utils';

// Import types
import { RegisterParams, PaymentMethod } from '@/types/domain';
```

### For Existing `resolve.tsx` Usage

**Before:**
```tsx
// All logic in one massive file
import Resolve from '@/components/resolve';
```

**After:**
```tsx
// Import modular components
import {
  DomainInfoCard,
  SocialLinksDisplay,
  TextRecordsDisplay,
} from '@/components/resolve';

// Import utilities
import { getSocialIcon, getSocialLink } from '@/lib/utils';
```

## Best Practices

1. **Import from index files**: Always import from `@/components/register` or `@/components/resolve` rather than specific files
2. **Use TypeScript types**: Import types from `@/types/domain` for type safety
3. **Leverage utilities**: Don't duplicate logic, use shared utilities
4. **Keep components focused**: Each component should do one thing well
5. **Document changes**: Update README.md files when modifying components

## Next Steps

To complete the migration:

1. **Refactor register.tsx**: Update main component to use new modules
2. **Refactor resolve.tsx**: Update main component to use new modules
3. **Add tests**: Write unit tests for each module
4. **Performance optimization**: Lazy load components where appropriate
5. **Documentation**: Add JSDoc comments to all functions

## Contributing

When adding new functionality:

1. Create modular components in appropriate directories
2. Add utility functions to `lib/utils/`
3. Define shared types in `types/`
4. Update documentation
5. Write tests

## Questions?

Refer to the README.md files in each module directory for detailed documentation and examples.
