import { GraphQLClient } from 'graphql-request'

import { Profile } from '@/models/profile.model'

import {
	fetchAllProfilesByHandleQuery,
	fetchProfileByAddressQuery,
	fetchProfileByHandleQuery
} from '../queries'
import { getGraphQLClient } from '..'

export function getRequests() {
	const client: GraphQLClient = getGraphQLClient()

	async function fetchAllProfilesByHandle(handle: string): Promise<Profile[]> {
		const query: string = fetchAllProfilesByHandleQuery(handle)
		// TODO: Fix any type
		const data: any = await client.request(query)
		const profiles: Profile[] = data.Socials.Social
		return profiles
	}

	async function fetchProfileByAddress(address: string): Promise<Profile> {
		const query: string = fetchProfileByAddressQuery(address)
		// TODO: Fix any type
		const data: any = await client.request(query)
		const profile: Profile = data.Socials.Social[0]
		return profile
	}

	async function fetchProfileByHandle(handle: string) {
		const variables = { handle }
		const data = await client.request(fetchProfileByHandleQuery, variables)
		return data
	}

	return {
		fetchAllProfilesByHandle,
		fetchProfileByAddress,
		fetchProfileByHandle
	}
}
