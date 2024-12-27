<script lang="ts">
	import RecipeCard from './recipe-card.svelte';

	const { searchTerm, searchResults, searchType } = $props();
</script>

<div class="flex flex-col gap-4 border-b border-primary-foreground pb-4">
	<p class="text-xl">Recipes with "{searchTerm}" in the {searchType}</p>
	<div class="flex gap-4">
		{#each searchResults as result}
			<RecipeCard recipe={result} />
		{/each}
	</div>
</div>
