# Testing Documentation

This document describes the testing setup and practices for the SafuDomains frontend.

## Testing Stack

- **Vitest**: Fast unit test framework (Vite-native)
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM implementation for Node.js
- **@testing-library/jest-dom**: Custom matchers for DOM assertions

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized alongside the code they test using the `__tests__` directory pattern:

```
src/
├── lib/
│   └── utils/
│       ├── domainValidation.ts
│       └── __tests__/
│           └── domainValidation.test.ts
│
├── components/
│   ├── register/
│   │   ├── PaymentMethodSelector.tsx
│   │   └── __tests__/
│   │       └── PaymentMethodSelector.test.tsx
│   │
│   └── resolve/
│       ├── DomainInfoCard.tsx
│       └── __tests__/
│           └── DomainInfoCard.test.tsx
│
└── test/
    └── setup.ts          # Global test configuration
```

## Test Coverage

### Utility Modules

#### domainValidation.test.ts
- ✅ `isValidDomainName()` - validates domain name format
- ✅ `getDomainValidationError()` - returns appropriate error messages
- ✅ `normalizeDomainName()` - lowercase and trim
- ✅ `getDomainCharacterTier()` - returns correct tier (2-5+)
- ✅ `isValidEthereumAddress()` - validates Ethereum addresses

#### priceCalculation.test.ts
- ✅ `calculateTotalPrice()` - adds base + premium
- ✅ `formatPrice()` - formats wei to ETH
- ✅ `calculateDurationInSeconds()` - converts years to seconds
- ✅ `calculatePricePerYear()` - calculates yearly rate
- ✅ `getLifetimeMultiplier()` - returns multiplier by domain length
- ✅ `calculateLifetimePrice()` - calculates lifetime cost

#### socialIcons.test.tsx
- ✅ `getSocialIcon()` - returns icon component for platform
- ✅ `getSocialLink()` - generates correct social media URLs
- ✅ Handles Twitter, GitHub, Reddit, Telegram, YouTube, Email, etc.

### Register Components

#### PaymentMethodSelector.test.tsx
- ✅ Renders all payment methods (BNB, CAKE, USD1)
- ✅ Highlights selected method
- ✅ Calls onChange when clicked
- ✅ Disables when disabled prop is true
- ✅ Applies custom className

#### DurationSelector.test.tsx
- ✅ Renders all duration options (1-5 years + lifetime)
- ✅ Highlights selected duration
- ✅ Calls onChange callbacks
- ✅ Toggles lifetime registration
- ✅ Disables year options when lifetime selected
- ✅ Shows checkmark for lifetime

#### PriceDisplay.test.tsx
- ✅ Renders total price
- ✅ Shows loading state
- ✅ Displays price breakdown (base + premium)
- ✅ Shows lifetime indicator
- ✅ Displays duration in years
- ✅ Shows price per year for multi-year
- ✅ Handles different payment methods

### Resolve Components

#### DomainInfoCard.test.tsx
- ✅ Renders domain name with .safu extension
- ✅ Displays owner address
- ✅ Shows wrapped/lifetime badges
- ✅ Displays expiry date
- ✅ Shows expired status
- ✅ Shows lifetime status
- ✅ Creates BSCScan link for owner

#### SocialLinksDisplay.test.tsx
- ✅ Renders social media links
- ✅ Creates correct platform links
- ✅ Filters out non-social records
- ✅ Handles multiple social links
- ✅ Displays platform names correctly

#### TextRecordsDisplay.test.tsx
- ✅ Renders text records
- ✅ Shows empty state message
- ✅ Filters out social records
- ✅ Formats keys with dots
- ✅ Handles long values
- ✅ Renders records in order

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />);

    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const mockCallback = vi.fn();
    render(<MyComponent onClick={mockCallback} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockCallback).toHaveBeenCalled();
  });
});
```

### Testing Utilities

```typescript
import { describe, it, expect } from 'vitest';
import { myUtilFunction } from '../myUtil';

describe('myUtilFunction', () => {
  it('should return expected value', () => {
    expect(myUtilFunction('input')).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(myUtilFunction('')).toBe('default');
    expect(myUtilFunction(null)).toBe('default');
  });
});
```

### Testing Async Functions

```typescript
import { describe, it, expect } from 'vitest';

describe('async function', () => {
  it('should resolve with data', async () => {
    const result = await fetchData();
    expect(result).toEqual({ data: 'value' });
  });

  it('should reject with error', async () => {
    await expect(fetchDataWithError()).rejects.toThrow('Error message');
  });
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Don't test implementation details:**
```typescript
// Bad - testing internal state
expect(component.state.isOpen).toBe(true);
```

✅ **Do test user-visible behavior:**
```typescript
// Good - testing what user sees
expect(screen.getByText('Modal Content')).toBeVisible();
```

### 2. Use Accessible Queries

Priority order for queries:
1. `getByRole` - Most accessible
2. `getByLabelText` - For form elements
3. `getByPlaceholderText` - For inputs
4. `getByText` - For content
5. `getByTestId` - Last resort

```typescript
// Good - using accessible queries
const button = screen.getByRole('button', { name: 'Submit' });
const input = screen.getByLabelText('Email Address');
```

### 3. Keep Tests Focused

Each test should verify one specific behavior:

```typescript
// Good - focused test
it('should display error message when validation fails', () => {
  render(<Form />);
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByText('Email is required')).toBeInTheDocument();
});
```

### 4. Use Descriptive Test Names

```typescript
// Bad
it('works', () => { ... });

// Good
it('should display error message when email is invalid', () => { ... });
```

### 5. Clean Up After Tests

Tests are automatically cleaned up using the global `afterEach` in `setup.ts`:

```typescript
// src/test/setup.ts
afterEach(() => {
  cleanup();
});
```

### 6. Mock External Dependencies

```typescript
import { vi } from 'vitest';

// Mock a module
vi.mock('../api/client', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' })),
}));

// Mock a function
const mockCallback = vi.fn();
```

## Coverage Goals

Target coverage metrics:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Run `npm run test:coverage` to generate a coverage report.

## CI/CD Integration

Tests should be run in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Debugging Tests

### Run Specific Test File
```bash
npx vitest src/lib/utils/__tests__/domainValidation.test.ts
```

### Run Tests Matching Pattern
```bash
npx vitest -t "should validate domain name"
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Testing Patterns

### Testing Form Submission
```typescript
it('should submit form with valid data', async () => {
  const mockSubmit = vi.fn();
  render(<Form onSubmit={mockSubmit} />);

  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

### Testing Async State Updates
```typescript
it('should show loading then data', async () => {
  render(<DataFetcher />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Testing Error Boundaries
```typescript
it('should display error message when component throws', () => {
  const error = console.error;
  console.error = vi.fn();

  render(
    <ErrorBoundary>
      <ThrowingComponent />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();

  console.error = error;
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
