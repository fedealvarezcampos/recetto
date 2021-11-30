import { useState } from 'react';
import SessionContext from '../context/SessionContext';
import Layout from '../components/layout';
import '../styles/slick.css';
import '../styles/slick-theme.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
    const [modal, setModal] = useState(false);

    return (
        <SessionContext>
            <Layout modal={modal} setModal={setModal}>
                <Component modal={modal} setModal={setModal} {...pageProps} />
            </Layout>
        </SessionContext>
    );
}

export default MyApp;
