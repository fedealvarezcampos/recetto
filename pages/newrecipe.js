import { useSession } from '../context/SessionContext';
import Head from 'next/head';
import RecipeForm from '../components/RecipeForm';

export default function NewRecipe() {
    const session = useSession();

    return (
        <>
            <Head>
                <title>Recetto | Add a recipe</title>
            </Head>
            {session && <RecipeForm />}
            {!session && <div>Loading...</div>}
        </>
    );
}
