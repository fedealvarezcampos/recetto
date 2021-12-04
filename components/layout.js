import { useSession } from '../context/SessionContext';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import Image from 'next/image';
import Header from './Header';
import Login from './Login';
import styles from '../styles/layout.module.scss';

function Layout({ children, modal, setModal }) {
    const session = useSession();

    return (
        <>
            <Head>
                <title>Recetto</title>
                <meta name="description" content="Recetto, save your recipes!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster
                toastOptions={{
                    style: {
                        color: 'var(--white)',
                        backgroundColor: 'var(--main-item)',
                        borderRadius: '12px',
                        padding: '8px 8px 8px 12px',
                        border: '6px solid var(--alt-item)',
                        width: 'fit-content',
                    },
                }}
            />
            <div className={styles.container}>
                <Header setModal={setModal} />
                {modal && !session && <Login setModal={setModal} />}
                <main className={styles.main}>{children}</main>
                <footer className={styles.footer}>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by{' '}
                        <span className={styles.logo}>
                            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                        </span>
                    </a>
                </footer>
            </div>
        </>
    );
}

export default Layout;
