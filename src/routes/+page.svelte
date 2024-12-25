<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';

	type Recipe = {
		name: string;
		ingredients: { name: string; quantity: number; unit: string }[];
		directions: string[];
		imageUrl: string;
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
			<AlertDialog.Root>
				<AlertDialog.Trigger
					class="border border-border w-[250px] rounded-lg flex flex-col items-center"
				>
					<img src={recipe.imageUrl} alt={recipe.name} class="w-[250px] rounded-t-lg" />
					<h2
						class="text-lg h-[40px] w-[230px] text-center pt-1.5 text-ellipsis overflow-hidden text-nowrap"
					>
						{recipe.name}
					</h2>
				</AlertDialog.Trigger>
				<AlertDialog.Content
					class="bg-primary text-primary-foreground max-h-[80%] max-w-[50%] overflow-auto"
				>
					<AlertDialog.Cancel
						class="border-2 bg-primary w-min rounded-full px-[9px] py-2 h-8 absolute right-4 top-4 font-bold"
						>X</AlertDialog.Cancel
					>
					<p class="text-xl font-bold">{recipe.name}</p>
					<div class="flex flex-col gap-4">
						<div>
							<p class="text-lg underline underline-offset-4 font-semibold">Ingredients</p>
							{#each recipe.ingredients as ingredient}
								<p>• {ingredient.quantity} {ingredient.unit} {ingredient.name}</p>
							{/each}
						</div>

						<div class="flex flex-col gap-4">
							<p class="text-lg underline underline-offset-4 font-semibold">Instructions</p>
							{#each recipe.directions as direction, index}
								<p class="flex gap-2">
									<span class="border rounded-full py-0 px-1.5 h-min">{index + 1}</span>{direction}
								</p>
							{/each}
						</div>
					</div>

					<AlertDialog.Footer class="flex gap-2">
						<Button variant="outline" class="px-2"
							><img src="/edit.png" alt="Edit button" width={20} /></Button
						>
						<Button variant="destructive" class="px-2"
							><img src="/delete.png" alt="Edit button" width={20} /></Button
						>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		{/each}
	{:else}
		<p>No recipes found.</p>
	{/if}
</div>
