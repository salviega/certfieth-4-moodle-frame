import { useRef } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import { SiweMessage } from 'siwe'

import { config } from '@/config/config'
import { fetchNonceData } from '@/services/nonce.service'
import {
	Attestation,
	AttestationDelegationSignature,
	delegateSignAttestation,
	EvmChains
} from '@ethsign/sp-sdk'
import { getChainId } from '@wagmi/core'

export default function Home(): JSX.Element {
	const { getNonce, installPlugin } = fetchNonceData()

	const chainId = getChainId(config)

	const badgetRef = useRef<null | File>(null)
	const certificateRef = useRef<null | File>(null)

	const getSignature = async () => {
		const provider: ethers.BrowserProvider = new ethers.BrowserProvider(
			window.ethereum
		)
		const signer: ethers.JsonRpcSigner = await provider.getSigner()
		const address: string = await signer.getAddress()

		const domain: string = 'Seal'

		const statement: string =
			'you must sign a message in your wallet to verify that you are the owner or manager of one account'

		const uri: string = 'https://sealweb3.com'

		const version: string = '1'

		const nonce: string = await getNonce(address)

		const siweMessage: SiweMessage = new SiweMessage({
			domain,
			address,
			statement,
			uri,
			version,
			chainId,
			nonce
		})

		const message: string = siweMessage.prepareMessage()
		const signature: string = await signer.signMessage(message)

		// const signerAddress: string = ethers.verifyMessage(message, signature)

		const result = await installPlugin(message, nonce, address, signature)
		console.log(result)
	}

	const attestOrganization = async () => {
		await window.ethereum.request({ method: 'eth_requestAccounts' })

		const provider: ethers.BrowserProvider = new ethers.BrowserProvider(
			window.ethereum
		)
		const signer: ethers.JsonRpcSigner = await provider.getSigner()
		const address: string = await signer.getAddress()

		const attestation = JSON.stringify({
			schemaId: '0xa8',
			validUntil: 0,
			recipients: [address],
			indexingValue: '',
			data: {
				name: 'Educateth',
				description:
					'Educaeth es una alternativa innovadora para la educación en desarrollo Onchain. Ofrece cursos independientes y de alta calidad, especializados en el desarrollo de aplicaciones descentralizadas (dApps) en Ethereum y sus capas dos. Su objetivo es proporcionar una formación sólida y práctica para aquellos interesados en el ecosistema blockchain',
				website: 'www.educateth.com',
				linkedAttestationId: '0x147'
			}
		} as Attestation)

		const info: AttestationDelegationSignature = await delegateSignAttestation(
			JSON.parse(attestation),
			{
				chain: EvmChains.arbitrumSepolia
			}
		)

		const attestationDto = {
			attestationDto: info.attestation,
			signatureDto: info.delegationSignature,
			profileDto: {
				name: 'Educateth',
				managers: [
					'0x2f23d7d2C0842a80742610dc1B729cC41Eb9AF8d',
					'0x47Cc9Ae1B382B4B6db3cAA500F78208490eB9Ce9',
					'0xd7A4467a26d26d00cB6044CE09eBD69EDAC0564C'
				]
			}
		}

		console.log(
			await axios.post(
				'http://localhost:3000/attestations/attestOrganizationInDelegationMode',
				attestationDto
			)
		)
	}

	const attestCourse = async () => {
		try {
			if (!badgetRef && !certificateRef) {
				throw new Error('')
			}

			// const badgetFile = badgetRef.current.files[0]
			// const certificateFile = certificateRef.current.files[0]

			const participants: string[] = ['Miguel Santamaría', 'Juan Pablo Vesga']

			const wallets: string[] = [
				'0x5388E0833b9A58209Ca959fd9d00B3b173Bc3313',
				'0x5808D9bcDE9337f675E75F9a5D7024CC10e70962'
			]

			const profileIdDto: string =
				'0x4755ef0b5a34cd2cf7265e58f5d19525d2d9d9ef3293222a9a707366655948c4'

			const formCourseDto: FormData = new FormData()
			// formCourseDto.append('badget', badgetFile)
			// formCourseDto.append('certificate', certificateFile)
			formCourseDto.append('name', 'Desarrollo de Aplicaciones Onchain Parte I')
			formCourseDto.append(
				'description',
				'El curso «Desarrollo de Aplicaciones Onchain Parte I» tuvo una duración de siete semanas, desde el 7 de marzo hasta el 9 de mayo de 2024. Con más de 20 horas y 10 sesiones de formación intensiva, se centró en la enseñanza de la sintaxis de Solidity y conceptos esenciales de blockchain, proporcionando una comprensión sólida del ecosistema Ethereum y sus capas dos'
			)
			formCourseDto.append('participants', JSON.stringify(participants))
			formCourseDto.append('wallets', JSON.stringify(wallets))

			await window.ethereum.request({ method: 'eth_requestAccounts' })

			const attestation = JSON.stringify({
				schemaId: '0xaa',
				validUntil: 0,
				recipients: wallets,
				indexingValue: '',
				data: {
					name: 'Desarrollo de Aplicaciones Onchain Parte I',
					description:
						'El curso «Desarrollo de Aplicaciones Onchain Parte I» tuvo una duración de siete semanas, desde el 7 de marzo hasta el 9 de mayo de 2024. Con más de 20 horas y 10 sesiones de formación intensiva, se centró en la enseñanza de la sintaxis de Solidity y conceptos esenciales de blockchain, proporcionando una comprensión sólida del ecosistema Ethereum y sus capas dos',
					duration: '20 horas',
					location: 'Online',
					partners: ['blah, blah, blah...'],
					linkedAttestationId: '0x14a'
				}
			} as Attestation)

			const info: AttestationDelegationSignature =
				await delegateSignAttestation(JSON.parse(attestation), {
					chain: EvmChains.arbitrumSepolia
				})

			const formAttestationCourseDto = new FormData()
			formAttestationCourseDto.append(
				'attestationDto',
				JSON.stringify(info.attestation)
			)
			formAttestationCourseDto.append(
				'signatureDto',
				JSON.stringify(info.delegationSignature)
			)
			formAttestationCourseDto.append('profileIdDto', profileIdDto)

			formCourseDto.forEach((value, key) => {
				formAttestationCourseDto.append(key, value)
			})

			console.log(
				await axios.post(
					'http://localhost:3000/attestations/attestCourseInDelegationMode',
					formAttestationCourseDto,
					{ headers: { 'Content-Type': 'multipart/form-data' } }
				)
			)
		} catch (error) {
			console.error('error', error)
		}
	}

	const attestCourseForUs = async () => {
		try {
			const wallets: string[] = [
				'0xE483d015b4fBC9aC794E3d3a222349EE78FD1315',
				'0x64F6a37bA229c46F583c69f4DA5cFD4FFF95c942',
				'0x2e0150B16ACD928eB5ddad19Eb33899887D6A932',
				'0xeF05CBeAa20cA7d1Edd8A8122dFC4D5EC6f0FD30',
				'0x6a49d656aDBA21bD273F8C5EC99bb24926f8E6F8',
				'0x33615D58d6C20d5e6414218Be166db3108d7e5b4',
				'0x341f4ab31e167A1D2e9DA53b4C454f1629B7503D',
				'0x087f9545Dad969C6b806C40E08E7D45c72D0C676',
				'0xf3a443E02e43874A5eBdf252fda444F95091DF24',
				'0xdd7bA7c1E6a86c1312a261F6c3ffBE47237dcB7c',
				'0x11c633F3875b63d371c1dfBB1555CCC5580244a6',
				'0xa4624f8f0fB8D937a8923D07BF430538759BFa11',
				'0x73243166c10FBe5Bd8bD34d868aF8656C4Be3682',
				'0x6f8513cd8F7b7E7Fb7DfEbecA2cCaE88db1a750c',
				'0x8227e8003faee70ac0c57D2963364F162f899cB0',
				'0x2C0a6A17D7214a00D12a8977958BC664f875796e',
				'0xC5703205573B110eEb8614FCA5Fb1770E1F44D97',
				'0x5a1d89f0c177Fa9825E1fD700bB989E7BDeae404',
				'0x73336B19F27BD125dC6e1D013CDC8d4df47210a2',
				'0xC9a16496bDB646C5f8b9a545b3e0A7aE1c5eF51a',
				'0x30035cb58C23a7885538F4cC60002C727dE57689',
				'0xa959D138507a2935472af947B4620Ca24509AEC2',
				'0x77a9d85f66ce75834B5113bBe10c23f9DfFe8831',
				'0xdC941AcFD48A9644B7D52E528589bA8169A0303E',
				'0x6a33428565af2ffeed6f642cc4f5a0af5021293f',
				'0x9877D8917AC9212452548239aC2ffD510eD3CfBF',
				'0xbbb8A16cb32407f1f094F6475Ac38C9A210a194F',
				'0x1762635aB49aF4580BB16E69a40ac4e5BFd0003A',
				'0x14B4e4DfD330308daA31a301cB9bA9D39E6409a5',
				'0xa2adc5389db14912873d312066543B3408C01bcf',
				'0x806284c368Cc1067018881d1D6321da3668A880C',
				'0x6D64863924DC9d4A812b970fd8Df88fCcC6D8d63',
				'0xe2EEdce7D94C1eb78635573f35974Ce9d2aA99cD',
				'0xd8107aD18896a5e0F0F165Ca858B2135F42CBB03',
				'0x1Df6d190e4b1D2Bb9fDC7aBCd1B2Bb900b85031B',
				'0x2120f4EE2D6500E856d6C2997D1D06B8F9a8D8DF',
				'0x96ad9cdf1335B0d953f6bc5654E72a9809fB1705',
				'0xA920c968e3580413939099B13eff82e7628E10Db',
				'0x4346fC2Dafe7B80193418A8ee15897C352a9EEde',
				'0xa7905d790c42E401CECA5264034c70a0F37C33f5',
				'0x38A322dEE92C91ecf471BA5F7891609fa415593E',
				'0x6F70880ca1427D1C8A23eF1eAA6c3e729257a98f',
				'0xC9B3De2c46F3a308eE531b7160D807E862142cA4',
				'0x792C08aF5Ecd2EA1534E6825bBD54765C76380a1',
				'0x359fe9F1dB6937468F2EAF39974611de47FD7C3B',
				'0x5C8531648efD0bADd3A7BE78407DCFc1D5fa1399',
				'0xD8C47c2F6CAE8944880B6186c4e3A35bF60F1749',
				'0xC17abc4bb41de0EbBCa0A28Cec96b7d375055815',
				'0x39cc2AE82E5cfc136865FAE4bbf8d010DF093dAc',
				'0x69e6dAe73970BAc81766D6013813FF4e535b1076',
				'0x535e6559D7Ae57eB72664Ba5e7E829Aa42f0C425',
				'0xcf5FCD84061fE275e989d348d7337176aA64d946',
				'0x8bC84cbeD95796c0e7d2304409Cc4aA87e76aA4a',
				'0x5600719bfB0131220a15de44eC218bF754770b70',
				'0xe472402CCC81a849594B591A522A69AbfE5b0713',
				'0x9078d38e512a68d6E6Cf26D413C02F88789Cc720',
				'0x869B44201589f23E7a3f5dc33484F1A7cC33CB44',
				'0xE13969da1BD8A47e44f3CFF8fE8f284909028e41',
				'0x3C5a771d3d7115545461b03D322f0a28DE640f93',
				'0x74f67D6d4f19865D93CD117907cB5A0af896E14F',
				'0xb1831aD68881F7dB0baA03c530dDcC42556B81D4',
				'0x0a01302552bD416822533D6Ff1058585f6846eBA',
				'0x64d97618aD7667bffacd87D42946B31b18FbEE05',
				'0x0EE62a79411E5c84087D6637B8b3b6390bdFCA10',
				'0x3A3E5C62c269E5ac33f699cD1fDD4B348944401b',
				'0x68aDbec12f62af834E9F6f41B0d3Edc49a75c07e',
				'0x395CF5CC9Eae9Ac0d51Dc527688fCab5d6f4c3EE',
				'0xb31321E6Ec4F53f68fe31bbF21494e82397DC601',
				'0x605b7A0437a6397676B33fD343A38979cD53b123',
				'0x6b43F09139d7B99808fFeDD541C02561d4084b5b',
				'0xb92D3753E8a2587813f75FBdEf9D81931Ce79c7F',
				'0xb47Ad9E54db2782094F026207603E9A653f3D6F0',
				'0xfCf498Fa73DeA14D957eebCbA1D8d4EB13567766',
				'0xb80738304A7E42D488016e8eCEF61242CeA2414D',
				'0x4CcBc99296a552120A9b823eae5f5449A7cF4A89',
				'0x556253f79aCafdC09c4907b1aDA4b60d1B6B8A03',
				'0xe7919bcB423d7454ebACf22b8952AA39b88E57cC',
				'0x63D284801Ef36D0886748bBC242F9BA6525eB2e9'
			]

			const uris: string[] = [
				'https://gateway.lighthouse.storage/ipfs/bafkreihm5uujmfevl6bhtg2ebniwcpgvczcc3fre5ubv5kl22kjqykksfi',
				'https://gateway.lighthouse.storage/ipfs/bafkreiebp26jrex2jwjbt6vavqgkdzv7sd6saqazzdwmjnrg7llowa4rk4',
				'https://gateway.lighthouse.storage/ipfs/bafkreihfry55vgx3u2ays3qg3vjuj3qak2fkidwuvxxispye32pykvj6pq',
				'https://gateway.lighthouse.storage/ipfs/bafkreihy6rabjbl357bagnwycx5errbuclzs2ispyaac67qmsjhgainzne',
				'https://gateway.lighthouse.storage/ipfs/bafkreidfsgy73dfk7l6sqmrd4iuqjgbaf3tftoijtkwoqymcoebdsfvngq',
				'https://gateway.lighthouse.storage/ipfs/bafkreibli2nhj3w6nnysplcutaqxtplvdzhzzei25y6d6lf7wztcvrwl4y',
				'https://gateway.lighthouse.storage/ipfs/bafkreid2i5czgljvlpnz3hvbgxyvhmxpycejrv7prnr77cbkv4uvz52a6q',
				'https://gateway.lighthouse.storage/ipfs/bafkreib5jrk6qhtpk2d7uqbakyxbufrwnmgsmfmb7wqsykr524iz4najyy',
				'https://gateway.lighthouse.storage/ipfs/bafkreieuywhdznaqyzgx3efewwfw4xdk3bgklyz3vrsl33lohtholzgl4m',
				'https://gateway.lighthouse.storage/ipfs/bafkreidyizg4ly7fbq7r4tp4z4cu5gjwjlezk7jx75gar6wggcc3xtqg3m',
				'https://gateway.lighthouse.storage/ipfs/bafkreic4k4ll2xwv6ziov2rid7gbcr35r3kmg3metffbxfw5ermav5ztmy',
				'https://gateway.lighthouse.storage/ipfs/bafkreibncf3p2522jnqynwprktxbnmwcvi3a2xqbtcncly42ycng7evv7y',
				'https://gateway.lighthouse.storage/ipfs/bafkreifsobmc4lusezbuwbauhpdfaytjfjvi2zsfjeo2lw75uskiskpftq',
				'https://gateway.lighthouse.storage/ipfs/bafkreidrbdsu7ofx3um4tlochurvrjj6afi6ee5xlptrf7xeefjnjfzoga',
				'https://gateway.lighthouse.storage/ipfs/bafkreiag64mlhwko3x2qp3g3ibrc5hseos4zn4yeskip7tt3id3qvfvo5q',
				'https://gateway.lighthouse.storage/ipfs/bafkreiaa4ydgaenwdnagy366hutb4pe4vvyecqmxtkuexu5gpw5cjk5ht4',
				'https://gateway.lighthouse.storage/ipfs/bafkreibbupm5vb3fu6smsjwvzzelhtvgaabcyqjnffzwv2uukjsohpu5g4',
				'https://gateway.lighthouse.storage/ipfs/bafkreifj2m4xw26bosutb4ywpqiccw5anf4dtcswzcvkvxcmh5jlw5t45i',
				'https://gateway.lighthouse.storage/ipfs/bafkreid53r6rhe5ftshuam573brsmtm5n7novgdtx337f6ghj53wnp5eze',
				'https://gateway.lighthouse.storage/ipfs/bafkreicb7hpwuknlk6lc5zpqs7ifezghr54vp4h6aqpvgdcgljhzz6uc2u',
				'https://gateway.lighthouse.storage/ipfs/bafkreiety3mpsopvtfeu3xpgwaxpkbokq3argezhfzl2nzuvlahaz7pbyq',
				'https://gateway.lighthouse.storage/ipfs/bafkreieyc26smbx2uvyg6ozlwzofqzmz4pqkhb5cc4cklpios5bruyxwi4',
				'https://gateway.lighthouse.storage/ipfs/bafkreihubbcb6alsv5mzd4pvpk5czj2r4vonsdagb6vqx3mmatpg3bvery',
				'https://gateway.lighthouse.storage/ipfs/bafkreifrmgeoqeintwbfyz4ws3uxy3ofnbcerppjgh7vkohrhgvjfjb2ey',
				'https://gateway.lighthouse.storage/ipfs/bafkreif2y27xh64jta7tcoxz7jqg2u3hedc634lmpftizunl56amlwm3de',
				'https://gateway.lighthouse.storage/ipfs/bafkreidfp5wwjnk5ib4kjfhn4m6vfv5wlikupwyntutea5vhnwzwxxdhjq',
				'https://gateway.lighthouse.storage/ipfs/bafkreibyqc2ucjwss4vgj3vxznutxjgxrzreyj64vkiq2uoqt7265rdwbe',
				'https://gateway.lighthouse.storage/ipfs/bafkreidxxkrerlxp2mr2nult5zsdde7v2osbyc2igofqgpeivyt6ln4vtm',
				'https://gateway.lighthouse.storage/ipfs/bafkreifqxmt7j5iwlo5a3op7kxvh57jjl6khqblxkgyoldanhnx5kt36q4',
				'https://gateway.lighthouse.storage/ipfs/bafkreia3wtfq5kpprrqxoxljwyxa2f6xuwvoomlwanbzncqgugjgh7cf6e',
				'https://gateway.lighthouse.storage/ipfs/bafkreiedhymzq5z2kvnbapfxgon6xufhw3sd7ya4v54xqxlhv5doqqx5z4',
				'https://gateway.lighthouse.storage/ipfs/bafkreibrcgdrzh3k6n7jnd44v5s3eofnsnhpbo2fpvevcfwrwnllu6w2qi',
				'https://gateway.lighthouse.storage/ipfs/bafkreievoa6edan3umqwurxeft65z33why2xskitdpxeorkeyv6gznkcqu',
				'https://gateway.lighthouse.storage/ipfs/bafkreida3tfl22bvnit6xxiqpylw5qkn3ehnldiclpdus6n6lnwowfxyxe',
				'https://gateway.lighthouse.storage/ipfs/bafkreig43ucx7zifhymrvso634b3vojt4yyezzyru2bkorxq5y2javnypm',
				'https://gateway.lighthouse.storage/ipfs/bafkreifvonllh5tg6mjzolcripzd2x422w2pctrbz2g26v63f62a56rj24',
				'https://gateway.lighthouse.storage/ipfs/bafkreie3cliy34pkpigudgga2kuvtmhaojlsktmvpoazjoxuly3ihrz4rm',
				'https://gateway.lighthouse.storage/ipfs/bafkreicmwj2eszmhgbaozekl26qdxecdb66dy4hofgvrihh6szytmgyboi',
				'https://gateway.lighthouse.storage/ipfs/bafkreiccvvi5kluhujfk323drvtcudgcyzidzjphfj73k6mvrtmwb2yglu',
				'https://gateway.lighthouse.storage/ipfs/bafkreiax5tpjlgh3keobdpjgqtb5oefpbpxfmij7bsvrfcrww2lx2wlwcq',
				'https://gateway.lighthouse.storage/ipfs/bafkreidklmsu7ehieotavyc2goiigfxzggorbmigs3egayzz6gkkodbf5u',
				'https://gateway.lighthouse.storage/ipfs/bafkreigwiipbo57eaea5r3i2ovqscsluwhv5xix3jld27y5fyb74dkifqm',
				'https://gateway.lighthouse.storage/ipfs/bafkreibmuwbeeby2lrsomt3oxru3s47eyscopsgslkrbasjnibiy5zey7a',
				'https://gateway.lighthouse.storage/ipfs/bafkreigbmom3pasg5jqenltejbccmzfxke6d55v4mm46b6h6gjwhxszjge',
				'https://gateway.lighthouse.storage/ipfs/bafkreihx23gy2vgv5zdkzxatfc4nqp5yomaloaedybjkvwp2th6w2dchie',
				'https://gateway.lighthouse.storage/ipfs/bafkreigqdjtfaxvyai6ul3gpo6ygqf47r6sflmeganupvvuqflvv64ctre',
				'https://gateway.lighthouse.storage/ipfs/bafkreif7vxblu65lkgkcwcsklxj2jqhtk4q4ahi5ojqjwbrr3guwmomfte',
				'https://gateway.lighthouse.storage/ipfs/bafkreihbsamrj62kdyz3d6iy7a2i7vwl7a76fgzqwmkvd7qyowjbt6oxea',
				'https://gateway.lighthouse.storage/ipfs/bafkreibo7cwl3dszt5z7fpwr4jb4trllcj54hp2rucxipq7yxgmjr36dsa',
				'https://gateway.lighthouse.storage/ipfs/bafkreihaf62cbihg3yzavo7yolaxgfjhp33eguxipo46mox4qfrly2zstu',
				'https://gateway.lighthouse.storage/ipfs/bafkreibs5rzfdmdzcvlte6u5isaonixcfjxeh2sx3ja5jx2xcv7yxn2bba',
				'https://gateway.lighthouse.storage/ipfs/bafkreighcgvgmhprp75jcdnxoxuyudg44kuh2m7nx227f57cdbgj56dqb4',
				'https://gateway.lighthouse.storage/ipfs/bafkreidia23y637lff3jmw35rulabgiqrlmh7bucvbddb5cuorz36wmquu',
				'https://gateway.lighthouse.storage/ipfs/bafkreictcg7bus3rmrcbgx4sosfkoodhd64hvupyx5wp6r5zae4qcw6ys4',
				'https://gateway.lighthouse.storage/ipfs/bafkreidrb3zzfx5i4ftgzwkpdcu2jwcveadutfce5vc7hdd7aspggoty2i',
				'https://gateway.lighthouse.storage/ipfs/bafkreighlx44sbuzz6bxhhqh3xfj73p4vjlcnjyq3lrzam375h6tzxizoe',
				'https://gateway.lighthouse.storage/ipfs/bafkreicf73y6ixynfy6hvjwvzacvw7ts6sruen55iqlrxnkolaue7wm3ay',
				'https://gateway.lighthouse.storage/ipfs/bafkreibw6e7jivdr2hp6xrx5hyez5z5r6zmtwb73fzzuyua2x5vzbcbofm',
				'https://gateway.lighthouse.storage/ipfs/bafkreidglaylt6gimdt2aufu3ywxatjq4prhnb55xq5vtwp2ef6hv3ozde',
				'https://gateway.lighthouse.storage/ipfs/bafkreiebxzp2e3v5jj6lqzklkr2jgq4rt6opygndowtyhagdm5w7g3o7gi',
				'https://gateway.lighthouse.storage/ipfs/bafkreibdjxhmgpuq5sznibese2f45qgqbylipjstoxs7553figfghyfu3q',
				'https://gateway.lighthouse.storage/ipfs/bafkreiewozvppm4n2tzyaz2lllem23dmcn2aam3or7cpsktxrm464aifra',
				'https://gateway.lighthouse.storage/ipfs/bafkreigtkg3yetovpccas5l45jjae5x5h6rdsdytg3li7pmsec7jgzzzfu',
				'https://gateway.lighthouse.storage/ipfs/bafkreibavpms377dpkkrijzftztplryj52uuotrplryczrqbz5o7udghri',
				'https://gateway.lighthouse.storage/ipfs/bafkreibfknx5dnatjulxqmk2qd6hsf5yhlx657uyohxryc2ok74cwmy2uu',
				'https://gateway.lighthouse.storage/ipfs/bafkreige4li5t2s3u6ex4tkud4mlekcqbbstfi33aiqhfttdpl5ctlxpbm',
				'https://gateway.lighthouse.storage/ipfs/bafkreihkjhnld6teh63rp3imzckj35s3wqy5ocwmphcs3u5zhmipxsgvpy',
				'https://gateway.lighthouse.storage/ipfs/bafkreie2iksthxtbsdu2xczbdcnywquxu6lcp57d3pvvlcfhl43peudcuu',
				'https://gateway.lighthouse.storage/ipfs/bafkreidywq6umhperrbnwueb4sz33niyufskqr2jg3lchb5k4b5fcgdru4',
				'https://gateway.lighthouse.storage/ipfs/bafkreiblyc7pc4li6f3rpgxbn5d6mhg36vusacdsqpfxb6chzpjcyjovla',
				'https://gateway.lighthouse.storage/ipfs/bafkreiagh22wwqjujlu7med6wgx3jsm7bskf3eaklm7facxbdl7ts22jli',
				'https://gateway.lighthouse.storage/ipfs/bafkreifkdnl2gfowfhu53ypdgxpaptver6qu3yhzcimwjsfkltngywzo6i',
				'https://gateway.lighthouse.storage/ipfs/bafkreigv4l5c3hn75cdii3t5gwyivv3epc4mvkcmkrgsref5x7ev6x7baa',
				'https://gateway.lighthouse.storage/ipfs/bafkreig3m3xtrynjlxgjeh5gfds2aimecuv4vsm36u4dlir7qe7reuswku',
				'https://gateway.lighthouse.storage/ipfs/bafkreidpl4pmfrbcrifppcwk6gwj7kkarvn5ad43xjnv4dm562pwitvv2a',
				'https://gateway.lighthouse.storage/ipfs/bafkreibwpzc4ch4ffcdhctxmkgcvwwcigv4npgfdux67x54e3x3rvrmg6u',
				'https://gateway.lighthouse.storage/ipfs/bafkreids24asc2waecdap4tli3jcsl3dbpdbwtnocbvgr4ox73xeuoc44i',
				'https://gateway.lighthouse.storage/ipfs/bafkreihhsxgt2wjjd74sygwnkryrijf3femryjgy2e5t4y6zo55ouui6ye'
			]

			const courseDto = {
				wallets,
				uris
			}

			const profileIdDto: string =
				'0xa1af6e748ea8dd95586576458d55bbd2175762db301cbc0955666622b995038a'

			await window.ethereum.request({ method: 'eth_requestAccounts' })

			const attestation = JSON.stringify({
				schemaId: '0x6',
				validUntil: 0,
				recipients: wallets,
				indexingValue: '',
				data: {
					name: 'Desarrollo de Aplicaciones Onchain Parte I',
					description:
						'El curso «Desarrollo de Aplicaciones Onchain Parte I» tuvo una duración de siete semanas, desde el 7 de marzo hasta el 9 de mayo de 2024. Con más de 20 horas y 10 sesiones de formación intensiva, se centró en la enseñanza de la sintaxis de Solidity y conceptos esenciales de blockchain, proporcionando una comprensión sólida del ecosistema Ethereum y sus capas dos',
					duration: '20 horas',
					location: 'Online',
					partners: [
						'Ethereum Foundation, Arbitrum Foundation, UxTic, Ethereum Bogotá'
					],
					linkedAttestationId: '0x4'
				}
			} as Attestation)

			const info: AttestationDelegationSignature =
				await delegateSignAttestation(JSON.parse(attestation), {
					chain: EvmChains.arbitrumSepolia
				})

			const formAttestationCourseDto = {
				attestationDto: info.attestation,
				signatureDto: info.delegationSignature,
				profileIdDto,
				courseDto
			}

			await axios.post(
				'http://localhost:3000/attestations/attestCourseInDelegationModeForUs',
				formAttestationCourseDto
			)

			console.log('💥 Done')
		} catch (error) {
			console.error('error', error)
		}
	}

	return (
		<div className='flex flex-col items-center'>
			<div className='flex flex-col items-center gap-3 my-12'>
				<p>That is the home</p>
				<button
					className='h-14  w-48 bg-slate-200 rounded-md p-3 hover:bg-slate-300'
					onClick={attestOrganization}
				>
					Attest Organization
				</button>
				{/* <input ref={badgetRef} type='file' />
				<input ref={certificateRef} type='file' /> */}
				<button
					className='h-14 w-48 bg-slate-200 rounded-md p-3 hover:bg-slate-300'
					onClick={attestCourse}
				>
					Attest Course
				</button>

				<button
					className='h-14 w-48 bg-slate-200 rounded-md p-3 hover:bg-slate-300'
					onClick={attestCourseForUs}
				>
					Attest Course for US
				</button>

				<button
					className='h-14 w-48 bg-slate-200 rounded-md p-3 hover:bg-slate-300'
					onClick={getSignature}
				>
					get Signature
				</button>
			</div>
		</div>
	)
}
