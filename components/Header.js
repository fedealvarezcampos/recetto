import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import styles from '../styles/Header.module.scss';

function Header({ setModal }) {
    const user = supabase?.auth.user();

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
