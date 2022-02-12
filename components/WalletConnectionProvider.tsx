import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {
    getWalletAdapters
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { FC, ReactNode, useMemo } from 'react'

export const WalletConnectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ?
    WalletAdapterNetwork.Mainnet
    :
    WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl( network ), [ network ])

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => getWalletAdapters({ network }),
    [ network ],
  )

  return (
    <ConnectionProvider endpoint={ endpoint }>
      <WalletProvider wallets={ wallets }>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
