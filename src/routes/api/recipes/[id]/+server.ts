import { eq } from 'drizzle-orm';
import { db } from '../../../../db';
import { recipes, ingredientsToRecipes } from '../../../../db/schema';
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
