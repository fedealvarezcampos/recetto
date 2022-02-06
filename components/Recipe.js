import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import RecipeGallery from './RecipeGallery';
import styles from '../styles/Recipe.module.scss';

const Recipe = ({ recipeId }) => {
	const session = useSession();
	const userId = session?.user?.id;

	const [recipe, setRecipe] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getRecipe = async () => {
			try {
				let { data: recipes, error } = await supabase
					.from('recipes')
					.select('*')
					.match({ id: recipeId, owner_id: userId });

				if (error) throw error;

				setRecipe(recipes[0]);

				setLoading(false);
			} catch (error) {
				toast.error(error.message);
			}
		};

		recipeId && userId && getRecipe();
	}, [recipeId, userId]);

	return loading ? (
		<p className="loading">Loading...</p>
	) : (
		<div className={styles.mainContainer}>
			<h1>{recipe?.name}</h1>
			{recipe?.images?.length > 0 && <RecipeGallery items={recipe?.images} />}
			<div className={styles.infoContainer}>
				{recipe?.cooktime && (
					<div>
						<h2 className={styles.sideTitle}>Cooking time</h2>
						<span>{recipe?.cooktime}</span>
					</div>
				)}
				{recipe?.servings && (
					<div>
						<h2 className={styles.sideTitle}>Servings</h2>
						<span>{recipe?.servings}</span>
					</div>
				)}
				{recipe?.category && (
					<div>
						<h2 className={styles.sideTitle}>Category</h2>
						<span>{recipe?.category}</span>
					</div>
				)}
			</div>
			<article className={styles.recipeContainer}>
				<span>
					<h2>Instructions</h2>
					<ul className={styles.instructionsList}>
						{recipe?.steps?.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				</span>
				<aside>
					<h2>Ingredients</h2>
					<ul className={styles.ingredientsList}>
						{recipe?.ingredients?.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				</aside>
			</article>
		</div>
	);
};

export default Recipe;
