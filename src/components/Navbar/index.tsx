import { Link, NavLink } from 'react-router-dom'

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar(): JSX.Element {
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
						<FontAwesomeIcon
							icon={faMagnifyingGlass}
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
						/>
						<input
							className='w-full pl-10 pr-3 py-2 border rounded-md'
							type='text'
							placeholder='Discover badges, skills or organizations'
						/>
					</div>
				</li>
				<li>
					<ConnectButton />
				</li>
			</ul>
		</nav>
	)
}
