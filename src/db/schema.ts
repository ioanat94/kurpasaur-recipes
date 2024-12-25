import { integer, jsonb, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

interface RecipeIngredient {
	ingredientId: number;
	quantity: number;
}

export const ingredients = pgTable('ingredients', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull()
});

export const recipes = pgTable('recipes', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	directions: text().notNull().array(),
	ingredients: jsonb().notNull().$type<RecipeIngredient[]>()
});

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
	recipes: many(recipes)
}));

export const recipesRelations = relations(recipes, ({ many }) => ({
	ingredients: many(ingredients)
}));
