import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import Image from 'next/image';
import styles from '../styles/RecipeForm.module.scss';

function RecipeForm({ setModal }) {
	const APIHOST = process.env.NEXT_PUBLIC_APIHOST;

	const router = useRouter();
	const user = supabase?.auth.user();

	const [importing, setImporting] = useState(false);
	const [categoryOptions, setCategoryOptions] = useState(['']);

	const [importURL, setImportURL] = useState('');
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('');
	const [servings, setServings] = useState('');
	const [cookTime, setCookTime] = useState('');
	const [ingredients, setIngredients] = useState(['']);
	const [ingInputCounter, setIngInputCounter] = useState(1);
	const [instructions, setInstructions] = useState(['']);
	const [instInputCounter, setInstInputCounter] = useState(1);
	const [images, setImages] = useState([]);

	const handleInputCounter = (e, field, mode) => {
		e.preventDefault();

		if (mode === 'add') {
			field === 'ingredient'
				? setIngInputCounter(ingInputCounter + 1)
				: setInstInputCounter(instInputCounter + 1);
		}

		if (mode === 'remove') {
			field === 'ingredient'
				? setIngInputCounter(ingInputCounter - 1)
				: setInstInputCounter(instInputCounter - 1);
		}
	};

	const updateFieldContent = (i, e, field) => {
		if (field === 'ingredient') {
			const newArr = [...ingredients];
			newArr[i] = e.target.value;
			setIngredients(newArr);
		} else {
			const newArr = [...instructions];
			newArr[i] = e.target.value;
			setInstructions(newArr);
		}
	};

	const searchCategories = async e => {
		e.preventDefault();
		try {
			let { data: categories, error } = await supabase
				.from('recipes')
				.select('category')
				.match({ owner_id: user?.id })
				.textSearch('category', category, {
					type: 'websearch',
					config: 'english',
				});

			if (error) throw error;

			setCategoryOptions(categories);
		} catch (error) {
			console.log(error);
		}
	};

	async function setPreviews(e) {
		e.preventDefault();
		try {
			const files = e.target.files;

			if (files?.length >= 5) {
				toast.error('Five images max!');
				return;
			}

			let previewsArray = [];

			for (const file of files) {
				const fileExt = file.name.split('.').pop();

				if (
					file?.type !== 'image/png' &&
					file?.type !== 'image/webp' &&
					file?.type !== 'image/jpeg'
				) {
					toast.error('File/s must be jpg | webp | png !');
					return;
				}

				if (file?.size > 1100000) {
					toast.error('All files must be 1MB or less!');
					return;
				}

				const fileName = `${uuidv4()}.${fileExt}`;

				const url = URL.createObjectURL(file);

				previewsArray.push({ preview: url, file: file, filePath: fileName });
			}

			if (images?.length + files?.length > 5) {
				toast.error('Five images max!');
				return;
			}

			setImages([...images, ...previewsArray]);
		} catch (error) {
			toast.error(error.message);
		}
	}

	const removeImgPreview = key => {
		const filtered = images.filter((i, value) => i.preview !== key);

		setImages(filtered);
	};

	const importer = async e => {
		e.preventDefault();

		setImporting(true);
		toast.loading('Checking link...');

		const body = { url: importURL };

		const response = await fetch(`${APIHOST}api/scraper`, {
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(body),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				Accept: 'application/json',
			}),
		});
		const data = await response.json();

		if (data?.items || data?.steps) {
			setIngredients(data?.items);
			setIngInputCounter(data?.items?.length);
			setInstructions(data?.steps);
			setInstInputCounter(data?.steps?.length);
			setTitle(data?.recipeName);
			setServings(data?.yield);

			toast.dismiss();
			toast.success('Recipe imported!');
		} else {
			toast.dismiss();
			toast.error(data?.message);
		}

		setImporting(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			toast.loading('Saving...');

			let imgURL = [];

			for (const image of images) {
				const fileName = image.filePath;
				const file = image.file;

				let { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

				if (uploadError) {
					throw uploadError;
				}

				imgURL.push(fileName);
			}

			const { data, error } = await supabase.from('recipes').insert({
				name: title,
				images: imgURL,
				category: category || (category === '' && 'Uncategorized'),
				servings: servings || (servings === '' && null),
				cooktime: cookTime || (cookTime === '' && null),
				ingredients: ingredients,
				steps: instructions,
				owner_id: user?.id,
			});

			if (error) throw error;

			const urlTitle = data[0]?.name.replaceAll(' ', '-');

			router.push(data[0]?.id + '/' + urlTitle);

			toast.dismiss();
			toast.success('Recipe added!');
		} catch (error) {
			toast.dismiss();
			toast.error('Something went wrong!');
		}
	};

	return (
		<>
			<div className={styles.formsContainer}>
				<h1>Add a recipe</h1>
				<form action="" onSubmit={e => importer(e)} className={styles.recipeForm}>
					<label htmlFor="import">
						<span>
							Import a recipe (
							<span onClick={() => setModal(true)} className={styles.disclaimerText}>
								disclaimer
							</span>
							)
						</span>
						<input
							name="import"
							id="import"
							type="url"
							placeholder="Import url"
							value={importURL}
							onChange={e => setImportURL(e.target.value)}
						/>
					</label>
					<span className={styles.importButtonContainer}>
						<button aria-label="import recipe" className={styles.importLabel}>
							<span>import</span>
						</button>
						{importing && (
							<motion.span
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								className={styles.importingMsg}
							>
								Importing...
							</motion.span>
						)}
					</span>
				</form>
				<form action="" onSubmit={e => handleSubmit(e)} className={styles.recipeForm}>
					<label htmlFor="title">
						<span>Title</span>
						<input
							name="title"
							id="title"
							type="text"
							required
							placeholder="Recipe title"
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
					</label>
					<span className={styles.imageInputs}>
						<label htmlFor="file">
							<span>Add pictures</span>
							<input
								type="file"
								name="file"
								multiple
								accept="image/jpeg, image/png, image/webp"
								id="file"
								onChange={setPreviews}
							/>
						</label>
					</span>
					{images?.length !== 0 && (
						<div className={styles.imageContainer}>
							{images?.map((image, i) => (
								<Image
									key={i}
									src={image?.preview}
									layout="fill"
									alt="image in board"
									quality={70}
									objectFit="cover"
									onClick={() => removeImgPreview(image?.preview)}
								/>
							))}
						</div>
					)}
					<label htmlFor="category-options">
						<span>Category</span>
						<input
							name="category"
							id="category"
							type="text"
							list="category-options"
							placeholder="Recipe category"
							value={category}
							onInput={e => searchCategories(e)}
							onChange={e => setCategory(e.target.value)}
						/>
						<datalist value={category} type="text" name="category-options" id="category-options">
							{categoryOptions?.map((item, i) => (
								<option key={i} value={item?.category} />
							))}
						</datalist>
					</label>
					<label htmlFor="servings">
						<span>Servings</span>
						<input
							name="servings"
							id="servings"
							type="text"
							placeholder="Recipe servings"
							value={servings}
							onChange={e => setServings(e.target.value)}
						/>
					</label>
					<label htmlFor="cookTime">
						<span>Cooking time (minutes)</span>
						<input
							name="cookTime"
							id="cookTime"
							type="number"
							min="1"
							placeholder="Recipe cooking time"
							value={cookTime}
							onChange={e => setCookTime(e.target.value)}
						/>
					</label>
					<div className={styles.ingredientsFormSubContainer}>
						<label htmlFor="ingredients">
							<span>Ingredients</span>
							<span className={styles.inputArrayContainer}>
								{Array.from(Array(ingInputCounter)).map((el, i) => {
									return (
										<input
											key={i}
											required
											name="ingredients"
											id="ingredients"
											type="text"
											value={ingredients[i] || ''}
											placeholder="Add ingredient"
											onChange={e => updateFieldContent(i, e, 'ingredient')}
										/>
									);
								})}
							</span>
						</label>
						<button
							className={styles.addButton}
							onClick={e => handleInputCounter(e, 'ingredient', 'add')}
						>
							+
						</button>
						{ingInputCounter > 1 && (
							<button
								className={styles.addButton}
								onClick={e => handleInputCounter(e, 'ingredient', 'remove')}
							>
								-
							</button>
						)}
					</div>
					<div className={styles.ingredientsFormSubContainer}>
						<label htmlFor="instructions">
							<span>Instructions</span>
							<span className={styles.inputArrayContainer}>
								{Array.from(Array(instInputCounter)).map((el, i) => {
									return (
										<textarea
											key={i}
											required
											name="instructions"
											id="instructions"
											type="textarea"
											value={instructions[i]}
											placeholder="Add step"
											onChange={e => updateFieldContent(i, e, 'instruction')}
										/>
									);
								})}
							</span>
						</label>
						<button
							className={styles.addButton}
							onClick={e => handleInputCounter(e, 'instruction', 'add')}
						>
							+
						</button>
						{instInputCounter > 1 && (
							<button
								className={styles.addButton}
								onClick={e => handleInputCounter(e, 'instruction', 'remove')}
							>
								-
							</button>
						)}
					</div>
					<button aria-label="save new recipe">
						<span>save</span>
					</button>
				</form>
			</div>
		</>
	);
}

export default RecipeForm;
