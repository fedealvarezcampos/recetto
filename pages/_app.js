import { useState, useEffect } from 'react';
import { isMobile as mobile } from 'react-device-detect';
import SessionContext from '../context/SessionContext';
import Layout from '../components/layout';
import '../styles/slick.css';
import '../styles/slick-theme.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	const [modal, setModal] = useState(false);

	useEffect(() => {
		modal &&
			document.body.setAttribute('style', `overflow: hidden; margin-right: ${mobile ? '0' : '12px'};`);
		!modal &&
			document.body.removeAttribute(
				'style',
				`overflow: hidden; margin-right: ${mobile ? '0' : '12px'};`
			);
	}, [modal]);

	return (
		<SessionContext>
			<Layout modal={modal} setModal={setModal}>
				<Component modal={modal} setModal={setModal} {...pageProps} />
			</Layout>
		</SessionContext>
	);
}

export default MyApp;
