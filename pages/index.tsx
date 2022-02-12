import type { NextPage } from 'next'
import Head from 'next/head'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect, KeyboardEvent } from 'react'
import { toast } from 'react-toastify'

import { checkToken, getWalletTokenAddrs, getTokenMetadata } from './api/solana'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { publicKey } = useWallet()
  const walletPublicKey = publicKey?.toString()
  const [failedVerify, setFailedVerify] = useState(false)
  const [manualToken, setManualToken] = useState("")

  useEffect(() => {
    if ( walletPublicKey ) {
      checkWallet( walletPublicKey )
    }
  }, [walletPublicKey])

  const checkWallet = async (address: string) => {
    toast.info("Checking wallet...", {
      position: toast.POSITION.TOP_CENTER
    })

    const tokenAddresses = await getWalletTokenAddrs( address )
    console.log('found tokens ', tokenAddresses.length)
    let tokenFound = false
    for (let i=0;i<tokenAddresses.length;i++) {
      const metadata = await getTokenMetadata(tokenAddresses[i])
      if ( await checkToken( metadata )) {
        console.log('token matched ', metadata)
        tokenFound = true
        break
      }
    }

    if ( tokenFound ) {
      toast.success("Token found in wallet!", {
        position: toast.POSITION.TOP_CENTER
      })
    } else {
      toast.error("No valid token found in wallet. Please try entering a token address.", {
        position: toast.POSITION.TOP_CENTER
      })
      setFailedVerify( true )
    }
  }


  const checkManualToken = async (e: KeyboardEvent<HTMLInputElement>) => {
    if ( e.key !== "Enter" ) {
      return
    }

    setManualToken("")
    const metadata = await getTokenMetadata(manualToken)
    if ( await checkToken(metadata)) {
      toast.success("Valid token entered", {
        position: toast.POSITION.TOP_CENTER
      })
    } else {
      toast.error("Token invalid", {
        position: toast.POSITION.TOP_CENTER
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Anon Verify</title>
        <meta name="description" content="Anon verification" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Anon Verify
        </h1>

        <p className={styles.description}>
          <WalletMultiButton />
        </p>

        { failedVerify &&
          <div className={styles.grid}>
            <h2>Check Token &rarr;</h2>

            <h2>
              <input type="text"
                value={manualToken}
                onChange={e => setManualToken(e.target.value)}
                onKeyUp={checkManualToken}
              />
            </h2>
          </div>
        }
      </main>
    </div>
  )
}

export default Home
