import { BrowserRouter, useRoutes } from 'react-router-dom'

import Layout from '@/components/Layout'

import Home from '../Home'

import './App.css'

function AppRoutes() {
	const routes = useRoutes([
		{
			path: '/',
			element: <Home />
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
