import type { RequestHandler } from './$types';
import { ingredients, ingredientsToRecipes, recipes } from '../../../db/schema';
import { db } from '../../../db';
import { sql } from 'drizzle-orm';

interface Recipe {
	id: number;
	name: string;
	directions: string[] | null;
	imageUrl: string | null;
	source: string | null;
	ingredients:
		| {
				ingredientId: number;
				name: string;
				quantity: string;
				unit: string;
		  }[]
		| unknown;
}

export const GET: RequestHandler = async ({ url }) => {
	const searchTerm = url.searchParams.get('searchTerm');

	let recipesByName: Recipe[] = [];
	let recipesByIngredient: Recipe[] = [];

	if (searchTerm) {
		// Search recipes by name
		recipesByName = await db
			.select({
				id: recipes.id,
				name: recipes.name,
				directions: recipes.directions,
				imageUrl: recipes.imageUrl,
				source: recipes.source,
				ingredients: sql`json_agg(json_build_object('ingredientId', ${ingredientsToRecipes.ingredientId}, 'name', ${ingredients.name}, 'quantity', ${ingredientsToRecipes.quantity}, 'unit', ${ingredientsToRecipes.unit}))`
			})
			.from(recipes)
			.leftJoin(ingredientsToRecipes, sql`${recipes.id} = ${ingredientsToRecipes.recipeId}`)
			.leftJoin(ingredients, sql`${ingredientsToRecipes.ingredientId} = ${ingredients.id}`)
			.where(sql`${recipes.name} ILIKE ${'%' + searchTerm + '%'}`)
			.groupBy(recipes.id)
			.execute();

		// Search recipes by ingredient name
		recipesByIngredient = await db
			.select({
				id: recipes.id,
				name: recipes.name,
				directions: recipes.directions,
				imageUrl: recipes.imageUrl,
				source: recipes.source,
				ingredients: sql`json_agg(json_build_object('ingredientId', ${ingredientsToRecipes.ingredientId}, 'name', ${ingredients.name}, 'quantity', ${ingredientsToRecipes.quantity}, 'unit', ${ingredientsToRecipes.unit}))`
			})
			.from(recipes)
			.leftJoin(ingredientsToRecipes, sql`${recipes.id} = ${ingredientsToRecipes.recipeId}`)
			.leftJoin(ingredients, sql`${ingredientsToRecipes.ingredientId} = ${ingredients.id}`)
			.where(sql`${ingredients.name} ILIKE ${'%' + searchTerm + '%'}`)
			.groupBy(recipes.id)
			.execute();
	} else {
		// Get all recipes if no search term is provided
		recipesByName = await db
			.select({
				id: recipes.id,
				name: recipes.name,
				directions: recipes.directions,
				imageUrl: recipes.imageUrl,
				source: recipes.source,
				ingredients: sql`json_agg(json_build_object('ingredientId', ${ingredientsToRecipes.ingredientId}, 'name', ${ingredients.name}, 'quantity', ${ingredientsToRecipes.quantity}, 'unit', ${ingredientsToRecipes.unit}))`
			})
			.from(recipes)
			.leftJoin(ingredientsToRecipes, sql`${recipes.id} = ${ingredientsToRecipes.recipeId}`)
			.leftJoin(ingredients, sql`${ingredientsToRecipes.ingredientId} = ${ingredients.id}`)
			.groupBy(recipes.id)
			.execute();
	}

	return new Response(
		JSON.stringify({
			recipesByName,
			recipesByIngredient
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
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
			imageUrl: newRecipe.imageUrl,
			source: newRecipe.source
		})
		.returning({
			id: recipes.id,
			name: recipes.name,
			directions: recipes.directions,
			imageUrl: recipes.imageUrl,
			source: recipes.source
		})
		.execute();

	for (const ingredient of newRecipeIngredients) {
		try {
			const result = await db.insert(ingredientsToRecipes).values({
				recipeId: recipe.id,
				ingredientId: ingredient.ingredientId,
				quantity: ingredient.quantity,
				unit: ingredient.unit
			});
			console.log('Inserted into recipeIngredients:', result);
		} catch (error) {
			console.error('Error inserting into recipeIngredients:', error);
		}
	}

	return new Response(JSON.stringify(recipe), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
