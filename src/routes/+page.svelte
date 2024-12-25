<script lang="ts">
	import { onMount } from 'svelte';

	async function getAllRecipes() {
		const response = await fetch('/api/recipes', {
			method: 'GET'
		});

		console.log('response', response);
	}

	onMount(() => {
		console.log('mounted');

		getAllRecipes();
	});
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">All recipes</h1>
</div>
