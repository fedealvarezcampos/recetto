import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { supabase } from '../../lib/supabaseClient';
import Head from 'next/head';
import RecipeGallery from '../../components/RecipeGallery';
import styles from '../../styles/Recipe.module.scss';

function Recipe() {
    const router = useRouter();
    const recipeId = router?.query.id;
    const recipeQ = router?.query.recipe;
    console.log(recipeQ);
    const recipeName = recipeQ?.replaceAll('-', ' ');

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

    return (
        <>
            <Head>
                <title>Recetto | {recipeName}</title>
            </Head>
            {loading ? (
                'Loading...'
            ) : (
                <div className={styles.mainContainer}>
                    <h1>{recipe?.name}</h1>
                    {recipe?.images?.length > 0 && <RecipeGallery items={recipe?.images} />}
                    <div>
                        <span className={styles.sideTitle}>Cooking time: </span>
                        {recipe?.cooktime}
                    </div>
                    <div>
                        <span className={styles.sideTitle}>Servings: </span>
                        {recipe?.servings}
                    </div>
                    <div>
                        <span className={styles.sideTitle}>Category: </span>
                        {recipe?.category}
                    </div>
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