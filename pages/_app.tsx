import type { AppProps } from 'next/app'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ToastContainer } from 'react-toastify'

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
require( '@solana/wallet-adapter-react-ui/styles.css' )

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import( '../components/WalletConnectionProvider' ).then(
      ({ WalletConnectionProvider }) => WalletConnectionProvider,
    ),
  {
    ssr: false,
  },
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletModalProvider>
        <ToastContainer />
        <Component {...pageProps} />
      </WalletModalProvider>
    </WalletConnectionProvider>
  )
}

export default MyApp
