import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../db';
import { recipes, ingredientsToRecipes, ingredients } from '../../../../db/schema';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (request) => {
	const { id } = request.params;
	const recipeId = parseInt(id, 10);

	await db
		.delete(ingredientsToRecipes)
		.where(eq(ingredientsToRecipes.recipeId, recipeId))
		.execute();

	await db.delete(recipes).where(eq(recipes.id, recipeId)).execute();

	return new Response(
		JSON.stringify({
			message: 'Recipe deleted successfully'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const recipeId = parseInt(params.id, 10);
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

	// Update the recipe
	await db
		.update(recipes)
		.set({
			name: newRecipe.name,
			directions: newRecipe.directions,
			imageUrl: newRecipe.imageUrl,
			source: newRecipe.source
		})
		.where(eq(recipes.id, recipeId))
		.execute();

	// Delete existing ingredientsToRecipes connections
	await db
		.delete(ingredientsToRecipes)
		.where(eq(ingredientsToRecipes.recipeId, recipeId))
		.execute();

	// Insert new ingredientsToRecipes connections
	for (const ingredient of newRecipeIngredients) {
		await db
			.insert(ingredientsToRecipes)
			.values({
				recipeId: recipeId,
				ingredientId: ingredient.ingredientId,
				quantity: ingredient.quantity,
				unit: ingredient.unit
			})
			.execute();
	}

	return new Response(
		JSON.stringify({
			message: 'Recipe updated successfully'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
