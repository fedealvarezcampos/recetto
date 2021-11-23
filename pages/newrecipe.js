import { useSession } from '../context/SessionContext';
import { useRouter } from 'next/dist/client/router';
import RecipeForm from '../components/RecipeForm';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NewRecipe() {
    const session = useSession();

    return (
        <>
            {session && <RecipeForm />}
            {!session && <div>Loading...</div>}
        </>
    );
}
