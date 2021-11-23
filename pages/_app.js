import { useState } from 'react';
import SessionContext from '../context/SessionContext';
import Layout from '../components/layout';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
    const [modal, setModal] = useState(false);

    return (
        <SessionContext>
            <Layout modal={modal} setModal={setModal}>
                <Component {...pageProps} />
            </Layout>
        </SessionContext>
    );
}

export default MyApp;
