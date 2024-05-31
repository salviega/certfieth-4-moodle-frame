import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LinkedinShareButton } from 'react-share'
import { useAccount } from 'wagmi'

import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function User(): JSX.Element {
	const { fetchProfileByHandle } = getRequests()

	const { handle } = useParams()

	const { address } = useAccount()
	const [profile, setProfile] = useState<Profile | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isUser, setIsUser] = useState<boolean>(false)

	const fetchProfile = async () => {
		if (handle) {
			const profile = await fetchProfileByHandle(handle)

			console.log(profile)

			if (address && profile.userAssociatedAddresses.length > 0) {
				const isAddressAssociated: boolean = profile.userAssociatedAddresses
					.map((associatedAddress: string) => associatedAddress.toLowerCase())
					.includes(address.toLowerCase())

				setProfile(profile)
				setIsUser(isAddressAssociated)
			} else {
				setProfile(profile)
				setIsUser(false)
			}

			setIsLoading(false)
		} else {
			setProfile(null)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchProfile()
	}, [address, handle])

	return (
		<div className='flex flex-col items-center'>
			<div className='flex flex-col items-center my-8'>
				{isLoading ? (
					<p>Loading...</p>
				) : profile?.id ? (
					<div className='flex flex-col md:w-[600px] lg:flex-row lg:w-[1100px] items-center mx-auto gap-8'>
						<img
							className='size-96 mr-3 rounded-full'
							src={profile.profileImage}
							alt='profile'
						/>
						<div className='flex flex-col p-3 gap-3'>
							<p>{profile.profileDisplayName}</p>
							<p className='mb-3'>{`@${profile.profileHandle}`}</p>
							<p>{profile.profileBio}</p>
							<p>{profile.identity}</p>
							<p>{profile.location}</p>
							{isUser && (
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
							)}
						</div>
					</div>
				) : (
					<p>Profile was not found 😢😢</p>
				)}
			</div>
		</div>
	)
}
