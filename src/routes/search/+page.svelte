<script lang="ts">
	import RecipeCard from '$lib/components/recipe-card.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onDestroy } from 'svelte';

	type Recipe = {
		id: number;
		name: string;
		description: string;
		ingredients: string[];
		steps: string[];
	};

	let debounceTimeout: NodeJS.Timeout;

	let searchTerm = $state('');
	let searchResults: {
		recipesByName: Recipe[];
		recipesByIngredient: Recipe[];
	} = $state({
		recipesByName: [],
		recipesByIngredient: []
	});

	async function searchRecipes(searchTerm: string) {
		const response = await fetch(`/api/recipes?searchTerm=${searchTerm}`, {
			method: 'GET'
		});

		if (response.ok) {
			const data = await response.json();

			searchResults = data;
		} else {
			console.error('Error fetching search results:', await response.text());
		}
	}

	function handleInput(event: Event) {
		const input = (event.target as HTMLInputElement).value;
		searchTerm = input;

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		if (searchTerm.length > 2) {
			debounceTimeout = setTimeout(() => {
				searchRecipes(searchTerm);
			}, 500); // Adjust the delay as needed
		}
	}

	onDestroy(() => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
	});
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">Search recipes</h1>

	<Input
		type="search"
		placeholder="Start typing to see results"
		class="max-w-[800px]"
		on:input={handleInput}
	/>

	<div class="flex flex-col gap-4">
		{#if searchResults.recipesByName.length > 0}
			<div class="flex flex-col gap-4 border-b border-primary-foreground pb-4">
				<p class="text-xl">Recipes with "{searchTerm}" in the title</p>
				<div>
					{#each searchResults.recipesByName as recipe}
						<RecipeCard {recipe} />
					{/each}
				</div>
			</div>
		{/if}

		{#if searchResults.recipesByIngredient.length > 0}
			<div class="flex flex-col gap-4">
				<p class="text-xl">Recipes with "{searchTerm}" in the ingredients</p>
				<div>
					{#each searchResults.recipesByIngredient as recipe}
						<RecipeCard {recipe} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
