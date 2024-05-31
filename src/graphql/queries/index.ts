import { gql } from 'graphql-request'

export const fetchAllProfilesByHandleQuery = (handle: string): string => {
	return gql`
		query GetAllProfilesByHandle {
			Socials(
				input: {
					filter: { profileName: { _regex: "${handle}" } }
					blockchain: ethereum
					limit: 6
				}
			) {
				Social {
					id
					location
					profileBio
					profileName
					profileImage
					profileHandle
					profileDisplayName
					userAddress
					userAssociatedAddresses
				}
			}
		}
	`
}

export const fetchProfileByAddressQuery = (address: string): string => {
	return gql`
	query GetProfileByAddress {
		Socials(
			input: {
				filter: {
					userAssociatedAddresses: {
						_eq: "${address}"
					}
				}
				blockchain: ethereum
			}
		) {
			Social {
				id
				location
				profileBio
				profileName
				profileImage
				profileHandle
				profileDisplayName
				userAddress
				userAssociatedAddresses
			}
		}
	}
`
}

export const fetchProfileByHandleQuery = (handle: string): string => {
	return gql`
		query GetProfilesByHandle {
			Socials(
				input: {
					filter: { profileName: { _eq: "salviega" } }
					blockchain: ethereum
					limit: 50
				}
			) {
				Social {
					id
					location
					profileBio
					profileName
					profileImage
					profileHandle
					profileDisplayName
					userAddress
					userAssociatedAddresses
				}
			}
		}
	`
}
