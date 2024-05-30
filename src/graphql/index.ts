import { GraphQLClient } from 'graphql-request'

import { AIRSTACK_API_URL } from '@/config/commons'

export function getGraphQLClient(): GraphQLClient {
	const apiKey: string = import.meta.env.VITE_AIRSTACK_API_KEY

	if (apiKey === '') {
		throw new Error('VITE_AIRSTACK_API_KEY is emply string')
	}

	const graphQLClient: GraphQLClient = new GraphQLClient(AIRSTACK_API_URL, {
		headers: {
			Authorization: apiKey
		}
	})

	return graphQLClient
}
