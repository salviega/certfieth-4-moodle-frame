import axios from 'axios'

import { getService } from '.'

export function fetchNonceData() {
	const { api, endponits } = getService()
	const { auth } = endponits

	const getNonce = async (address: string) => {
		const result = await axios.get(`${api}/${auth.getNonce}/${address}`)
		const nonce: string = result.data
		return nonce
	}

	const installPlugin = async (
		message: string,
		nonce: string,
		address: string,
		signature: string
	) => {
		const result = await axios.post(`${api}/${auth.installPlugin}`, {
			message,
			nonce,
			address,
			signature
		})

		const data = result.data
		return data
	}

	return { getNonce, installPlugin }
}
