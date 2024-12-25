CREATE TABLE "ingredients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredients_recipes" (
	"ingredient_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit" varchar(50) NOT NULL,
	CONSTRAINT "ingredients_recipes_ingredient_id_recipe_id_pk" PRIMARY KEY("ingredient_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"directions" text[]
);
--> statement-breakpoint
ALTER TABLE "ingredients_recipes" ADD CONSTRAINT "ingredients_recipes_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredients_recipes" ADD CONSTRAINT "ingredients_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;