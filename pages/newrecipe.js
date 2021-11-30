import { useSession } from '../context/SessionContext';
import Head from 'next/head';
import RecipeForm from '../components/RecipeForm';
import Modal from '../components/Modal';

export default function NewRecipe({ modal, setModal }) {
    const session = useSession();

    console.log(modal);

    return (
        <>
            <Head>
                <title>Recetto | Add a recipe</title>
            </Head>
            {session && <RecipeForm setModal={setModal} />}
            {!session && <div>Loading...</div>}
            {modal && session && (
                <Modal setModal={setModal}>
                    <span>
                        Because of how differently sites handle recipes, not all links are going to work. Most
                        popular recipe sites will work fine. Here are some that do with no problem (mostly; if
                        the site is on this list and does not work, please try again):
                        <ul>
                            <li>allrecipes.com</li>
                            <li>tasty.co</li>
                            <li>bbcgoodfood.com</li>
                            <li>themodernproper.com</li>
                            <li>deliciousmagazine.co.uk</li>
                            <li>delicious.com.au</li>
                        </ul>
                    </span>
                </Modal>
            )}
        </>
    );
}
