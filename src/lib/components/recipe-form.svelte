<script lang="ts">
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import Label from './ui/label/label.svelte';
	import Textarea from './ui/textarea/textarea.svelte';

	type RecipeFormProps = {
		recipe: {
			name: string;
			ingredients: { name: string; quantity: number | string; unit: string }[];
			directions: string[];
			imageUrl?: string;
			source?: string;
		};
		handleSubmit: (event: Event) => void;
		isEditting?: boolean;
	};

	let { recipe, handleSubmit, isEditting = $bindable() }: RecipeFormProps = $props();

	function addIngredient() {
		recipe.ingredients.push({ name: '', quantity: '', unit: '' });
		recipe = { ...recipe };
	}

	function addDirection() {
		recipe.directions.push('');
		recipe = { ...recipe };
	}
</script>

<form onsubmit={handleSubmit} class="dark flex flex-col gap-6 max-w-[765px]">
	<div class="flex w-full flex-col gap-4 bg-primary-foreground p-4 rounded-md">
		<Label class="text-md">Recipe Details</Label>

		<div class="flex flex-col gap-1">
			<Label for="name" class="text-sm">Name</Label>
			<Input
				type="text"
				name="name"
				class="max-w-[678px]"
				onchange={(event) => {
					recipe = {
						...recipe,
						name: (event.target as HTMLInputElement).value
					};
				}}
				bind:value={recipe.name}
			/>
		</div>

		<div class="flex flex-col gap-1">
			<Label for="source" class="text-sm">Source</Label>
			<Input
				type="text"
				name="source"
				class="max-w-[678px]"
				onchange={(event) => {
					recipe = {
						...recipe,
						source: (event.target as HTMLInputElement).value
					};
				}}
				bind:value={recipe.source}
			/>
		</div>

		<div class="flex flex-col gap-1">
			<Label for="image-url" class="text-sm">Image URL</Label>
			<Input
				type="text"
				name="image-url"
				class="max-w-[678px]"
				onchange={(event) => {
					recipe = {
						...recipe,
						imageUrl: (event.target as HTMLInputElement).value
					};
				}}
				bind:value={recipe.imageUrl}
			/>
		</div>
	</div>

	<div class="flex flex-col gap-4 bg-primary-foreground p-4 rounded-md">
		<Label class="text-md">Ingredients</Label>
		{#each recipe.ingredients as ingredient, index}
			<div class="flex gap-4">
				<span class="mt-8">•</span>
				<div class="flex flex-col gap-1">
					<Label for="ingredient-name" class="text-sm">Name</Label>
					<Input
						type="text"
						name="ingredient-name"
						class="w-min"
						onchange={(event) => {
							recipe.ingredients[index].name = (event.target as HTMLInputElement).value;
							recipe = { ...recipe };
						}}
						bind:value={recipe.ingredients[index].name}
					/>
				</div>

				<div class="flex flex-col gap-1">
					<Label for="quantity" class="text-sm">Quantity</Label>
					<Input
						type="text"
						name="quantity"
						class="w-min"
						onchange={(event) => {
							recipe.ingredients[index].quantity = (event.target as HTMLInputElement).value;
							recipe = { ...recipe };
						}}
						bind:value={recipe.ingredients[index].quantity}
					/>
				</div>

				<div class="flex flex-col gap-1">
					<Label for="unit" class="text-sm">Unit</Label>
					<Input
						type="text"
						name="unit"
						class="w-min"
						onchange={(event) => {
							recipe.ingredients[index].unit = (event.target as HTMLInputElement).value;

							recipe = { ...recipe };
						}}
						bind:value={recipe.ingredients[index].unit}
					/>
				</div>

				<Button
					type="button"
					on:click={() => {
						recipe.ingredients.splice(index, 1);
						recipe = { ...recipe };
					}}
					class="px-2 mt-6"
					variant="ghost"
					disabled={recipe.ingredients.length === 1}
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
		{#each recipe.directions as direction, index}
			<div class="flex gap-1.5 items-center">
				<span class="min-w-14 text-sm">Step {index + 1}:</span>
				<Textarea
					name="direction"
					class="max-w-[615px]"
					rows={1}
					on:change={(event) => {
						recipe.directions[index] = (event.target as HTMLTextAreaElement).value;
						recipe = { ...recipe };
					}}
					bind:value={recipe.directions[index]}
				></Textarea>

				<Button
					type="button"
					on:click={() => {
						recipe.directions.splice(index, 1);
						recipe = { ...recipe };
					}}
					class="px-2 ml-2.5"
					variant="ghost"
					disabled={recipe.directions.length === 1}
				>
					<img src="/remove.png" width="24px" alt="Remove icon" />
				</Button>
			</div>
		{/each}
		<Button type="button" on:click={addDirection} class="w-min" variant="secondary">Add Step</Button
		>
	</div>

	<div class="flex gap-4">
		<Button type="submit" class="w-min font-bold" variant="positive">Save recipe</Button>

		{#if isEditting}
			<Button
				type="button"
				class="w-min font-bold"
				on:click={() => {
					isEditting = false;
				}}>Cancel</Button
			>
		{/if}
	</div>
</form>
