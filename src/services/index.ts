export function getService() {
	const api: string = import.meta.env.VITE_API

	const endponits = {
		auth: {
			getNonce: 'auth/getNonce',
			installPlugin: 'auth/installPlugin'
		}
	}

	if (api === '') {
		throw new Error('VITE_API is emply string')
	}

	return {
		api,
		endponits
	}
}
