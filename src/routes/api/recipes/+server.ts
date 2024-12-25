import type { RequestHandler } from './$types';
import { ingredients, recipes } from '../../../db/schema';
import { db } from '../../../db';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const allRecipes = await db.select().from(recipes);

	return new Response(JSON.stringify(allRecipes), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const newRecipe = await request.json();

	const recipeIngredients = newRecipe.ingredients;

	const newRecipeIngredients = [];
	for (const ingredient of recipeIngredients) {
		let found = await db
			.select()
			.from(ingredients)
			.where(sql`${ingredients.name} = ${ingredient.name}`)
			.execute();

		if (found.length === 0) {
			const [insertedIngredient] = await db
				.insert(ingredients)
				.values({ name: ingredient.name })
				.returning({ id: ingredients.id, name: ingredients.name })
				.execute();
			found = [insertedIngredient];
		}

		newRecipeIngredients.push({
			ingredientId: found[0].id,
			quantity: ingredient.quantity,
			unit: ingredient.unit
		});
	}

	const [recipe] = await db
		.insert(recipes)
		.values({
			name: newRecipe.name,
			directions: newRecipe.directions,
			ingredients: newRecipeIngredients
		})
		.returning({
			id: recipes.id,
			name: recipes.name,
			directions: recipes.directions,
			ingredients: recipes.ingredients
		})
		.execute();

	console.log('recipe', recipe);

	return new Response(JSON.stringify(recipe), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
