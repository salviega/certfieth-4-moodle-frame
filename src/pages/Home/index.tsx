import { useEffect, useState } from 'react'
import { LinkedinShareButton } from 'react-share'
import { useAccount } from 'wagmi'

import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
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
		<div className='flex flex-col items-center'>
			<div className='flex flex-col my-12'>
				{isLoading ? (
					<p>Loading...</p>
				) : address ? (
					profile ? (
						<div className='flex flex-col md:w-[600px] lg:flex-row lg:w-[1100px] justify-between items-center mx-auto gap-8'>
							<img
								className='size-96 rounded-full'
								src={profile.profileImage}
								alt='profile'
							/>
							<div className='flex flex-col w-full p-3 gap-3'>
								<p>{profile.profileDisplayName}</p>
								<p className='mb-3'>{`@${profile.profileHandle}`}</p>
								<p>{profile.profileBio}</p>
								<p>{profile.identity}</p>
								<p>{profile.location}</p>
								<div className='flex flex-row items-center gap-3'>
									<LinkedinShareButton url='https://www.npmjs.com/package/react-share'>
										<FontAwesomeIcon
											icon={faShareFromSquare}
											className='size-4 cursor-pointer hover:text-gray-600'
										/>
									</LinkedinShareButton>
									<p>{'|'}</p>
									<p className='border-b border-gray-400 cursor-pointer hover:text-gray-600'>
										{'Share me profile'}
									</p>
								</div>
							</div>
						</div>
					) : (
						<p>Your profile was not found, create a Farcaster account! 😢😢</p>
					)
				) : (
					<p>Connect your wallet to view your profile 🏄‍♀️ </p>
				)}
			</div>
		</div>
	)
}
