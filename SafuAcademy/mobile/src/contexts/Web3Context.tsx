import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { ethers } from 'ethers';
import { web3Config } from '@config/web3';
import { authService } from '@services/authService';
import { useAuth } from '@hooks/useAuth';

// Only import WalletConnect on native platforms
let WalletConnectModal: any;
let useWalletConnectModal: any;

if (Platform.OS !== 'web') {
  const WC = require('@walletconnect/modal-react-native');
  WalletConnectModal = WC.WalletConnectModal;
  useWalletConnectModal = WC.useWalletConnectModal;
}

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  provider: ethers.Provider | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);

  // Only use WalletConnect on native platforms
  const walletConnectHook = Platform.OS !== 'web' && useWalletConnectModal ? useWalletConnectModal() : null;
  const { loginAsync } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, check for window.ethereum (MetaMask, etc.)
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const checkConnection = async () => {
          try {
            const ethersProvider = new ethers.BrowserProvider((window as any).ethereum);
            const accounts = await ethersProvider.listAccounts();
            if (accounts.length > 0) {
              setAddress(accounts[0].address);
              setIsConnected(true);
              setProvider(ethersProvider);
            }
          } catch (error) {
            console.log('Not connected to web3 wallet');
          }
        };
        checkConnection();
      }
    } else if (walletConnectHook) {
      // On native, use WalletConnect
      const { isConnected: wcIsConnected, address: wcAddress, provider: wcProvider } = walletConnectHook;
      if (wcIsConnected && wcAddress) {
        setAddress(wcAddress);
        setIsConnected(true);

        // Create ethers provider
        if (wcProvider) {
          const ethersProvider = new ethers.BrowserProvider(wcProvider);
          setProvider(ethersProvider);
        }
      } else {
        setAddress(null);
        setIsConnected(false);
        setProvider(null);
      }
    }
  }, [walletConnectHook]);

  const connect = async () => {
    try {
      setIsConnecting(true);

      if (Platform.OS === 'web') {
        // Web: Use window.ethereum (MetaMask, etc.)
        if (typeof window === 'undefined' || !(window as any).ethereum) {
          throw new Error('Please install MetaMask or another Web3 wallet extension');
        }

        const ethersProvider = new ethers.BrowserProvider((window as any).ethereum);

        // Request account access
        await ethersProvider.send('eth_requestAccounts', []);
        const signer = await ethersProvider.getSigner();
        const walletAddress = await signer.getAddress();

        // Get nonce from backend
        const nonce = await authService.getNonce(walletAddress);

        // Create message to sign
        const message = `Sign this message to authenticate with SafuAcademy.\n\nNonce: ${nonce}`;

        // Sign message
        const signature = await signer.signMessage(message);

        // Verify signature and login
        await loginAsync({
          walletAddress,
          signature,
        });

        setAddress(walletAddress);
        setIsConnected(true);
        setProvider(ethersProvider);
      } else {
        // Native: Use WalletConnect
        if (!walletConnectHook) {
          throw new Error('WalletConnect not available');
        }

        await walletConnectHook.open();

        if (walletConnectHook.address && walletConnectHook.provider) {
          // Get nonce from backend
          const nonce = await authService.getNonce(walletConnectHook.address);

          // Create message to sign
          const message = `Sign this message to authenticate with SafuAcademy.\n\nNonce: ${nonce}`;

          // Sign message
          const ethersProvider = new ethers.BrowserProvider(walletConnectHook.provider);
          const signer = await ethersProvider.getSigner();
          const signature = await signer.signMessage(message);

          // Verify signature and login
          await loginAsync({
            walletAddress: walletConnectHook.address,
            signature,
          });
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web: Just clear state (can't actually disconnect MetaMask programmatically)
        setAddress(null);
        setIsConnected(false);
        setProvider(null);
      } else if (walletConnectHook?.provider) {
        // Native: Disconnect WalletConnect
        if (walletConnectHook.provider.disconnect) {
          await walletConnectHook.provider.disconnect();
        }

        setAddress(null);
        setIsConnected(false);
        setProvider(null);
      }

      // Logout from backend
      await authService.logout();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  };

  return (
    <>
      <Web3Context.Provider
        value={{
          address,
          isConnected,
          isConnecting,
          connect,
          disconnect,
          signMessage,
          provider,
        }}
      >
        {children}
      </Web3Context.Provider>
      {Platform.OS !== 'web' && WalletConnectModal && (
        <WalletConnectModal
          projectId={web3Config.projectId}
          providerMetadata={web3Config.metadata}
        />
      )}
    </>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
