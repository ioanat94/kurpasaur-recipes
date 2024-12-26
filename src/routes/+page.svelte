<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';
	import RecipeForm from '$lib/components/recipe-form.svelte';

	let isConfirmingDelete = $state(false);
	let isEditting = $state(false);

	type Recipe = {
		id: number;
		name: string;
		ingredients: { name: string; quantity: number; unit: string }[];
		directions: string[];
		imageUrl?: string;
		source?: string;
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

	async function deleteRecipe(id: number) {
		const response = await fetch(`/api/recipes/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			console.log('Recipe deleted:', await response.json());
			getAllRecipes();
		} else {
			console.error('Error deleting recipe:', await response.text());
		}
	}

	async function editRecipe(recipe: Recipe) {
		const response = await fetch(`/api/recipes/${recipe.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(recipe)
		});

		if (response.ok) {
			console.log('Recipe updated:', await response.json());
			isEditting = false;
			getAllRecipes();
		} else {
			console.error('Error updating recipe:', await response.text());
		}
	}

	onMount(() => {
		console.log('mounted');

		getAllRecipes();
	});
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">All recipes</h1>

	<div class="flex flex-wrap gap-6">
		{#if $recipes.length > 0}
			{#each $recipes as recipe}
				<AlertDialog.Root>
					<AlertDialog.Trigger
						class="border border-border w-[250px] rounded-lg flex flex-col items-center hover:opacity-80"
					>
						{#if recipe.imageUrl}
							<img src={recipe.imageUrl} alt={recipe.name} class="w-[250px] rounded-t-lg" />
						{:else}
							<img src="./placeholder_food.png" alt={recipe.name} class="w-[250px] rounded-t-lg" />
						{/if}

						<div class="h-full min-h-[40px] flex items-center justify-center">
							<h2 class="text-lg w-[230px] text-ellipsis overflow-hidden text-nowrap">
								{recipe.name}
							</h2>
						</div>
					</AlertDialog.Trigger>
					<AlertDialog.Content
						class="bg-primary text-primary-foreground max-h-[80%] max-w-[50%] overflow-auto"
					>
						<AlertDialog.Cancel
							class="border-2 bg-primary w-min rounded-full px-[9px] py-2 h-8 absolute right-4 top-4 font-bold"
							>X</AlertDialog.Cancel
						>

						{#if isEditting}
							<RecipeForm {recipe} handleSubmit={() => editRecipe(recipe)} bind:isEditting />
						{:else}
							<div class="flex items-center">
								<p class="text-xl font-bold">{recipe.name}</p>
								{#if recipe.source}
									<Button variant="ghost" class="px-2 hover:bg-primary hover:opacity-60"
										><a
											aria-label="Link to source"
											href={recipe.source}
											target="_blank"
											rel="noopener noreferrer"
											><img src="/source.png" alt="Edit button" width={20} /></a
										></Button
									>
								{/if}
							</div>

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
											<span class="border rounded-full py-0 px-1.5 h-min">{index + 1}</span
											>{direction}
										</p>
									{/each}
								</div>
							</div>

							<AlertDialog.Footer class="flex items-center gap-2">
								{#if isConfirmingDelete}
									Do you really want to delete this recipe?
									<AlertDialog.Cancel
										class="p-0 bg-[#dc2626] w-min border-none rounded-lg"
										on:click={() => {
											deleteRecipe(recipe.id);
											isConfirmingDelete = false;
										}}
										><Button variant="destructive" class="px-3">Yes</Button>
									</AlertDialog.Cancel>
									<Button
										variant="outline"
										class="px-3 text-primary"
										on:click={() => (isConfirmingDelete = false)}>No</Button
									>
								{:else}
									<Button variant="outline" class="px-2" on:click={() => (isEditting = true)}
										><img src="/edit.png" alt="Edit button" width={20} /></Button
									>
									<Button
										variant="destructive"
										class="px-2"
										on:click={() => (isConfirmingDelete = true)}
										><img src="/delete.png" alt="Edit button" width={20} /></Button
									>
								{/if}
							</AlertDialog.Footer>
						{/if}
					</AlertDialog.Content>
				</AlertDialog.Root>
			{/each}
		{:else}
			<p>No recipes found.</p>
		{/if}
	</div>
</div>
