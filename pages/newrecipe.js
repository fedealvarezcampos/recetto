import { useSession } from '../context/SessionContext';
import Head from 'next/head';
import RecipeForm from '../components/RecipeForm';
import Modal from '../components/Modal';
import styles from '../styles/newrecipe.module.scss';

export default function NewRecipe({ modal, setModal }) {
	const session = useSession();

	return (
		<>
			<Head>
				<title>Recetto | Add a recipe</title>
			</Head>
			{session && <RecipeForm setModal={setModal} />}
			{!session && <div>Loading...</div>}
			{session && (
				<Modal modal={modal} setModal={setModal}>
					<span className={styles.disclaimer}>
						Because of how differently sites handle recipes, not all links are going to work. Most
						popular recipe sites will work fine. Here are some that do with no problem (mostly; if
						the site is on this list and does not work, please try again):
						<ul>
							<li>allrecipes.com</li>
							<li>foodnetwork.co.uk</li>
							<li>seriouseats.com</li>
							<li>food.com</li>
							<li>myrecipes.com</li>
							<li>bonappetit.com</li>
							<li>invitadoinvierno.com</li>
							<li>webosfritos.es</li>
							<li>directoalpaladar.com</li>
							<li>tasty.co</li>
							<li>bbcgoodfood.com</li>
							<li>epicurious.com</li>
							<li>themodernproper.com</li>
							<li>yummly.com</li>
							<li>bettycrocker.com</li>
							<li>deliciousmagazine.co.uk</li>
							<li>delicious.com.au</li>
							<li>taste.com.au</li>
							<li>...and more! (possibly)</li>
						</ul>
					</span>
				</Modal>
			)}
		</>
	);
}
