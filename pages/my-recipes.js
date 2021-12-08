import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { supabase } from '../lib/supabaseClient';
import { supabaseHost } from '../lib/constants';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/my-recipes.module.scss';
import toast from 'react-hot-toast';

function Recipe() {
	const session = useSession();
	const userId = session?.user?.id;

	const [loading, setLoading] = useState(true);
	const [searching, setSearching] = useState(false);
	const [search, setSearch] = useState('');
	const [recipes, setRecipes] = useState([]);
	const [category, setCategory] = useState('');
	const [categories, setCategories] = useState();

	const searchRecipes = async e => {
		e.preventDefault();
		try {
			setSearching(true);

			let { data: recipes, error } = await supabase
				.from('recipes')
				.select('*')
				.match({ owner_id: userId })
				.textSearch('name', `%${search}%`, {
					type: 'websearch',
				});

			if (error) throw error;

			setSearching(false);
			setRecipes(recipes);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const getRecipes = async category => {
		loading && setLoading(false);
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
			toast.error(error.message);
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
			{loading && <p className="loading">Loading...</p>}
			<div className={styles.recipesOuterContainer}>
				{!loading && (
					<>
						<label htmlFor="category-select">Select a category: </label>
						<select
							value={category}
							onChange={e => setCategory(e.target.value)}
							name="category"
							id="category-select"
						>
							<option value="">-- All recipes --</option>
							{categories?.map((item, i) => (
								<option key={i} value={item}>
									{item}
								</option>
							))}
						</select>
						<br />
						<form action="/" onSubmit={e => searchRecipes(e)}>
							<label htmlFor="search">
								<span>Search:</span>
								<input
									type="search"
									required
									name="search"
									id="search"
									minLength={3}
									onChange={e => setSearch(e.target.value)}
								/>
							</label>
						</form>
					</>
				)}
				{!recipes?.length && !loading && !searching && (
					<div className={styles.noRecipes}>No recipes!</div>
				)}
				{searching && <p className="loading">Searching...</p>}
				{!loading && !searching && recipes?.length > 0 && (
					<ul className={styles.recipeListContainer}>
						{recipes?.map((item, i) => (
							<Link key={i} href={`/${item.id}/${item.name.replaceAll(' ', '-')}`} passHref>
								<li className={styles.recipeListItem}>
									<div className={styles.recipeData}>
										<span>{item.name}</span>
										<span>{item.category || 'Uncategorized'}</span>
									</div>
									{item.images[0] && (
										<Image
											className={styles.imageContainer}
											src={supabaseHost + item.images[0]}
											layout="responsive"
											width="100%"
											height="100%"
											objectFit="cover"
											quality={80}
											alt="recipe images"
										/>
									)}
								</li>
							</Link>
						))}
					</ul>
				)}
			</div>
		</>
	);
}

export default Recipe;
