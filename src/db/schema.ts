import { integer, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const ingredients = pgTable('ingredients', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull()
});

export const recipes = pgTable('recipes', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	directions: text().notNull().array(),
	imageUrl: varchar({ length: 255 }),
	source: varchar({ length: 255 })
});

export const notes = pgTable('notes', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	content: text().notNull()
});

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
	recipes: many(ingredientsToRecipes)
}));

export const recipesRelations = relations(recipes, ({ many }) => ({
	ingredients: many(ingredientsToRecipes),
	notes: many(recipeToNotes)
}));

export const notesRelations = relations(notes, ({ one }) => ({
	recipes: one(recipeToNotes)
}));

export const ingredientsToRecipes = pgTable(
	'ingredients_recipes',
	{
		ingredientId: integer('ingredient_id')
			.notNull()
			.references(() => ingredients.id),
		recipeId: integer('recipe_id')
			.notNull()
			.references(() => recipes.id),
		quantity: varchar({ length: 50 }),
		unit: varchar({ length: 50 })
	},
	(t) => [primaryKey({ columns: [t.ingredientId, t.recipeId] })]
);

export const recipeToNotes = pgTable(
	'recipe_notes',
	{
		recipeId: integer('recipe_id')
			.notNull()
			.references(() => recipes.id),
		noteId: integer('note_id')
			.notNull()
			.references(() => notes.id)
	},
	(t) => [primaryKey({ columns: [t.recipeId, t.noteId] })]
);

export const ingredientsToRecipesRelations = relations(ingredientsToRecipes, ({ one }) => ({
	ingredient: one(ingredients, {
		fields: [ingredientsToRecipes.ingredientId],
		references: [ingredients.id]
	}),
	recipe: one(recipes, {
		fields: [ingredientsToRecipes.recipeId],
		references: [recipes.id]
	})
}));

export const recipeToNotesRelations = relations(recipeToNotes, ({ one }) => ({
	recipe: one(recipes, {
		fields: [recipeToNotes.recipeId],
		references: [recipes.id]
	}),
	note: one(notes, {
		fields: [recipeToNotes.noteId],
		references: [notes.id]
	})
}));
