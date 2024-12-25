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
	imageUrl: varchar({ length: 255 })
});

export const ingredientsToRecipes = pgTable(
	'ingredients_recipes',
	{
		ingredientId: integer('ingredient_id')
			.notNull()
			.references(() => ingredients.id),
		recipeId: integer('recipe_id')
			.notNull()
			.references(() => recipes.id),
		quantity: integer().notNull(),
		unit: varchar({ length: 50 }).notNull()
	},
	(t) => [primaryKey({ columns: [t.ingredientId, t.recipeId] })]
);

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
	recipes: many(ingredientsToRecipes)
}));

export const recipesRelations = relations(recipes, ({ many }) => ({
	users: many(ingredientsToRecipes)
}));

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
