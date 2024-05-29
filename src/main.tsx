import React from 'react'
import ReactDOM from 'react-dom/client'

import { init } from "@airstack/airstack-react";

import App from './App.tsx'

import './index.css'

const apiKey: string = import.meta.env.VITE_AIRSTACK_API_KEY

if (!apiKey) {
	throw new Error('Missing VITE_AIRSTACK_API_KEY in .env')
}

init(apiKey);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
