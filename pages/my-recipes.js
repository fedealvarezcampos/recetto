import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { supabase } from '../lib/supabaseClient';
import { supabaseHost } from '../lib/constants';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/my-recipes.module.scss';
import toast from 'react-hot-toast';

function Recipe() {
    const session = useSession();
    const userId = session?.user?.id;

    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState();

    const getRecipes = async category => {
        try {
            setLoading(true);

            if (category) {
                let { data: recipes, error } = await supabase
                    .from('recipes')
                    .select('*')
                    .match({ owner_id: userId, category: category });

                if (error) throw error;

                setRecipes(recipes);
            } else {
                let { data: recipes, error } = await supabase
                    .from('recipes')
                    .select('*')
                    .match({ owner_id: userId });

                if (error) throw error;

                setCategories([...new Set(recipes.map(item => item.category))]);
                setRecipes(recipes);
            }

            setLoading(false);
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        userId && getRecipes(category);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, category]);

    return (
        <>
            <Head>
                <title>Recetto | My recipes</title>
            </Head>
            {loading ? (
                'Loading...'
            ) : (
                <div className={styles.recipesOuterContainer}>
                    <label htmlFor="category-select">Select a category: </label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        name="category"
                        id="category-select"
                    >
                        <option value="">-- Choose a category --</option>
                        {categories?.map((item, i) => (
                            <option key={i} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <ul className={styles.recipeListContainer}>
                        {recipes?.map((item, i) => (
                            <li className={styles.recipeListItem} key={i}>
                                <div className={styles.recipeData}>
                                    <span>{item.name}</span>
                                    <span>{item.category || 'Uncategorized'}</span>
                                </div>
                                {item.images[0] && (
                                    <Image
                                        className={styles.imageContainer}
                                        src={supabaseHost + item.images[0]}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                        quality={80}
                                        alt="recipe images"
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default Recipe;
