import { useSession } from '../context/SessionContext';
import RecipeForm from '../components/RecipeForm';

export default function NewRecipe() {
    const session = useSession();

    return (
        <>
            {session && <RecipeForm />}
            {!session && <div>Loading...</div>}
        </>
    );
}
