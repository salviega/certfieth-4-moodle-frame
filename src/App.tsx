import {  useEffect, useState } from 'react'

import reactLogo from '@/assets/react.svg'
import viteLogo from '@/assets/vite.svg'
import { useQuery } from "@airstack/airstack-react";

import { Profile } from './models/profile.model';
import { QueryResponse } from './models/query-response.model';
import { fetchUserProfile, query } from './queries';

import './App.css'

function App() {
	const [count, setCount] = useState(0)
	const query: string = fetchUserProfile("0xd7A4467a26d26d00cB6044CE09eBD69EDAC0564C");
  const { data, loading, error }: QueryResponse = useQuery<Data>(query, {}, { cache: false });
	const [profile, setProfile] = useState<Profile | null>(null);

	useEffect(() => {
		if (data) {
			setProfile(data.Socials.Social[0]);
		}
	}, [data]);

	return (
		<>
			<div>
				<a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank' rel='noreferrer'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
			{
				loading && <p>Loading...</p>
			}
			{
				error && <p>Error: {error.message}</p>
			}
			{
				profile && (
					<div>
						<h2>{profile.profileName}</h2>
						<p>{profile.id}</p>
						<p>{profile.identity}</p>
						<p>{profile.location}</p>
						<p>{profile.profileBio}</p>
						<p>{profile.profileHandle}</p>
						<p>{profile.profileDisplayName}</p>
						<img src={profile.profileImage} alt={profile.profileName} />
					</div>
				)
			}
			</div>
		</>
	)
}

export default App
