<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { onMount } from 'svelte';

	let newRecipe = $state({
		name: '',
		ingredients: [{ name: '', quantity: 0 }],
		directions: ['']
	});

	async function getAllRecipes() {
		const response = await fetch('/api/recipes', {
			method: 'GET'
		});

		console.log('response', response);
	}

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
			getAllRecipes();
		} else {
			console.error('Error adding recipe:', await response.text());
		}
	}

	function addIngredient() {
		newRecipe.ingredients.push({ name: '', quantity: 0 });
		newRecipe = { ...newRecipe };
	}

	function addDirection() {
		newRecipe.directions.push('');
		newRecipe = { ...newRecipe };
	}

	onMount(() => {
		console.log('mounted');

		getAllRecipes();
	});
</script>

<form onsubmit={addRecipe} class="text-primary">
	<div class="flex w-full max-w-sm flex-col gap-1.5">
		<Label for="name" class="text-primary-foreground">Recipe Name</Label>
		<Input
			type="text"
			name="name"
			placeholder="Recipe Name"
			class="w-min"
			onchange={(event) => {
				newRecipe = {
					...newRecipe,
					name: (event.target as HTMLInputElement).value
				};
			}}
			bind:value={newRecipe.name}
		/>
	</div>

	<div class="flex w-full max-w-sm flex-col gap-1.5">
		<Label for="ingredients" class="text-primary-foreground">Ingredients</Label>
		{#each newRecipe.ingredients as ingredient, index}
			<div class="flex gap-1.5">
				<Input
					type="text"
					name="ingredient-name"
					placeholder="Ingredient Name"
					class="w-min"
					onchange={(event) => {
						newRecipe.ingredients[index].name = (event.target as HTMLInputElement).value;
						newRecipe = { ...newRecipe };
					}}
					bind:value={newRecipe.ingredients[index].name}
				/>
				<Input
					type="number"
					name="quantity"
					placeholder="Quantity"
					class="w-min"
					onchange={(event) => {
						newRecipe.ingredients[index].quantity = parseInt(
							(event.target as HTMLInputElement).value
						);
						newRecipe = { ...newRecipe };
					}}
					bind:value={newRecipe.ingredients[index].quantity}
				/>
			</div>
		{/each}
		<Button type="button" on:click={addIngredient} class="w-min" variant="secondary"
			>Add Ingredient</Button
		>
	</div>

	<div class="flex w-full max-w-sm flex-col gap-1.5">
		<Label for="directions" class="text-primary-foreground">Directions</Label>
		{#each newRecipe.directions as direction, index}
			<Input
				type="text"
				name="direction"
				placeholder="Direction"
				class="w-min"
				onchange={(event) => {
					newRecipe.directions[index] = (event.target as HTMLInputElement).value;
					newRecipe = { ...newRecipe };
				}}
				bind:value={newRecipe.directions[index]}
			/>
		{/each}
		<Button type="button" on:click={addDirection} class="w-min" variant="secondary">Add Step</Button
		>
	</div>

	<Button type="submit" class="w-min" variant="secondary">Add</Button>
</form>
