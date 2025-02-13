<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import RecipeForm from '$lib/components/recipe-form.svelte';
	import RecipeCard from '$lib/components/recipe-card.svelte';
	import { getAllRecipes, editRecipe, type Recipe } from '$lib/fetchHandlers';
	import RecipeDetails from '$lib/components/recipe-details.svelte';
	import RecipeDetailsFooter from '$lib/components/recipe-details-footer.svelte';

	let isConfirmingDelete = writable(false);
	let isEditting = writable(false);
	let isShowingNotes = writable(true);
	let isAddingNote = writable(false);
	let newNoteContent = writable('');
	let noteToBeDeleted = writable<number | undefined>();
	let noteToBeEditted = writable<number | undefined>();

	let recipes = writable<Recipe[]>([]);

	async function fetchAllRecipes() {
		const allRecipes = await getAllRecipes();
		recipes.set(allRecipes);
	}

	onMount(() => {
		fetchAllRecipes();
	});

	function handleEditRecipeSubmit(recipe: Recipe) {
		editRecipe(recipe).then(() => fetchAllRecipes());
		isEditting.set(false);
	}

	function handleCancelEdit() {
		isEditting.set(false);
	}

	function setIsShowingNotes(value: boolean) {
		isShowingNotes.set(value);
	}

	function setNoteToBeEditted(value: number | undefined) {
		noteToBeEditted.set(value);
	}

	function setNoteToBeDeleted(value: number | undefined) {
		noteToBeDeleted.set(value);
	}

	function setIsConfirmingDelete(value: boolean) {
		isConfirmingDelete.set(value);
	}

	function setIsAddingNote(value: boolean) {
		isAddingNote.set(value);
	}

	function setNewNoteContent(value: string) {
		newNoteContent.set(value);
	}

	function setIsEditting(value: boolean) {
		isEditting.set(value);
	}
</script>

<div class="flex flex-col gap-6 pt-4">
	<h1 class="text-2xl">All recipes</h1>

	<div class="flex flex-wrap gap-6">
		{#if $recipes.length > 0}
			{#each $recipes as recipe}
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<RecipeCard {recipe} />
					</AlertDialog.Trigger>
					<AlertDialog.Content
						class="bg-primary text-primary-foreground max-h-[80%] max-w-[50%] overflow-auto"
					>
						<AlertDialog.Cancel
							class="border-2 bg-primary w-min rounded-full px-[9px] py-2 h-8 absolute right-4 top-4 font-bold"
							>X</AlertDialog.Cancel
						>

						{#if $isEditting}
							<RecipeForm
								{recipe}
								isEditting={$isEditting}
								onSubmit={handleEditRecipeSubmit}
								onCancel={handleCancelEdit}
							/>
						{:else}
							<RecipeDetails
								{recipe}
								{fetchAllRecipes}
								isShowingNotes={$isShowingNotes}
								noteToBeEditted={$noteToBeEditted}
								{setNoteToBeEditted}
								noteToBeDeleted={$noteToBeDeleted}
								{setNoteToBeDeleted}
							/>

							<AlertDialog.Footer class="flex items-center gap-2">
								<RecipeDetailsFooter
									{recipe}
									{fetchAllRecipes}
									isConfirmingDelete={$isConfirmingDelete}
									{setIsConfirmingDelete}
									isAddingNote={$isAddingNote}
									{setIsAddingNote}
									newNoteContent={$newNoteContent}
									{setNewNoteContent}
									isShowingNotes={$isShowingNotes}
									{setIsShowingNotes}
									{setIsEditting}
								/>
							</AlertDialog.Footer>
						{/if}
					</AlertDialog.Content>
				</AlertDialog.Root>
			{/each}
		{:else}
			<p>No recipes found.</p>
		{/if}
	</div>
</div>
