import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'node_modules/wagmi/dist/types/exports/chains'
import {
  coinbaseWallet,
  injected,
  walletConnect,
} from 'node_modules/wagmi/dist/types/exports/connectors'

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
