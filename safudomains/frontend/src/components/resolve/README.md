# Resolve Components

Modular components for displaying domain information and management.

## Components

### DomainInfoCard
Displays key information about a domain including owner, expiry, and status.

**Usage:**
```tsx
import { DomainInfoCard } from '@/components/resolve';

<DomainInfoCard
  name="yourname"
  owner="0x1234...5678"
  expiryDate={new Date('2025-12-31')}
  isWrapped={true}
  isLifetime={false}
/>
```

**Props:**
- `name`: Domain name (without .safu)
- `owner`: Owner's Ethereum address
- `expiryDate`: Expiry date or null
- `isWrapped`: Whether domain is wrapped
- `isLifetime`: Whether lifetime registration
- `className`: Additional CSS classes (optional)

---

### SocialLinksDisplay
Shows social media links from domain's text records.

**Usage:**
```tsx
import { SocialLinksDisplay } from '@/components/resolve';

<SocialLinksDisplay
  textRecords={[
    { key: 'com.twitter', value: 'username' },
    { key: 'com.github', value: 'username' },
  ]}
/>
```

**Props:**
- `textRecords`: Array of text records
- `className`: Additional CSS classes (optional)

**Supported Platforms:**
- Twitter (com.twitter)
- GitHub (com.github)
- Reddit (com.reddit)
- Telegram (org.telegram)
- YouTube (com.youtube)
- Email (email)
- WhatsApp (com.whatsapp)
- Snapchat (com.snapchat)

---

### TextRecordsDisplay
Shows all non-social text records.

**Usage:**
```tsx
import { TextRecordsDisplay } from '@/components/resolve';

<TextRecordsDisplay
  textRecords={[
    { key: 'description', value: 'My cool domain' },
    { key: 'url', value: 'https://example.com' },
  ]}
/>
```

**Props:**
- `textRecords`: Array of text records
- `className`: Additional CSS classes (optional)

## Example: Complete Domain Display

```tsx
import {
  DomainInfoCard,
  SocialLinksDisplay,
  TextRecordsDisplay,
} from '@/components/resolve';

function DomainProfile({ domain }) {
  return (
    <div className="space-y-6">
      <DomainInfoCard
        name={domain.name}
        owner={domain.owner}
        expiryDate={domain.expiryDate}
        isWrapped={domain.isWrapped}
        isLifetime={domain.isLifetime}
      />

      <SocialLinksDisplay textRecords={domain.textRecords} />

      <TextRecordsDisplay textRecords={domain.textRecords} />
    </div>
  );
}
```
