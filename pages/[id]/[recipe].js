import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { supabase } from '../../lib/supabaseClient';
import styles from '../../styles/Recipe.module.scss';

function Recipe() {
    const router = useRouter();
    const recipeId = router?.query.id;
    const recipeName = router?.query.recipe;

    const session = useSession();
    const userId = session?.user?.id;

    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState([]);

    useEffect(() => {
        const getRecipe = async () => {
            try {
                setLoading(true);

                let { data: recipes, error } = await supabase
                    .from('recipes')
                    .select('*')
                    .match({ id: recipeId, name: recipeName, owner_id: userId });

                setRecipe(recipes[0]);

                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        recipeId && recipeName && userId && getRecipe();
    }, [recipeId, recipeName, userId]);

    console.log(recipe);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className={styles.mainContainer}>
                    <h1>{recipe?.name}</h1>
                    <div>Cooking time: {recipe?.cooktime}</div>
                    <div>Servings: {recipe?.servings}</div>
                    <div>Category: {recipe?.category}</div>
                    <article className={styles.recipeContainer}>
                        <span>
                            <div>Instructions</div>
                            <ul className={styles.instructionsList}>
                                {recipe?.steps?.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </span>
                        <aside>
                            <div>Ingredients</div>
                            <ul className={styles.ingredientsList}>
                                {recipe?.ingredients?.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </aside>
                    </article>
                </div>
            )}
        </>
    );
}

export default Recipe;
