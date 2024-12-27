<script lang="ts">
	import SearchResults from '$lib/components/search-results.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { searchRecipes, type Recipe } from '$lib/fetchHandlers';
	import { onDestroy } from 'svelte';

	let debounceTimeout: NodeJS.Timeout;

	let searchTerm = $state('');
	let searchResults: {
		recipesByName: Recipe[];
		recipesByIngredient: Recipe[];
	} = $state({
		recipesByName: [],
		recipesByIngredient: []
	});

	async function handleSearchRecipes(searchTerm: string) {
		searchResults = await searchRecipes(searchTerm);
	}

	function handleInput(event: Event) {
		const input = (event.target as HTMLInputElement).value;
		searchTerm = input;

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		if (searchTerm.length > 2) {
			debounceTimeout = setTimeout(() => {
				handleSearchRecipes(searchTerm);
			}, 500);
		}

		if (searchTerm.length <= 2) {
			searchResults = {
				recipesByName: [],
				recipesByIngredient: []
			};
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
			<SearchResults {searchTerm} searchResults={searchResults.recipesByName} searchType="title" />
		{/if}

		{#if searchResults.recipesByIngredient.length > 0}
			<SearchResults
				{searchTerm}
				searchResults={searchResults.recipesByIngredient}
				searchType="ingredients"
			/>
		{/if}
	</div>
</div>
