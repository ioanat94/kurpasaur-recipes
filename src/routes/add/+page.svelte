<script lang="ts">
	import RecipeForm from '$lib/components/recipe-form.svelte';

	type Recipe = {
		id: number;
		name: string;
		ingredients: { name: string; quantity: string; unit: string }[];
		directions: string[];
		imageUrl?: string;
		source?: string;
		notes?: { id: number; content: string }[];
	};

	let newRecipe: Recipe = {
		id: 0,
		name: '',
		ingredients: [{ name: '', quantity: '', unit: '' }],
		directions: [''],
		imageUrl: '',
		source: '',
		notes: []
	};

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
			resetForm();
		} else {
			console.error('Error adding recipe:', await response.text());
		}
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

	function handleAddRecipeSubmit(recipe: Recipe) {
		newRecipe = recipe;
		addRecipe(new Event('submit'));
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
