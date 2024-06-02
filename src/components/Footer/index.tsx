import { Link } from 'react-router-dom'

export default function Footer() {
	return (
		<footer className='flex flex-col items-center py-3 px-8 z-10 border-t-2 text-sm font-light'>
			<ul className='flex flex-col items-end w-[1100px] gap-4'>
				<div className='flex flex-wrap items-center gap-4'>
					<li>
						<Link to='/request-demo'>Request Demo |</Link>
					</li>
					<li>
						<Link to='/about'>About |</Link>
					</li>
					<li>
						<Link to='/terms'>Terms |</Link>
					</li>
					<li>
						<Link to='/privacy'>Privacy |</Link>
					</li>
					<li>
						<Link to='/developers'>Developers |</Link>
					</li>
					<li>
						<Link to='/support'>Support |</Link>
					</li>
				</div>
				<div className='flex flex-wrap items-center gap-4'>
					<li>
						<Link to='/cookies'>Cookies |</Link>
					</li>
					<li>
						<Link to='/do-not-sell-my-info'>
							Do Not Sell My Personal Information
						</Link>
					</li>
				</div>
				<div className='flex flex-wrap items-center gap-4'>
					<a
						href='https://www.apple.com/app-store/'
						target='_blank'
						rel='noopener noreferrer'
					>
						<img
							className='rounded-full size-20'
							src='https://pbs.twimg.com/profile_images/1788729114792263680/DAJoQA6p_400x400.jpg'
							alt='logo'
						/>
					</a>
					<a
						href='https://www.apple.com/app-store/'
						target='_blank'
						rel='noopener noreferrer'
					>
						<img
							className='rounded-full size-20'
							src='https://pbs.twimg.com/profile_images/1788729114792263680/DAJoQA6p_400x400.jpg'
							alt='logo'
						/>
					</a>
				</div>
			</ul>
		</footer>
	)
}
