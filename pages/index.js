import { motion } from 'framer-motion';
import Image from 'next/image';
import recipes from '../public/images/recipes.png';
import addingRecipes from '../public/images/addrecipe.png';
import styles from '../styles/Home.module.scss';

export default function Home() {
	return (
		<>
			<div className={styles.homeContainer}>
				<motion.h1
					initial={{ y: -40, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.6 }}
				>
					A place for all your recipes
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					Recetto keeps all your recipes together and organized.
					<br />
					Add new ones yourself or import them from other sites!
				</motion.p>
				<motion.div
					className={styles.firstInfoContainer}
					initial={{ x: -30, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.6 }}
				>
					<p>
						Once logged in, you can add your own recipes with our form or import your favorites
						from many popular recipe sites.
					</p>
					<Image
						src={addingRecipes}
						placeholder="blur"
						priority
						// layout="intrinsic"
						// width="100%"
						// height="100%"
						objectFit="contain"
						quality={80}
						alt="recipe images"
					/>
				</motion.div>
				<motion.div
					className={styles.firstInfoContainer}
					initial={{ x: -30, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.8 }}
				>
					<p>
						You can check your saved recipes in your profile and display them according to their
						category.
					</p>
					<Image
						src={recipes}
						placeholder="blur"
						priority
						// layout="intrinsic"
						// width="100%"
						// height="100%"
						objectFit="contain"
						quality={80}
						alt="recipe images"
					/>
				</motion.div>
			</div>
		</>
	);
}
