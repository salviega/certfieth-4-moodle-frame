import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'
import {
	faShareFromSquare,
	faShareNodes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
		<div className='mt-16 mx-24'>
			<div className='flex justify-between items-center gap-8 bg-slate-200'>
				{isLoading ? (
					<p>Loading...</p>
				) : address ? (
					profile ? (
						<>
							<img
								className='size-96 rounded-full'
								src={profile.profileImage}
								alt='profile'
							/>
							<div className='flex flex-col gap-3 w-full'>
								<p>{profile.profileDisplayName}</p>
								<p className='mb-3'>{`@${profile.profileHandle}`}</p>
								<p>{profile.profileBio}</p>
								<p>{profile.identity}</p>
								<p>{profile.location}</p>
								<div className='flex flex-row items-center gap-3'>
									<FontAwesomeIcon
										icon={faShareFromSquare}
										className='size-4 cursor-pointer hover:text-gray-600'
									/>
									<p>{'|'}</p>
									<p className='border-b border-gray-400 cursor-pointer hover:text-gray-600'>
										{'Share me profile'}
									</p>
								</div>
							</div>
						</>
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
