import { useEffect, useState } from 'react';
import styles from '../styles/RecipeForm.module.scss';

function RecipeForm() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingInputCounter, setIngInputCounter] = useState(1);
    const [instructions, setInstructions] = useState(['']);
    const [instInputCounter, setInstInputCounter] = useState(1);

    console.log(ingredients);
    console.log(instructions);

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

    return (
        <form className={styles.recipeForm}>
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
            <label htmlFor="title">
                <span>Category</span>
                <input
                    name="Category"
                    id="Category"
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
            <button aria-label="save new recipe">save</button>
        </form>
    );
}

export default RecipeForm;
