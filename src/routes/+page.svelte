<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';
	import RecipeForm from '$lib/components/recipe-form.svelte';
	import RecipeCard from '$lib/components/recipe-card.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let isConfirmingDelete = $state(false);
	let isEditting = $state(false);
	let isShowingNotes = $state(false);
	let isAddingNote = $state(false);
	let newNoteContent = $state('');
	let noteToBeDeleted = $state<number>();
	let noteToBeEditted = $state<number>();

	type Recipe = {
		id: number;
		name: string;
		ingredients: { name: string; quantity: number; unit: string }[];
		directions: string[];
		imageUrl?: string;
		source?: string;
		notes?: { id: number; content: string }[];
	};

	let recipes = writable<Recipe[]>([]);

	async function getAllRecipes() {
		const response = await fetch('/api/recipes', {
			method: 'GET'
		});

		if (response.ok) {
			const data = await response.json();
			recipes.set(data.recipesByName);
		} else {
			console.error('Error fetching recipes:', await response.text());
		}
	}

	async function deleteRecipe(id: number) {
		const response = await fetch(`/api/recipes/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			getAllRecipes();
		} else {
			console.error('Error deleting recipe:', await response.text());
		}
	}

	async function editRecipe(recipe: Recipe) {
		const response = await fetch(`/api/recipes/${recipe.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(recipe)
		});

		if (response.ok) {
			isEditting = false;
			getAllRecipes();
		} else {
			console.error('Error updating recipe:', await response.text());
		}
	}

	async function addNote(recipeId: number) {
		const response = await fetch(`/api/notes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content: newNoteContent, recipeId })
		});

		if (response.ok) {
			getAllRecipes();
		} else {
			console.error('Error adding note:', await response.text());
		}
	}

	async function deleteNote(id: number) {
		const response = await fetch(`/api/notes/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			getAllRecipes();
		} else {
			console.error('Error deleting note:', await response.text());
		}
	}

	async function editNote(id: number, content: string) {
		const response = await fetch(`/api/notes/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});

		if (response.ok) {
			getAllRecipes();
		} else {
			console.error('Error updating note:', await response.text());
		}
	}

	onMount(() => {
		getAllRecipes();
	});
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

						{#if isEditting}
							<RecipeForm {recipe} handleSubmit={() => editRecipe(recipe)} bind:isEditting />
						{:else}
							<div class="flex items-center">
								<p class="text-xl font-bold">{recipe.name}</p>
								{#if recipe.source}
									<Button variant="ghost" class="px-2 hover:bg-primary hover:opacity-60"
										><a
											aria-label="Link to source"
											href={recipe.source}
											target="_blank"
											rel="noopener noreferrer"
											><img src="/source.png" alt="Edit button" width={20} /></a
										></Button
									>
								{/if}
							</div>

							<div class="flex flex-col gap-4">
								<div>
									<p class="text-lg underline underline-offset-4 font-semibold pb-2">Ingredients</p>
									{#each recipe.ingredients as ingredient}
										<p>• {ingredient.quantity} {ingredient.unit} {ingredient.name}</p>
									{/each}
								</div>

								<div class="flex flex-col gap-4">
									<p class="text-lg underline underline-offset-4 font-semibold">Instructions</p>
									{#each recipe.directions as direction, index}
										<p class="flex gap-2">
											<span class="border rounded-full py-0 px-1.5 h-min">{index + 1}</span
											>{direction}
										</p>
									{/each}
								</div>
							</div>

							{#if isShowingNotes}
								<div>
									<p class="text-lg underline underline-offset-4 font-semibold pb-2">Notes</p>
									{#if recipe.notes && recipe.notes.length > 0 && recipe.notes[0].id}
										<div class="flex flex-col gap-2">
											{#each recipe.notes as note}
												<div class="flex items-center gap-2">
													{#if noteToBeEditted === note.id}
														<Input
															type="text"
															placeholder="Edit note..."
															class="border border-primary rounded-lg p-2 w-full text-primary"
															value={note.content}
															on:input={(e) =>
																(note.content = (e.target as HTMLInputElement).value)}
														/>
														<Button
															variant="positive"
															class="px-2"
															on:click={() => {
																editNote(note.id, note.content);
																noteToBeEditted = undefined;
															}}>Save</Button
														>
														<Button
															variant="outline"
															class="px-2 text-primary"
															on:click={() => (noteToBeEditted = undefined)}>Cancel</Button
														>
													{:else}
														<p>• {note.content}</p>

														{#if noteToBeDeleted === note.id}
															<div class="flex items-center gap-2">
																<p>Delete note?</p>
																<Button
																	variant="destructive"
																	class="px-2 h-2"
																	on:click={() => {
																		noteToBeDeleted = undefined;
																		deleteNote(note.id);
																	}}>Yes</Button
																>
																<Button
																	variant="outline"
																	class="px-2 text-primary h-2"
																	on:click={() => (noteToBeDeleted = undefined)}>No</Button
																>
															</div>
														{:else}
															<Button
																variant="outline"
																class="px-2 text-primary h-2"
																on:click={() => (noteToBeEditted = note.id)}>Edit</Button
															>
															<Button
																variant="destructive"
																class="px-2 h-2"
																on:click={() => (noteToBeDeleted = note.id)}>Delete</Button
															>
														{/if}
													{/if}
												</div>
											{/each}
										</div>
									{:else}
										<p>No notes found.</p>
									{/if}
								</div>
							{/if}

							<AlertDialog.Footer class="flex items-center gap-2">
								{#if isConfirmingDelete}
									Do you really want to delete this recipe?
									<AlertDialog.Cancel
										class="p-0 bg-[#dc2626] w-min border-none rounded-lg"
										on:click={() => {
											deleteRecipe(recipe.id);
											isConfirmingDelete = false;
										}}
										><Button variant="destructive" class="px-3">Yes</Button>
									</AlertDialog.Cancel>
									<Button
										variant="outline"
										class="px-3 text-primary"
										on:click={() => (isConfirmingDelete = false)}>No</Button
									>
								{:else if isAddingNote}
									<div class="flex gap-2 grow">
										<Input
											type="text"
											placeholder="Add a note..."
											class="border border-primary rounded-lg p-2 w-full text-primary"
											on:input={(e) => (newNoteContent = (e.target as HTMLInputElement).value)}
										/>
										<Button
											variant="positive"
											class="px-2"
											on:click={() => {
												addNote(recipe.id);
												isAddingNote = false;
											}}>Add</Button
										>
										<Button
											variant="outline"
											class="px-2 text-primary"
											on:click={() => (isAddingNote = false)}>Cancel</Button
										>
									</div>
								{:else}
									<div class="flex justify-between w-full">
										<div class="flex gap-2">
											<Button
												variant="outline"
												class="px-2 text-primary"
												on:click={() => (isShowingNotes = !isShowingNotes)}
												>{isShowingNotes ? 'Hide' : 'Show'} notes</Button
											><Button
												variant="positive"
												class="px-2"
												on:click={() => (isAddingNote = true)}>Add note</Button
											>
										</div>
										<div class="flex gap-2">
											<Button variant="outline" class="px-2" on:click={() => (isEditting = true)}
												><img src="/edit.png" alt="Edit button" width={20} /></Button
											>
											<Button
												variant="destructive"
												class="px-2"
												on:click={() => (isConfirmingDelete = true)}
												><img src="/delete.png" alt="Delete button" width={20} /></Button
											>
										</div>
									</div>
								{/if}
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
