import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar(): JSX.Element {
	const { fetchAllProfilesByHandle } = getRequests()

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [input, setInput] = useState<string>('')
	const [profiles, setProfiles] = useState<Profile[] | []>([])

	const handleInputChange = (handle: string) => {
		setInput(handle)
		if (handle.length > 0) {
			searchProfile(handle)
		} else {
			setIsOpen(false)
		}
	}

	const searchProfile = async (handle: string) => {
		setIsLoading(true)
		setProfiles(await fetchAllProfilesByHandle(handle))
		setIsOpen(true)
		setIsLoading(false)
	}

	return (
		<nav className='flex flex-col items-center w-full h-32 py-5 px-8 z-10 border-b-2 box-border shadow-md text-sm font-light'>
			<ul className='flex justify-around items-center w-full '>
				<li className='flex justify-between items-center w-max gap-6'>
					<Link to='/'>
						<img
							className='rounded-full size-20'
							src='https://pbs.twimg.com/profile_images/1788729114792263680/DAJoQA6p_400x400.jpg'
							alt='logo'
						/>
					</Link>
					<div className='relative w-96 cursor-pointer'>
						<div className='flex items-center mb-3'>
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
							/>
							<input
								className='w-full pl-10 pr-3 py-2 border rounded-md'
								type='text'
								placeholder='Discover other users with their handle'
								onChange={event => handleInputChange(event.target.value)}
							/>
						</div>
						{isOpen && (
							<div className='absolute flex flex-col w-full py-2 gap-3 shadow rounded bg-white'>
								{profiles.length > 0 ? (
									profiles.map((profile: Profile) => (
										<p
											key={profile.id}
											className='w-full pr-5 text-right hover:bg-gray-100'
										>
											{profile.profileHandle}
										</p>
									))
								) : (
									<p>No profiles found</p>
								)}
							</div>
						)}
					</div>
				</li>
				<li>
					<ConnectButton />
				</li>
			</ul>
		</nav>
	)
}
