import { Profile } from '@/models/profile.model'

type Props = {
	isLoading: boolean
	isUser: boolean
	profile: Profile
}

const mockCertificates = [
	{
		profileImage: 'https://path/to/chainlink_vrf_workshop.png',
		name: 'Chainlink Developer Expert: VRF Workshop Certification',
		issuer: 'Chainlink Labs'
	},
	{
		profileImage: 'https://path/to/chainlink_cross_chain_nft.png',
		name: 'Chainlink Developer Expert: Cross-Chain Dynamic NFT Certification',
		issuer: 'Chainlink Labs'
	},
	{
		profileImage: 'https://path/to/chainlink_ccip_masterclass.png',
		name: 'Chainlink Developer Expert: CCIP Masterclass Certification',
		issuer: 'Chainlink Labs'
	},
	{
		profileImage: 'https://path/to/chainlink_dyfs_price_feeds.png',
		name: 'Chainlink Developer Expert: DYFS Price Feeds Certification',
		issuer: 'Chainlink Labs'
	},
	{
		profileImage: 'https://path/to/ibm_data_science_python_level2.png',
		name: 'Applied Data Science with Python - Level 2',
		issuer: 'IBM'
	},
	{
		profileImage: 'https://path/to/ibm_data_visualization_python.png',
		name: 'Data Visualization Using Python',
		issuer: 'IBM'
	},
	{
		profileImage: 'https://path/to/ibm_data_analysis_python.png',
		name: 'Data Analysis Using Python',
		issuer: 'IBM'
	},
	{
		profileImage: 'https://path/to/ibm_data_science_foundations_level2.png',
		name: 'Data Science Foundations - Level 2 (V2)',
		issuer: 'IBM'
	},
	{
		profileImage: 'https://path/to/ibm_python_for_data_science.png',
		name: 'Python for Data Science',
		issuer: 'IBM'
	},
	{
		profileImage: 'https://path/to/ibm_data_science_methodologies.png',
		name: 'Data Science Methodologies',
		issuer: 'IBM'
	},
	{
		profileImage: 'https://path/to/ibm_data_science_foundations_level1.png',
		name: 'Data Science Foundations - Level 1',
		issuer: 'IBM'
	},
	{
		profileImage: 'https://path/to/ibm_data_science_tools.png',
		name: 'Data Science Tools',
		issuer: 'IBM'
	}
]

export default function Nfts(props: Props): JSX.Element {
	const { isLoading, profile } = props

	return (
		<div className='flex flex-col items-center my-8'>
			{isLoading ? (
				<p>Loading...</p>
			) : Object.keys(profile).length > 0 ? (
				<div className='flex flex-col md:w-[600px] lg:w-[1100px] mx-auto gap-8'>
					<p className=''>{`${mockCertificates.length} Certificates`}</p>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
						{mockCertificates.map((certificate, index) => (
							<div
								key={index}
								className='flex flex-col items-center p-2 border rounded-md border-gray-300'
							>
								<img
									className='size-48 mb-2 rounded-full'
									src={profile.profileImage}
									alt={`certificate-${index}`}
								/>
								<p className='text-center font-bold'>{certificate.name}</p>
								<p className='text-center text-gray-500'>
									{certificate.issuer}
								</p>
							</div>
						))}
					</div>
				</div>
			) : (
				<p>Profile was not found 😢😢</p>
			)}
		</div>
	)
}
