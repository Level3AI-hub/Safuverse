# Register Components

Modular components for domain registration functionality.

## Components

### PaymentMethodSelector
Allows users to select their preferred payment token (BNB, CAKE, USD1).

**Usage:**
```tsx
import { PaymentMethodSelector } from '@/components/register';

<PaymentMethodSelector
  selectedMethod={paymentMethod}
  onMethodChange={setPaymentMethod}
  disabled={isLoading}
/>
```

**Props:**
- `selectedMethod`: Current payment method
- `onMethodChange`: Callback when payment method changes
- `disabled`: Disable selection (optional)
- `className`: Additional CSS classes (optional)

---

### DurationSelector
Allows users to choose registration duration (1-5 years or lifetime).

**Usage:**
```tsx
import { DurationSelector } from '@/components/register';

<DurationSelector
  duration={duration}
  onDurationChange={setDuration}
  isLifetime={isLifetime}
  onLifetimeChange={setIsLifetime}
  disabled={isLoading}
/>
```

**Props:**
- `duration`: Current duration in seconds
- `onDurationChange`: Callback when duration changes
- `isLifetime`: Whether lifetime registration is selected
- `onLifetimeChange`: Callback when lifetime toggle changes
- `disabled`: Disable selection (optional)
- `className`: Additional CSS classes (optional)

---

### PriceDisplay
Shows registration price with breakdown and details.

**Usage:**
```tsx
import { PriceDisplay } from '@/components/register';

<PriceDisplay
  basePrice={basePrice}
  premiumPrice={premiumPrice}
  totalPrice={totalPrice}
  paymentMethod={paymentMethod}
  isLifetime={isLifetime}
  duration={duration}
  isLoading={isPriceLoading}
/>
```

**Props:**
- `basePrice`: Base price in wei
- `premiumPrice`: Premium price in wei
- `totalPrice`: Total price in wei
- `paymentMethod`: Selected payment token
- `isLifetime`: Whether lifetime registration
- `duration`: Duration in seconds
- `isLoading`: Show loading state (optional)
- `className`: Additional CSS classes (optional)

## Example: Complete Registration Flow

```tsx
import { useState } from 'react';
import {
  PaymentMethodSelector,
  DurationSelector,
  PriceDisplay,
} from '@/components/register';
import { PaymentMethod } from '@/types/domain';

function RegisterFlow() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BNB');
  const [duration, setDuration] = useState(31536000); // 1 year in seconds
  const [isLifetime, setIsLifetime] = useState(false);

  return (
    <div className="space-y-6">
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
        premiumPrice={0n}
        totalPrice={basePrice}
        paymentMethod={paymentMethod}
        isLifetime={isLifetime}
        duration={duration}
      />
    </div>
  );
}
```
