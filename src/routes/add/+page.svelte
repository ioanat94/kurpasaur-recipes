<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let newRecipe = $state({
		name: '',
		ingredients: [{ name: '', quantity: 0, unit: '' }],
		directions: [''],
		imageUrl: ''
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
			ingredients: [{ name: '', quantity: 0, unit: '' }],
			directions: [''],
			imageUrl: ''
		};
	}

	function addIngredient() {
		newRecipe.ingredients.push({ name: '', quantity: 0, unit: '' });
		newRecipe = { ...newRecipe };
	}

	function addDirection() {
		newRecipe.directions.push('');
		newRecipe = { ...newRecipe };
	}
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">Add new recipe</h1>
	<form onsubmit={addRecipe} class="flex flex-col gap-6 max-w-[765px]">
		<div class="flex w-full flex-col gap-4 bg-primary-foreground p-4 rounded-md">
			<Label class="text-md">Recipe Details</Label>

			<div class="flex flex-col gap-1">
				<Label for="name" class="text-sm">Name</Label>
				<Input
					type="text"
					name="name"
					class="max-w-[678px]"
					onchange={(event) => {
						newRecipe = {
							...newRecipe,
							name: (event.target as HTMLInputElement).value
						};
					}}
					bind:value={newRecipe.name}
				/>
			</div>

			<div class="flex flex-col gap-1">
				<Label for="image-url" class="text-sm">Image URL</Label>
				<Input
					type="text"
					name="image-url"
					class="max-w-[678px]"
					onchange={(event) => {
						newRecipe = {
							...newRecipe,
							imageUrl: (event.target as HTMLInputElement).value
						};
					}}
					bind:value={newRecipe.imageUrl}
				/>
			</div>
		</div>

		<div class="flex flex-col gap-4 bg-primary-foreground p-4 rounded-md">
			<Label class="text-md">Ingredients</Label>
			{#each newRecipe.ingredients as ingredient, index}
				<div class="flex gap-4">
					<span class="mt-8">•</span>
					<div class="flex flex-col gap-1">
						<Label for="ingredient-name" class="text-sm">Name</Label>
						<Input
							type="text"
							name="ingredient-name"
							class="w-min"
							onchange={(event) => {
								newRecipe.ingredients[index].name = (event.target as HTMLInputElement).value;
								newRecipe = { ...newRecipe };
							}}
							bind:value={newRecipe.ingredients[index].name}
						/>
					</div>

					<div class="flex flex-col gap-1">
						<Label for="quantity" class="text-sm">Quantity</Label>
						<Input
							type="number"
							name="quantity"
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

					<div class="flex flex-col gap-1">
						<Label for="unit" class="text-sm">Unit</Label>
						<Input
							type="text"
							name="unit"
							class="w-min"
							onchange={(event) => {
								newRecipe.ingredients[index].unit = (event.target as HTMLInputElement).value;

								newRecipe = { ...newRecipe };
							}}
							bind:value={newRecipe.ingredients[index].unit}
						/>
					</div>

					<Button
						type="button"
						on:click={() => {
							newRecipe.ingredients.splice(index, 1);
							newRecipe = { ...newRecipe };
						}}
						class="px-2 mt-6"
						variant="ghost"
						disabled={newRecipe.ingredients.length === 1}
					>
						<img src="/remove.png" width="24px" alt="Remove icon" />
					</Button>
				</div>
			{/each}
			<Button type="button" on:click={addIngredient} class="w-min" variant="secondary"
				>Add Ingredient</Button
			>
		</div>

		<div class="flex w-full flex-col gap-4 bg-primary-foreground p-4 rounded-md">
			<Label for="directions" class="text-md">Directions</Label>
			{#each newRecipe.directions as direction, index}
				<div class="flex gap-1.5 items-center">
					<span class="min-w-14 text-sm">Step {index + 1}:</span>
					<Textarea
						name="direction"
						class="max-w-[615px]"
						rows={1}
						on:change={(event) => {
							newRecipe.directions[index] = (event.target as HTMLTextAreaElement).value;
							newRecipe = { ...newRecipe };
						}}
						bind:value={newRecipe.directions[index]}
					></Textarea>

					<Button
						type="button"
						on:click={() => {
							newRecipe.directions.splice(index, 1);
							newRecipe = { ...newRecipe };
						}}
						class="px-2 ml-2.5"
						variant="ghost"
						disabled={newRecipe.directions.length === 1}
					>
						<img src="/remove.png" width="24px" alt="Remove icon" />
					</Button>
				</div>
			{/each}
			<Button type="button" on:click={addDirection} class="w-min" variant="secondary"
				>Add Step</Button
			>
		</div>

		<Button type="submit" class="w-min font-bold" variant="positive">Save recipe</Button>
	</form>
</div>
