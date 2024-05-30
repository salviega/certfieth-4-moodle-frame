import { gql } from 'graphql-request'

export const fetchAllProfilesByHandleQuery = (handle: string) => {
	return gql`
		query GetAllProfilesByHandle {
			Socials(
				input: {
					filter: { profileName: { _regex: "${handle}" } }
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
				}
			}
		}
	`
}

export const fetchProfileByAddressQuery = (address: string) => {
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
			}
		}
	}
`
}

export const fetchProfileByHandleQuery = gql`
	query GetProfilesByHandle {
		Socials(
			input: {
				filter: { profileName: { _eq: $handle } }
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
			}
		}
	}
`
