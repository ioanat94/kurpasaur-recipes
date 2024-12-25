<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type Recipe = {
		name: string;
		ingredients: { name: string; quantity: number; unit: string }[];
		directions: string[];
	};

	let recipes = writable<Recipe[]>([]);

	async function getAllRecipes() {
		const response = await fetch('/api/recipes', {
			method: 'GET'
		});

		if (response.ok) {
			const data = await response.json();
			recipes.set(data);

			console.log('Recipes:', data);
		} else {
			console.error('Error fetching recipes:', await response.text());
		}
	}

	onMount(() => {
		console.log('mounted');

		getAllRecipes();
	});
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">All recipes</h1>

	{#if $recipes.length > 0}
		{#each $recipes as recipe}
			<Card.Root class="max-w-[400px] max-h-[400px] overflow-auto">
				<Card.Header>{recipe.name}</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<div class="pb-4 border-b border-border">
						<p class="text-lg">Ingredients</p>
						{#each recipe.ingredients as ingredient}
							<p>• {ingredient.quantity} {ingredient.unit} {ingredient.name}</p>
						{/each}
					</div>

					<div class="flex flex-col gap-4">
						<p class="text-lg">Instructions</p>
						{#each recipe.directions as direction, index}
							<p
								class={`flex gap-2 pb-4 ${index !== recipe.directions.length - 1 && 'border-b border-border'}`}
							>
								<span class="border rounded-full py-0 px-1.5 h-min">{index + 1}</span>{direction}
							</p>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	{:else}
		<p>No recipes found.</p>
	{/if}
</div>
