import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { Profile } from '@/models/profile.model'
import { fetchUserProfile } from '@/queries'
import { useQuery } from '@airstack/airstack-react'

export default function Home(): JSX.Element {
	const { address } = useAccount()
	const [query, setQuery] = useState<string>('')
	const [profile, setProfile] = useState<Profile | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const { data, loading, error } = useQuery(query, {}, { cache: false })

	useEffect(() => {
		if (address) {
			setQuery(fetchUserProfile(address))
			setIsLoading(false)
		} else {
			setQuery('')
			setProfile(null) // Reset the profile if the address is not present.
			setIsLoading(false)
		}
	}, [address])

	useEffect(() => {
		if (data && !loading) {
			setProfile(data.Socials.Social[0])
		}
	}, [data, loading])
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
