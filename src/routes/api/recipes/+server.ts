import type { RequestHandler } from './$types';
import {
	ingredients,
	ingredientsToRecipes,
	notes,
	recipes,
	recipeToNotes
} from '../../../db/schema';
import { db } from '../../../db';
import { sql } from 'drizzle-orm';

interface Ingredient {
	ingredientId: number;
	name: string;
	quantity: string;
	unit: string;
}

interface Note {
	id: number;
	content: string;
}

interface Recipe {
	id: number;
	name: string;
	directions: string[] | null;
	imageUrl: string | null;
	source: string | null;
	ingredients: Ingredient[] | unknown;
	notes: Note[] | unknown;
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
				ingredients: sql`json_agg(json_build_object('ingredientId', ${ingredientsToRecipes.ingredientId}, 'name', ${ingredients.name}, 'quantity', ${ingredientsToRecipes.quantity}, 'unit', ${ingredientsToRecipes.unit}))`,
				notes: sql`json_agg(json_build_object('id', ${notes.id}, 'content', ${notes.content}))`
			})
			.from(recipes)
			.leftJoin(ingredientsToRecipes, sql`${recipes.id} = ${ingredientsToRecipes.recipeId}`)
			.leftJoin(ingredients, sql`${ingredientsToRecipes.ingredientId} = ${ingredients.id}`)
			.leftJoin(recipeToNotes, sql`${recipes.id} = ${recipeToNotes.recipeId}`)
			.leftJoin(notes, sql`${recipeToNotes.noteId} = ${notes.id}`)
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
				ingredients: sql`json_agg(json_build_object('ingredientId', ${ingredientsToRecipes.ingredientId}, 'name', ${ingredients.name}, 'quantity', ${ingredientsToRecipes.quantity}, 'unit', ${ingredientsToRecipes.unit}))`,
				notes: sql`json_agg(json_build_object('id', ${notes.id}, 'content', ${notes.content}))`
			})
			.from(recipes)
			.leftJoin(ingredientsToRecipes, sql`${recipes.id} = ${ingredientsToRecipes.recipeId}`)
			.leftJoin(ingredients, sql`${ingredientsToRecipes.ingredientId} = ${ingredients.id}`)
			.leftJoin(recipeToNotes, sql`${recipes.id} = ${recipeToNotes.recipeId}`)
			.leftJoin(notes, sql`${recipeToNotes.noteId} = ${notes.id}`)
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
				ingredients: sql`json_agg(json_build_object('ingredientId', ${ingredientsToRecipes.ingredientId}, 'name', ${ingredients.name}, 'quantity', ${ingredientsToRecipes.quantity}, 'unit', ${ingredientsToRecipes.unit}))`,
				notes: sql`json_agg(json_build_object('id', ${notes.id}, 'content', ${notes.content}))`
			})
			.from(recipes)
			.leftJoin(ingredientsToRecipes, sql`${recipes.id} = ${ingredientsToRecipes.recipeId}`)
			.leftJoin(ingredients, sql`${ingredientsToRecipes.ingredientId} = ${ingredients.id}`)
			.leftJoin(recipeToNotes, sql`${recipes.id} = ${recipeToNotes.recipeId}`)
			.leftJoin(notes, sql`${recipeToNotes.noteId} = ${notes.id}`)
			.groupBy(recipes.id)
			.execute();
	}

	// Filter out duplicate ingredients and notes
	const filterDuplicates = <T>(items: T[], key: keyof T): T[] => {
		const seen = new Set();
		return items.filter((item) => {
			const k = item[key];
			return seen.has(k) ? false : seen.add(k);
		});
	};

	recipesByName = recipesByName.map((recipe) => ({
		...recipe,
		ingredients: filterDuplicates(recipe.ingredients as Ingredient[], 'ingredientId'),
		notes: filterDuplicates(recipe.notes as Note[], 'id')
	}));

	recipesByIngredient = recipesByIngredient.map((recipe) => ({
		...recipe,
		ingredients: filterDuplicates(recipe.ingredients as Ingredient[], 'ingredientId'),
		notes: filterDuplicates(recipe.notes as Note[], 'id')
	}));

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
			await db.insert(ingredientsToRecipes).values({
				recipeId: recipe.id,
				ingredientId: ingredient.ingredientId,
				quantity: ingredient.quantity,
				unit: ingredient.unit
			});
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
