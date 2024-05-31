import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains'

import { init } from '@airstack/airstack-react'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RAINBOW_KIT_APP_ID, RAINBOW_KIT_APP_NAME } from './config/commons.ts'
import App from './pages/App/App.tsx'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'

const config = getDefaultConfig({
	appName: RAINBOW_KIT_APP_NAME,
	projectId: RAINBOW_KIT_APP_ID,
	chains: [mainnet, polygon, optimism, arbitrum],
	ssr: false // If your dApp uses server side rendering (SSR)
})

const apiKey: string = import.meta.env.VITE_AIRSTACK_API_KEY

if (!apiKey) {
	throw new Error('Missing VITE_AIRSTACK_API_KEY in .env')
}

init(apiKey)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={config}>
				<RainbowKitProvider>
					<App />
				</RainbowKitProvider>
			</WagmiProvider>
		</QueryClientProvider>
	</React.StrictMode>
)
