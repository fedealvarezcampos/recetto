import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';
import styles from '../styles/RecipeForm.module.scss';
import { useRouter } from 'next/dist/client/router';

function RecipeForm() {
    const router = useRouter();
    const user = supabase?.auth.user();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [servings, setServings] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingInputCounter, setIngInputCounter] = useState(1);
    const [instructions, setInstructions] = useState(['']);
    const [instInputCounter, setInstInputCounter] = useState(1);
    const [images, setImages] = useState([]);

    // console.log(ingredients);

    const handleNewInput = (e, field) => {
        e.preventDefault();
        field === 'ingredient'
            ? setIngInputCounter(ingInputCounter + 1)
            : setInstInputCounter(instInputCounter + 1);
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

    async function setPreviews(e) {
        e.preventDefault();
        try {
            const files = e.target.files;

            if (files?.length >= 5) {
                console.log('Five images max!');
                return;
            }

            let previewsArray = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();

                if (fileExt !== 'jpg' && fileExt !== 'png' && fileExt !== 'jpeg' && fileExt !== 'webp') {
                    console.log('File/s must be jpg | webp | png !');
                    return;
                }

                if (file?.size > 1100000) {
                    console.log('All files must be 1MB or less!');
                    return;
                }

                const fileName = `${uuidv4()}.${fileExt}`;

                const url = URL.createObjectURL(file);

                previewsArray.push({ preview: url, file: file, filePath: fileName });
            }

            if (images?.length + files?.length > 5) {
                console.log('Five images max!');
                return;
            }

            setImages([...images, ...previewsArray]);
        } catch (error) {
            console.log(error.message);
        }
    }

    const removeImgPreview = key => {
        const filtered = images.filter((i, value) => i.preview !== key);

        setImages(filtered);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
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
                category: category,
                servings: servings,
                cooktime: cookTime,
                ingredients: ingredients,
                steps: instructions,
                owner_id: user?.id,
            });

            if (error) throw error;

            console.log(data);

            const urlTitle = data[0]?.name.replaceAll(' ', '-');

            router.push(data[0]?.id + '/' + urlTitle);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <form action="" onSubmit={e => handleSubmit(e)} className={styles.recipeForm}>
                <h1>Add a recipe</h1>
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
                <label htmlFor="category">
                    <span>Category</span>
                    <input
                        name="category"
                        id="category"
                        type="text"
                        placeholder="Recipe category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                </label>
                <label htmlFor="servings">
                    <span>Servings</span>
                    <input
                        name="servings"
                        id="servings"
                        type="number"
                        min="1"
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
                                        placeholder="Add ingredient"
                                        onChange={e => updateFieldContent(i, e, 'ingredient')}
                                    />
                                );
                            })}
                        </span>
                    </label>
                    <button className={styles.addButton} onClick={e => handleNewInput(e, 'ingredient')}>
                        +
                    </button>
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
                                        placeholder="Add step"
                                        onChange={e => updateFieldContent(i, e, 'instruction')}
                                    />
                                );
                            })}
                        </span>
                    </label>
                    <button className={styles.addButton} onClick={e => handleNewInput(e, 'instruction')}>
                        +
                    </button>
                </div>
                <button aria-label="save new recipe">
                    <span>save</span>
                </button>
            </form>
        </>
    );
}

export default RecipeForm;
