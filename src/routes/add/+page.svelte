<script lang="ts">
	import RecipeForm from '$lib/components/recipe-form.svelte';

	let newRecipe = $state({
		name: '',
		ingredients: [{ name: '', quantity: '', unit: '' }],
		directions: [''],
		imageUrl: '',
		source: ''
	});

	async function addRecipe(event: Event) {
		event.preventDefault();

		const response = await fetch('/api/recipes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newRecipe)
		});

		if (response.ok) {
			console.log('Recipe added:', await response.json());
			resetForm();
		} else {
			console.error('Error adding recipe:', await response.text());
		}
	}

	function resetForm() {
		newRecipe = {
			name: '',
			ingredients: [{ name: '', quantity: '', unit: '' }],
			directions: [''],
			imageUrl: '',
			source: ''
		};
	}
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">Add new recipe</h1>
	<RecipeForm recipe={newRecipe} handleSubmit={addRecipe} />
</div>
