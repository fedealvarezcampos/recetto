import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import styles from '../styles/RecipeForm.module.scss';

function RecipeForm() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingInputCounter, setIngInputCounter] = useState(1);
    const [instructions, setInstructions] = useState(['']);
    const [instInputCounter, setInstInputCounter] = useState(1);
    const [images, setImages] = useState([]);

    // console.log(ingredients);
    // console.log(instructions);

    console.log(images);

    const handleAddIngredientField = e => {
        e.preventDefault();
        setIngInputCounter(ingInputCounter + 1);
    };

    const handleAddInstructionField = e => {
        e.preventDefault();
        setInstInputCounter(instInputCounter + 1);
    };

    const updateIngredient = (i, e) => {
        const newArr = [...ingredients];
        newArr[i] = e.target.value;
        setIngredients(newArr);
    };

    const updateIstruction = (i, e) => {
        const newArr = [...instructions];
        newArr[i] = e.target.value;
        setInstructions(newArr);
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

                if (images?.length >= 5) {
                    console.log('Five images max!');
                    return;
                }

                const fileName = `${uuidv4()}.${fileExt}`;

                const url = URL.createObjectURL(file);

                previewsArray.push({ preview: url, file: file, filePath: fileName });
            }

            setImages([...images, ...previewsArray]);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <form className={styles.recipeForm}>
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
                        type="text"
                        placeholder="Recipe servings"
                        value={servings}
                        onChange={e => setServings(e.target.value)}
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
                                        onChange={e => updateIngredient(i, e)}
                                    />
                                );
                            })}
                        </span>
                    </label>
                    <button className={styles.addButton} onClick={e => handleAddIngredientField(e)}>
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
                                        onChange={e => updateIstruction(i, e)}
                                    />
                                );
                            })}
                        </span>
                    </label>
                    <button className={styles.addButton} onClick={e => handleAddInstructionField(e)}>
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
