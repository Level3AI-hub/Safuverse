import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { bsc } from "wagmi/chains";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";


const myTheme = merge(darkTheme(), {
  colors: {
    connectButtonBackground: "#FFB000",
    connectButtonText: "#000000",
  },
  radii: {
    connectButton: "9999px",
  },
} as Theme);

export const config = getDefaultConfig({
  appName: "Safucard",
  projectId: import.meta.env.VITE_REOWN as string,
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={myTheme}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
