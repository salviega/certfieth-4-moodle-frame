export function fetchUserProfile(address: string): string {
  return `
    query GetFarcasterUserProfileByAddress {
      Socials(input: { filter: { userAssociatedAddresses: { _eq: "${address}" } }, blockchain: ethereum, limit: 50 }) {
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
