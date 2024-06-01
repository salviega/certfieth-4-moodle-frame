import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Bio from '@/components/User/Bio'
import Nfts from '@/components/User/Nfts/Nfts'
import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'

const initialProfile: Profile = {
	id: '',
	identity: '',
	location: '',
	profileBio: '',
	profileDisplayName: '',
	profileHandle: '',
	profileImage: '',
	profileName: '',
	userAssociatedAddresses: []
}

export default function User(): JSX.Element {
	const { fetchProfileByHandle } = getRequests()

	const { handle } = useParams()

	const { address } = useAccount()

	const [profile, setProfile] = useState<Profile>(initialProfile)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isUser, setIsUser] = useState<boolean>(false)

	const fetchProfile = async () => {
		if (handle) {
			const profile = await fetchProfileByHandle(handle)
			console.log(profile)

			if (address && Object.keys(profile).length > 0) {
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
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchProfile()
	}, [address, handle])

	return (
		<div className='flex flex-col items-center'>
			<Bio isLoading={isLoading} isUser={isUser} profile={profile} />
			<Nfts isLoading={isLoading} isUser={isUser} profile={profile} />
		</div>
	)
}
