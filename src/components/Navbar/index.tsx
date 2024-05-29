import { NavLink } from 'react-router-dom'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar(): JSX.Element {
	return (
		<nav className='flex flex-col items-center w-full h-32 py-5 px-8 z-10 text-sm font-light'>
			<ul className='flex justify-between items-center w-full'>
				<li className='flex justify-between items-center gap-3'>
					<img
						className='rounded-full size-20'
						src='https://pbs.twimg.com/profile_images/1788729114792263680/DAJoQA6p_400x400.jpg'
						alt='logo'
					/>
					<NavLink className='font-semibold text-lg' to='/'>
						Home
					</NavLink>
				</li>
				<li>
					<ConnectButton />
				</li>
			</ul>
		</nav>
	)
}
