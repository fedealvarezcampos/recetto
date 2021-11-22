import { useState } from 'react';
import Layout from '../components/layout';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
    const [modal, setModal] = useState(false);

    return (
        <Layout modal={modal} setModal={setModal}>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
