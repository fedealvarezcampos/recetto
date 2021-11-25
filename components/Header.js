import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import styles from '../styles/Header.module.scss';
import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';

function Header({ setModal }) {
    const session = useSession();
    const user = session?.user;
    const [loading, setLoading] = useState(true);

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
                    <Link href="/newrecipe" passHref>
                        <button>
                            <span className={styles.recipeButtonText}>add recipe</span>
                        </button>
                    </Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
