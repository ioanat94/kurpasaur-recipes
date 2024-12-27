<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Recipe } from '$lib/fetchHandlers';

	export let recipe: Recipe;
	export let isEditting: boolean;
	export let onSubmit: (recipe: Recipe) => void;
	export let onCancel: () => void;

	function addIngredient() {
		recipe.ingredients.push({ name: '', quantity: '', unit: '' });
		recipe = { ...recipe };
	}

	function removeIngredient(index: number) {
		recipe.ingredients.splice(index, 1);
		recipe = { ...recipe };
	}

	function addDirection() {
		recipe.directions.push('');
		recipe = { ...recipe };
	}

	function removeDirection(index: number) {
		recipe.directions.splice(index, 1);
		recipe = { ...recipe };
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		onSubmit(recipe);
	}
</script>

<form on:submit={handleSubmit} class="dark flex flex-col gap-6 max-w-[765px]">
	<div class="flex w-full flex-col gap-4 bg-primary-foreground p-4 rounded-md">
		<div class="flex flex-col gap-1">
			<Label for="name" class="text-sm">Name</Label>
			<Input type="text" name="name" class="max-w-[678px]" bind:value={recipe.name} />
		</div>

		<div class="flex flex-col gap-1">
			<Label for="source" class="text-sm">Source</Label>
			<Input type="text" name="source" class="max-w-[678px]" bind:value={recipe.source} />
		</div>

		<div class="flex flex-col gap-1">
			<Label for="imageUrl" class="text-sm">Image URL</Label>
			<Input type="text" name="imageUrl" class="max-w-[678px]" bind:value={recipe.imageUrl} />
		</div>

		<div class="flex flex-col gap-1">
			<Label for="ingredients" class="text-sm">Ingredients</Label>
			<div class="flex flex-col gap-3">
				{#each recipe.ingredients as ingredient, index}
					<div class="flex gap-2 items-center">
						<Input
							type="text"
							placeholder="Name"
							class="max-w-[220px]"
							bind:value={ingredient.name}
						/>
						<Input
							type="text"
							placeholder="Quantity"
							class="max-w-[220px]"
							bind:value={ingredient.quantity}
						/>
						<Input
							type="text"
							placeholder="Unit"
							class="max-w-[220px]"
							bind:value={ingredient.unit}
						/>
						<Button
							type="button"
							on:click={() => removeIngredient(index)}
							class="px-2"
							variant="ghost"
							disabled={recipe.ingredients.length === 1}
						>
							<img src="/remove.png" width="24px" alt="Remove icon" />
						</Button>
					</div>
				{/each}
			</div>

			<Button type="button" on:click={addIngredient} class="w-min mt-3" variant="secondary">
				Add Ingredient
			</Button>
		</div>

		<div class="flex flex-col gap-1">
			<Label for="directions" class="text-sm">Directions</Label>
			<div class="flex flex-col gap-3">
				{#each recipe.directions as direction, index}
					<div class="flex gap-1.5 items-center">
						<span class="min-w-14 text-sm">Step {index + 1}:</span>
						<Textarea
							name="direction"
							class="max-w-[615px]"
							bind:value={direction}
							placeholder="Direction"
						/>
						<Button
							type="button"
							on:click={() => removeDirection(index)}
							class="px-2"
							variant="ghost"
							disabled={recipe.directions.length === 1}
						>
							<img src="/remove.png" width="24px" alt="Remove icon" />
						</Button>
					</div>
				{/each}
			</div>

			<Button type="button" on:click={addDirection} class="w-min mt-3" variant="secondary">
				Add Direction
			</Button>
		</div>

		<div class="flex gap-2">
			<Button type="submit" variant="positive" class="w-min">Save</Button>
			{#if isEditting}
				<Button type="button" class="w-min text-primary-foreground" on:click={onCancel}
					>Cancel</Button
				>
			{/if}
		</div>
	</div>
</form>
