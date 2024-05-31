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

		if (data.Socials.Social) {
			const profiles: Profile[] = data.Socials.Social
			return profiles
		}

		return [] as Profile[]
	}

	async function fetchProfileByAddress(address: string): Promise<Profile> {
		const query: string = fetchProfileByAddressQuery(address)

		// TODO: Fix any type
		const data: any = await client.request(query)

		if (data.Socials.Social) {
			const profile: Profile = data.Socials.Social[0]
			return profile
		}

		return {} as Profile
	}

	async function fetchProfileByHandle(handle: string): Promise<Profile> {
		const query: string = fetchProfileByHandleQuery(handle)

		// TODO: Fix any type
		const data: any = await client.request(query)

		if (data.Socials.Social) {
			const profile = data.Socials.Social[0]
			return profile
		}

		return {} as Profile
	}

	return {
		fetchAllProfilesByHandle,
		fetchProfileByAddress,
		fetchProfileByHandle
	}
}
