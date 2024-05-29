import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { useQuery } from '@airstack/airstack-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { Profile } from './models/profile.model'
import { fetchUserProfile } from './queries'

import './App.css'

function App() {
	const { address } = useAccount()
	const [query, setQuery] = useState<string | null>(null)
	const [profile, setProfile] = useState<Profile | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const { data, loading, error } = useQuery(
		query,
		{},
		{ cache: false, skip: !query }
	)

	useEffect(() => {
		if (address) {
			setQuery(fetchUserProfile(address))
			setIsLoading(false)
		} else {
			setQuery(null)
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
		<>
			<h1>CertifiETH for Moodle</h1>
			<div className='card'>
				<ConnectButton />
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
						<p>No profile found</p>
					)
				) : (
					<p>Connect your wallet to view your profile</p>
				)}
			</div>
		</>
	)
}

export default App
