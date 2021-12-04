import { useRouter } from 'next/dist/client/router';
import { useSession } from '../context/SessionContext';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/Header.module.scss';
import toast from 'react-hot-toast';

function Header({ setModal }) {
    const router = useRouter();
    const recipeId = router?.query?.id;

    const session = useSession();
    const user = session?.user;

    const handleLogOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteRecipe = async () => {
        try {
            toast.loading('Deleting recipe...');
            const { data, error } = await supabase.from('recipes').delete().eq('id', recipeId);

            if (error) throw error;

            router.replace('/my-recipes');

            toast.dismiss();
            toast.success('Recipe deleted!');
        } catch (error) {
            toast.error(error.message);
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
                            <Link href="/my-recipes" passHref>
                                <button>
                                    <span className={styles.recipeButtonText}>my recipes</span>
                                </button>
                            </Link>
                            {recipeId && (
                                <button onClick={() => deleteRecipe()}>
                                    <span className={styles.recipeButtonText}>delete recipe</span>
                                </button>
                            )}
                        </span>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
