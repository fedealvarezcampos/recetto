import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/Header.module.scss';

function Header({ setModal }) {
    const session = useSession();
    const user = session?.user;
    const [loading, setLoading] = useState(true);

    const handleLogOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className={styles.header}>
            <Link href="/" passHref>
                <div className={styles.logo}>Recetto</div>
            </Link>
            <nav>
                {!user && (
                    <button onClick={() => setModal(true)}>
                        <span>login</span>
                    </button>
                )}
                {user && (
                    <>
                        <span className={styles.buttonsContainer}>
                            <button onClick={() => handleLogOut()}>
                                <span className={styles.recipeButtonText}>log out</span>
                            </button>
                            <Link href="/newrecipe" passHref>
                                <button>
                                    <span className={styles.recipeButtonText}>add recipe</span>
                                </button>
                            </Link>
                        </span>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
