import { useEffect, useState } from 'react'
import { LinkedinShareButton } from 'react-share'
import { useAccount } from 'wagmi'

import { getRequests } from '@/graphql/requests'
import { Profile } from '@/models/profile.model'
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Home(): JSX.Element {
	return (
		<div className='flex flex-col items-center'>
			<div className='flex flex-col my-12'>
				<p>That is the home</p>
			</div>
		</div>
	)
}
