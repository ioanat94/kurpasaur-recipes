<script lang="ts">
	import RecipeForm from '$lib/components/recipe-form.svelte';
	import { addRecipe, type Recipe } from '$lib/fetchHandlers';

	let newRecipe: Recipe = {
		id: 0,
		name: '',
		ingredients: [{ name: '', quantity: '', unit: '' }],
		directions: [''],
		imageUrl: '',
		source: '',
		notes: []
	};

	async function handleAddRecipeSubmit(recipe: Recipe) {
		newRecipe = recipe;
		await addRecipe(newRecipe);
		resetForm();
	}

	function resetForm() {
		newRecipe = {
			id: 0,
			name: '',
			ingredients: [{ name: '', quantity: '', unit: '' }],
			directions: [''],
			imageUrl: '',
			source: '',
			notes: []
		};
	}

	function handleCancelAdd() {
		resetForm();
	}
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">Add new recipe</h1>

	<RecipeForm
		recipe={newRecipe}
		isEditting={false}
		onSubmit={handleAddRecipeSubmit}
		onCancel={handleCancelAdd}
	/>
</div>
