import { useRouter } from 'next/dist/client/router';
import Recipe from '../../components/Recipe';
import Head from 'next/head';

function RecipePage() {
	const router = useRouter();

	const recipeId = router?.query.id;
	const recipeQ = router?.query.recipe;
	const recipeName = recipeQ?.replaceAll('-', ' ');

	return (
		<>
			<Head>
				<title>Recetto{recipeName && ' | ' + recipeName}</title>
			</Head>
			<Recipe recipeId={recipeId} />
		</>
	);
}

export default RecipePage;
