import { createConfig, http } from '@wagmi/core'
import { arbitrum, arbitrumSepolia } from '@wagmi/core/chains'

export const config = createConfig({
	chains: [arbitrum, arbitrumSepolia],
	transports: {
		[arbitrum.id]: http(),
		[arbitrumSepolia.id]: http()
	}
})
