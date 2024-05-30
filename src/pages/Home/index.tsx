import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'

export default function Home(): JSX.Element {
	const { fetchProfileByAddress } = getRequests()

	const { address } = useAccount()
	const [profile, setProfile] = useState<Profile | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const fetchProfile = async () => {
		if (address) {
			setProfile(await fetchProfileByAddress(address))
			setIsLoading(false)
		} else {
			setProfile(null)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchProfile()
	}, [address])

	return (
		<div className='f'>
			<h1 className='my-10 text-left'>CertifiETH for Moodle</h1>
			<div>
				{isLoading ? (
					<p>Loading...</p>
				) : address ? (
					profile ? (
						<div>
							<p>{profile.id}</p>
							<p>{profile.identity}</p>
							<p>{profile.location}</p>
							<p>{profile.profileBio}</p>
							<p>{profile.profileHandle}</p>
							<p>{profile.profileDisplayName}</p>
							<img src={profile.profileImage} alt={profile.profileName} />
						</div>
					) : (
						<p>Your profile was not found, create a Farcaster account! 💥</p>
					)
				) : (
					<p>Connect your wallet to view your profile</p>
				)}
			</div>
		</div>
	)
}
