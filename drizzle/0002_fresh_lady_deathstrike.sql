ALTER TABLE "ingredients_recipes" ALTER COLUMN "quantity" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredients_recipes" ALTER COLUMN "unit" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "source" varchar(255);