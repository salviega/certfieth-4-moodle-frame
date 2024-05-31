import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SyncLoader from 'react-spinners/SyncLoader'

import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar(): JSX.Element {
	const { fetchAllProfilesByHandle } = getRequests()

	const [input, setInput] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [profiles, setProfiles] = useState<Profile[] | []>([])

	const containerRef = useRef<HTMLDivElement | null>(null)

	const handleInputChange = async (handle: string) => {
		setInput(handle)
		if (handle.length > 2) {
			await searchProfile(handle)
		} else {
			setIsOpen(false)
			setProfiles([])
		}
	}

	const handleInputClick = async () => {
		if (input.length > 2) {
			setIsOpen(true)
		}
	}

	const selectProfile = (profile: Profile) => {
		console.log('profile: ', profile)
		setInput(profile.profileHandle)
		setIsOpen(false)
	}

	const searchProfile = async (handle: string) => {
		setIsOpen(true)
		setIsLoading(true)
		setProfiles(await fetchAllProfilesByHandle(handle))
		setIsLoading(false)
	}

	useEffect(() => {
		// TODO: Fix any type
		const handleClickOutside = (event: any) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<nav className='flex flex-col items-center w-full h-32 py-5 px-8 z-10 border-b-2 box-border shadow-md text-sm font-light'>
			<ul className='flex justify-around items-center w-full '>
				<li className='flex justify-between items-center size-20 w-max gap-6'>
					<Link to='/'>
						<img
							className='rounded-full size-20 hidden md:block'
							src='https://pbs.twimg.com/profile_images/1788729114792263680/DAJoQA6p_400x400.jpg'
							alt='logo'
						/>
					</Link>
					<div className='relative w-max cursor-pointer'>
						<div className='flex items-center w-32 md:w-48 lg:w-96'>
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
							/>
							<input
								className='w-full pl-10 pr-3 py-2 border rounded-md'
								placeholder='Discover other users with their handle'
								type='text'
								value={input}
								onChange={event => handleInputChange(event.target.value)}
								onClick={handleInputClick}
							/>
						</div>
						{isOpen && (
							<div
								ref={containerRef}
								className='absolute flex flex-col w-full pt-2 shadow rounded bg-white'
							>
								{isLoading ? (
									<button className='w-full h-14  m-auto border rounded-md text-center hover:bg-gray-100 md:justify-between md:pl-1 md:pr-5'>
										<SyncLoader
											color={'#e5e7eb'}
											size={10}
											speedMultiplier={0.8}
										/>
									</button>
								) : profiles.length > 0 ? (
									profiles.map((profile: Profile, index: number) => (
										<div key={index}>
											<button
												className='flex justify-center items-center w-full h-14  border rounded-md text-right hover:bg-gray-100 md:justify-between md:pl-1 md:pr-5'
												onClick={() => selectProfile(profile)}
											>
												<img
													src={profile.profileImage}
													alt={profile.profileName}
													className='size-12 rounded-lg hidden md:block'
												/>
												<div className='flex items-center w-ful gap-1 text-right'>
													<p>{profile.profileDisplayName}</p>
													<p className='hidden lg:inline'>{`(${profile.profileHandle})`}</p>
												</div>
											</button>
										</div>
									))
								) : (
									<button className='w-full h-14 pl-1 pr-5 border rounded-md text-right hover:bg-gray-100'>
										No results
									</button>
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
