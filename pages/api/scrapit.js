const chromium = require('chrome-aws-lambda');
const playwright = require('playwright-core');
const { compact } = require('jsonld');

export default async function scraper(req, res) {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' });
            return;
        }

        const { url } = req?.body;
        console.log(url);

        const browser = await playwright.chromium.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        await page.goto(url);

        const handle = await page.$('script[type="application/ld+json"]');
        const text = await handle.innerText();

        const schema = {
            recipe: 'http://schema.org/Recipe',
            recipeIngredient: 'http://schema.org/recipeIngredient',
            recipeInstructions: 'http://schema.org/recipeInstructions',
            Text: 'http://schema.org/text',
            HotToStep: 'http://schema.org/HowToStep',
        };

        const compacted = await compact(JSON.parse(text), schema);

        let ingredients = compacted?.recipeIngredient;

        if (!ingredients) {
            ingredients = compacted['@graph'].filter(item => item['@type'] === 'recipe')[0]?.recipeIngredient;
        }

        let instructions = compacted?.recipeInstructions;

        if (!instructions) {
            instructions = compacted['@graph']?.filter(item => item['@type'] === 'recipe')[0]
                ?.recipeInstructions;
            instructions = instructions?.map(i => i.Text);
        }

        if (instructions[0]['@type'] === 'HotToStep') {
            instructions = instructions?.map(i => i.Text);
        }

        await page.close();
        await browser.close();

        if (ingredients || instructions) {
            res.status(200).json({ items: ingredients, steps: instructions });
        } else {
            res.status(200).json({ message: 'No data found!' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: 'Site can not be imported!' });
    }
}
