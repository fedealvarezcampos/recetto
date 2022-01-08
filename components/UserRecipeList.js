import Image from 'next/image';
import Link from 'next/link';
import { supabaseHost } from '../lib/constants';
import styles from '../styles/my-recipes.module.scss';

function UserRecipeList({ recipes }) {
	return (
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
	);
}

export default UserRecipeList;
