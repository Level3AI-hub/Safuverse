# The Graph Integration Guide

The SafuPad SDK now includes built-in support for querying indexed data from The Graph subgraph. This allows you to efficiently fetch historical data, trades, launches, and statistics without relying on event logs.

## Table of Contents

- [Installation & Setup](#installation--setup)
- [Quick Start](#quick-start)
- [Available Queries](#available-queries)
- [Usage Examples](#usage-examples)
- [Advanced Queries](#advanced-queries)
- [Comparison: Events vs The Graph](#comparison-events-vs-the-graph)

## Installation & Setup

The Graph integration is automatically available when you configure the SDK with a network that has subgraph support (BSC Testnet/Mainnet):

```typescript
import { SafuPadSDK } from '@safupad/sdk';

const sdk = new SafuPadSDK({
  network: 'bscTestnet', // subgraph URL is configured automatically
  provider: window.ethereum,
});

await sdk.initialize();

// Check if The Graph is available
if (sdk.hasGraphSupport()) {
  const graph = sdk.getGraph();
  // Use graph queries
}
```

### Custom Subgraph URL

You can also provide a custom subgraph URL:

```typescript
const sdk = new SafuPadSDK({
  network: 'bscTestnet',
  provider: window.ethereum,
  subgraphUrl: 'https://api.studio.thegraph.com/query/<your-subgraph-id>/safupad/version/latest',
});
```

## Quick Start

```typescript
import { SafuPadSDK } from '@safupad/sdk';

const sdk = new SafuPadSDK({
  network: 'bscTestnet',
  provider: window.ethereum,
});

await sdk.initialize();

// Get all launches
const launches = await sdk.graph.getLaunches();
console.log(`Found ${launches.length} launches`);

// Get a specific token with all its data
const token = await sdk.graph.getToken('0x...');
console.log(`Token: ${token.name} (${token.symbol})`);
console.log(`Launch Type: ${token.launch?.launchType}`);
console.log(`Total Volume: ${token.totalVolume}`);

// Get trading activity for a token
const trades = await sdk.graph.getTrades({ token: '0x...' });
console.log(`Found ${trades.length} trades`);
```

## Available Queries

### Tokens

```typescript
// Get token by address (includes launch and pool data)
const token = await sdk.graph.getToken('0x...');

// Search tokens by name or symbol
const results = await sdk.graph.searchTokens('SAFU', 10);

// Get trending tokens (by volume)
const trending = await sdk.graph.getTrendingTokens(10);
```

### Launches

```typescript
// Get all launches
const allLaunches = await sdk.graph.getLaunches();

// Get launches with filters
const projectRaises = await sdk.graph.getProjectRaises();
const instantLaunches = await sdk.graph.getInstantLaunches();
const activeLaunches = await sdk.graph.getActiveLaunches();
const graduatedLaunches = await sdk.graph.getGraduatedLaunches();

// Get launches with pagination
const recentLaunches = await sdk.graph.getLaunches(
  {}, // no filters
  { first: 20, skip: 0, orderBy: 'createdAt', orderDirection: 'desc' }
);

// Get specific launch
const launch = await sdk.graph.getLaunch('0x...');
```

### Pools

```typescript
// Get pool by token address
const pool = await sdk.graph.getPool('0x...');

// Get active pools (bonding curve trading)
const activePools = await sdk.graph.getActivePools();

// Get graduated pools
const graduatedPools = await sdk.graph.getGraduatedPools();

// Get pools with custom filters
const highVolumePools = await sdk.graph.getPools(
  { active: true },
  { orderBy: 'totalVolume', orderDirection: 'desc', first: 10 }
);
```

### Trades

```typescript
// Get all trades for a token
const tokenTrades = await sdk.graph.getTrades({ token: '0x...' });

// Get user's trading history
const userTrades = await sdk.graph.getUserTrades('0x...');

// Get only buy trades
const buyTrades = await sdk.graph.getTrades({
  token: '0x...',
  isBuy: true
});

// Get trades with pagination
const recentTrades = await sdk.graph.getTrades(
  { token: '0x...' },
  { first: 50, skip: 0, orderBy: 'timestamp', orderDirection: 'desc' }
);
```

### Contributions

```typescript
// Get all contributions for a launch
const contributions = await sdk.graph.getContributions('0x...');

// Get specific user's contribution
const userContribution = await sdk.graph.getContribution('0x...', '0xuser...');

// Get all contributions by a user
const userContributions = await sdk.graph.getUserContributions('0xuser...');
```

### Statistics

```typescript
// Get platform-wide statistics
const stats = await sdk.graph.getPlatformStats();
console.log(`Total Launches: ${stats.totalLaunches}`);
console.log(`Total Volume: ${stats.totalVolume}`);
console.log(`Total Fees: ${stats.totalFees}`);

// Get daily statistics (last 30 days)
const dailyStats = await sdk.graph.getDailyStats(30);
dailyStats.forEach(day => {
  console.log(`Date: ${new Date(Number(day.date) * 1000).toLocaleDateString()}`);
  console.log(`  Volume: ${day.volume}`);
  console.log(`  Trades: ${day.trades}`);
});
```

### Token Holders

```typescript
// Get top holders for a token
const holders = await sdk.graph.getTokenHolders('0x...', {
  first: 100,
  orderBy: 'balance',
  orderDirection: 'desc'
});

holders.forEach(holder => {
  console.log(`${holder.holder}: ${holder.balance}`);
});
```

## Usage Examples

### Display All Active Launches

```typescript
const activeLaunches = await sdk.graph.getActiveLaunches();

for (const launch of activeLaunches) {
  console.log(`
    Token: ${launch.token.name} (${launch.token.symbol})
    Type: ${launch.launchType}
    Raised: ${launch.totalRaised} BNB
    Target: ${launch.raiseTarget} BNB
    Progress: ${(Number(launch.totalRaised) / Number(launch.raiseTarget) * 100).toFixed(2)}%
    Deadline: ${new Date(Number(launch.raiseDeadline) * 1000).toLocaleString()}
  `);
}
```

### Show Token Details with Trading Activity

```typescript
const tokenAddress = '0x...';

// Get full token data
const token = await sdk.graph.getToken(tokenAddress);

console.log(`
  === ${token.name} (${token.symbol}) ===

  Launch Type: ${token.launch?.launchType}
  Created: ${new Date(Number(token.createdAt) * 1000).toLocaleString()}
  Total Volume: ${token.totalVolume} BNB
  Total Trades: ${token.totalTrades}

  Pool Info:
    Current Price: ${token.pool?.currentPrice}
    Market Cap: ${token.pool?.marketCap}
    Graduated: ${token.pool?.graduated ? 'Yes' : 'No'}

  Socials:
    Website: ${token.website}
    Twitter: ${token.twitter}
    Telegram: ${token.telegram}
`);

// Get recent trades
const trades = await sdk.graph.getTrades(
  { token: tokenAddress },
  { first: 10, orderBy: 'timestamp', orderDirection: 'desc' }
);

console.log('\nRecent Trades:');
trades.forEach(trade => {
  const type = trade.isBuy ? 'BUY' : 'SELL';
  console.log(`  ${type}: ${trade.tokenAmount} tokens for ${trade.bnbAmount} BNB`);
});
```

### User Dashboard

```typescript
const userAddress = '0x...';

// Get user's contributions
const contributions = await sdk.graph.getUserContributions(userAddress);
console.log(`\nYour Contributions (${contributions.length}):`);
contributions.forEach(c => {
  console.log(`  ${c.launch.token.name}: ${c.amount} BNB (${c.claimed ? 'Claimed' : 'Pending'})`);
});

// Get user's trades
const trades = await sdk.graph.getUserTrades(userAddress);
console.log(`\nYour Trades (${trades.length}):`);

let totalBought = 0n;
let totalSold = 0n;
trades.forEach(trade => {
  if (trade.isBuy) {
    totalBought += BigInt(trade.bnbAmount);
  } else {
    totalSold += BigInt(trade.bnbAmount);
  }
});

console.log(`  Total Bought: ${totalBought} BNB`);
console.log(`  Total Sold: ${totalSold} BNB`);
```

### Live Price Feed

```typescript
// Get active pools sorted by recent activity
const activePools = await sdk.graph.getPools(
  { active: true, graduated: false },
  { orderBy: 'totalVolume', orderDirection: 'desc', first: 20 }
);

console.log('Active Tokens:');
activePools.forEach(pool => {
  const priceChange = '...'; // Calculate from historical data
  console.log(`
    ${pool.token.name} (${pool.token.symbol})
    Price: ${pool.currentPrice}
    Volume: ${pool.totalVolume} BNB
    Buys/Sells: ${pool.totalBuys}/${pool.totalSells}
  `);
});
```

## Advanced Queries

### Pagination

```typescript
// Fetch all launches in pages of 100
let skip = 0;
const first = 100;
let allLaunches = [];

while (true) {
  const launches = await sdk.graph.getLaunches({}, { first, skip });

  if (launches.length === 0) break;

  allLaunches = allLaunches.concat(launches);
  skip += first;

  if (launches.length < first) break; // Last page
}

console.log(`Total launches: ${allLaunches.length}`);
```

### Complex Filtering

```typescript
// Get successful Project Raises that have graduated
const successfulRaises = await sdk.graph.getLaunches({
  launchType: 'PROJECT_RAISE',
  raiseCompleted: true,
  graduatedToPancakeSwap: true,
});

// Get high-value trades (example)
const allTrades = await sdk.graph.getTrades({}, { first: 1000 });
const highValueTrades = allTrades.filter(trade =>
  BigInt(trade.bnbAmount) > BigInt('1000000000000000000') // > 1 BNB
);
```

## Comparison: Events vs The Graph

### Using Events (Traditional Approach)

```typescript
// ❌ Slow, requires scanning many blocks
const launches = [];
const filter = sdk.launchpad.contract.filters.LaunchCreated();
const events = await sdk.launchpad.contract.queryFilter(filter, 0, 'latest');

for (const event of events) {
  // Process each event...
  launches.push(...);
}
```

### Using The Graph (Recommended)

```typescript
// ✅ Fast, indexed, efficient
const launches = await sdk.graph.getLaunches();
```

### Benefits of The Graph

1. **Performance**: Pre-indexed data means instant queries
2. **Complex Queries**: Filter, sort, and paginate easily
3. **Relationships**: Get related data in a single query
4. **Historical Data**: Access complete history without block scanning
5. **Real-time**: Subgraph updates in near real-time
6. **No RPC Limits**: Doesn't count against your RPC rate limits

### When to Use Events

- Real-time updates (listen for new events as they happen)
- Verifying on-chain data
- When subgraph is not available or syncing

### When to Use The Graph

- Fetching historical data
- Complex queries with filters and pagination
- Displaying lists and tables
- Analytics and statistics
- User dashboards

## Best Practices

1. **Use The Graph for historical data queries**
   ```typescript
   // Good
   const launches = await sdk.graph.getLaunches();

   // Avoid
   const events = await contract.queryFilter(filter, 0, 'latest');
   ```

2. **Combine with event listeners for real-time updates**
   ```typescript
   // Initial load from The Graph
   let launches = await sdk.graph.getLaunches();

   // Listen for new launches
   sdk.launchpad.onLaunchCreated((event) => {
     launches.push(event);
   });
   ```

3. **Use pagination for large datasets**
   ```typescript
   const launches = await sdk.graph.getLaunches({}, {
     first: 50,
     skip: page * 50
   });
   ```

4. **Cache results when appropriate**
   ```typescript
   // Cache platform stats (updates infrequently)
   let cachedStats = null;
   let cacheTime = 0;

   async function getStats() {
     if (Date.now() - cacheTime > 60000) { // 1 minute cache
       cachedStats = await sdk.graph.getPlatformStats();
       cacheTime = Date.now();
     }
     return cachedStats;
   }
   ```

## TypeScript Support

All Graph methods are fully typed:

```typescript
import { GraphLaunch, GraphToken, GraphTrade } from '@safupad/sdk';

const launch: GraphLaunch = await sdk.graph.getLaunch('0x...');
const token: GraphToken = await sdk.graph.getToken('0x...');
const trades: GraphTrade[] = await sdk.graph.getTrades({ token: '0x...' });
```

## Error Handling

```typescript
try {
  const token = await sdk.graph.getToken('0x...');
  if (!token) {
    console.log('Token not found');
  }
} catch (error) {
  console.error('Failed to query subgraph:', error);
  // Fallback to contract calls
  const tokenInfo = await sdk.launchpad.getLaunchInfo('0x...');
}
```

## Support

For issues or questions:
- Check subgraph deployment status on [The Graph Studio](https://thegraph.com/studio/)
- Ensure subgraphUrl is configured correctly
- Verify network connectivity

## Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [SafuPad Subgraph Schema](../SafuPad/subgraph/schema.graphql)
- [GraphQL Query Language](https://graphql.org/learn/)
