import { BrowserRouter, useRoutes } from 'react-router-dom'

import Layout from '@/components/Layout'

import Home from '../Home'
import User from '../User'

import './App.css'

function AppRoutes() {
	const routes = useRoutes([
		{
			path: '/',
			element: <Home />
		},
		{
			path: '/users/:handle',
			element: <User />
		},
		{
			path: '/*',
			element: <Home />
		}
	])

	return routes
}

function App() {
	return (
		<>
			<BrowserRouter>
				<Layout appRoutes={<AppRoutes />} />
			</BrowserRouter>
		</>
	)
}

export default App
