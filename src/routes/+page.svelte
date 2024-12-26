<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';
	import RecipeForm from '$lib/components/recipe-form.svelte';
	import RecipeCard from '$lib/components/recipe-card.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	let isConfirmingDelete = writable(false);
	let isEditting = writable(false);
	let isShowingNotes = writable(false);
	let isAddingNote = writable(false);
	let newNoteContent = writable('');
	let noteToBeDeleted = writable<number | undefined>();
	let noteToBeEditted = writable<number | undefined>();

	type Recipe = {
		id: number;
		name: string;
		ingredients: { name: string; quantity: string; unit: string }[];
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
			getAllRecipes();
		} else {
			console.error('Error updating recipe:', await response.text());
		}
	}

	async function editNote(noteId: number, content: string) {
		const response = await fetch(`/api/notes/${noteId}`, {
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

	async function deleteNote(noteId: number) {
		const response = await fetch(`/api/notes/${noteId}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			getAllRecipes();
		} else {
			console.error('Error deleting note:', await response.text());
		}
	}

	async function addNote(recipeId: number) {
		const response = await fetch(`/api/notes?recipeId=`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content: $newNoteContent, recipeId })
		});

		if (response.ok) {
			getAllRecipes();
		} else {
			console.error('Error adding note:', await response.text());
		}
	}

	onMount(() => {
		getAllRecipes();
	});

	function addIngredient(recipe: Recipe) {
		recipe.ingredients.push({ name: '', quantity: '', unit: '' });
		recipes.update((r) => r.map((rec) => (rec.id === recipe.id ? { ...recipe } : rec)));
	}

	function removeIngredient(recipe: Recipe, index: number) {
		recipe.ingredients.splice(index, 1);
		recipes.update((r) => r.map((rec) => (rec.id === recipe.id ? { ...recipe } : rec)));
	}

	function addDirection(recipe: Recipe) {
		recipe.directions.push('');
		recipes.update((r) => r.map((rec) => (rec.id === recipe.id ? { ...recipe } : rec)));
	}

	function removeDirection(recipe: Recipe, index: number) {
		recipe.directions.splice(index, 1);
		recipes.update((r) => r.map((rec) => (rec.id === recipe.id ? { ...recipe } : rec)));
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
							<form
								on:submit|preventDefault={() => editRecipe(recipe)}
								class="dark flex flex-col gap-6 max-w-[765px]"
							>
								<div class="flex w-full flex-col gap-4 bg-primary-foreground p-4 rounded-md">
									<Label class="text-md">Recipe Details</Label>

									<div class="flex flex-col gap-1">
										<Label for="name" class="text-sm">Name</Label>
										<Input type="text" name="name" class="max-w-[678px]" bind:value={recipe.name} />
									</div>

									<div class="flex flex-col gap-1">
										<Label for="source" class="text-sm">Source</Label>
										<Input
											type="text"
											name="source"
											class="max-w-[678px]"
											bind:value={recipe.source}
										/>
									</div>

									<div class="flex flex-col gap-1">
										<Label for="imageUrl" class="text-sm">Image URL</Label>
										<Input
											type="text"
											name="imageUrl"
											class="max-w-[678px]"
											bind:value={recipe.imageUrl}
										/>
									</div>

									<div class="flex flex-col gap-2">
										<Label for="ingredients" class="text-sm">Ingredients</Label>
										{#each recipe.ingredients as ingredient, index}
											<div class="flex gap-2 items-center">
												<Input type="text" placeholder="Name" bind:value={ingredient.name} />
												<Input
													type="text"
													placeholder="Quantity"
													bind:value={ingredient.quantity}
												/>
												<Input type="text" placeholder="Unit" bind:value={ingredient.unit} />
												<Button
													type="button"
													on:click={() => removeIngredient(recipe, index)}
													class="px-2 mt-0 min-w-[60px]"
													variant="ghost"
													disabled={recipe.ingredients.length === 1}
												>
													<img src="/remove.png" width="24px" alt="Remove icon" />
												</Button>
											</div>
										{/each}
										<Button
											on:click={() => addIngredient(recipe)}
											class="w-min"
											variant="secondary"
										>
											Add Ingredient
										</Button>
									</div>

									<div class="flex flex-col gap-2">
										<Label for="directions" class="text-sm">Directions</Label>
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
													on:click={() => removeDirection(recipe, index)}
													class="px-2 mt-0"
													variant="ghost"
													disabled={recipe.directions.length === 1}
												>
													<img src="/remove.png" width="24px" alt="Remove icon" />
												</Button>
											</div>
										{/each}
										<Button on:click={() => addDirection(recipe)} class="w-min" variant="secondary">
											Add Step
										</Button>
									</div>

									<div class="flex gap-2">
										<Button type="submit" variant="positive" class="w-min">Save</Button>
										<Button
											variant="outline"
											class="w-min text-primary"
											on:click={() => isEditting.set(false)}>Cancel</Button
										>
									</div>
								</div>
							</form>
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

							{#if $isShowingNotes}
								<div>
									<p class="text-lg underline underline-offset-4 font-semibold pb-2">Notes</p>
									{#if recipe.notes && recipe.notes.length > 0 && recipe.notes[0].id}
										<div class="flex flex-col gap-2">
											{#each recipe.notes as note}
												<div class="flex items-center gap-2">
													{#if $noteToBeEditted === note.id}
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
																noteToBeEditted.set(undefined);
															}}>Save</Button
														>
														<Button
															variant="outline"
															class="px-2 text-primary"
															on:click={() => noteToBeEditted.set(undefined)}>Cancel</Button
														>
													{:else}
														<p>• {note.content}</p>

														{#if $noteToBeDeleted === note.id}
															<div class="flex items-center gap-2">
																<p>Delete note?</p>
																<Button
																	variant="destructive"
																	class="px-2 h-2"
																	on:click={() => {
																		noteToBeDeleted.set(undefined);
																		deleteNote(note.id);
																	}}>Yes</Button
																>
																<Button
																	variant="outline"
																	class="px-2 text-primary h-2"
																	on:click={() => noteToBeDeleted.set(undefined)}>No</Button
																>
															</div>
														{:else}
															<Button
																variant="outline"
																class="px-2 text-primary h-2"
																on:click={() => noteToBeEditted.set(note.id)}>Edit</Button
															>
															<Button
																variant="destructive"
																class="px-2 h-2"
																on:click={() => noteToBeDeleted.set(note.id)}>Delete</Button
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
								{#if $isConfirmingDelete}
									Do you really want to delete this recipe?
									<AlertDialog.Cancel
										class="p-0 bg-[#dc2626] w-min border-none rounded-lg"
										on:click={() => {
											deleteRecipe(recipe.id);
											isConfirmingDelete.set(false);
										}}
										><Button variant="destructive" class="px-3">Yes</Button>
									</AlertDialog.Cancel>
									<Button
										variant="outline"
										class="px-3 text-primary"
										on:click={() => isConfirmingDelete.set(false)}>No</Button
									>
								{:else if $isAddingNote}
									<div class="flex gap-2 grow">
										<Input
											type="text"
											placeholder="Add a note..."
											class="border border-primary rounded-lg p-2 w-full text-primary"
											on:input={(e) => newNoteContent.set((e.target as HTMLInputElement).value)}
										/>
										<Button
											variant="positive"
											class="px-2"
											on:click={() => {
												addNote(recipe.id);
												isAddingNote.set(false);
											}}>Add</Button
										>
										<Button
											variant="outline"
											class="px-2 text-primary"
											on:click={() => isAddingNote.set(false)}>Cancel</Button
										>
									</div>
								{:else}
									<div class="flex justify-between w-full">
										<div class="flex gap-2">
											<Button
												variant="outline"
												class="px-2 text-primary"
												on:click={() => {
													if ($isShowingNotes === true) {
														isShowingNotes.set(false);
													} else {
														isShowingNotes.set(true);
													}
												}}>{$isShowingNotes ? 'Hide' : 'Show'} notes</Button
											><Button
												variant="positive"
												class="px-2"
												on:click={() => isAddingNote.set(true)}>Add note</Button
											>
										</div>
										<div class="flex gap-2">
											<Button variant="outline" class="px-2" on:click={() => isEditting.set(true)}
												><img src="/edit.png" alt="Edit button" width={20} /></Button
											>
											<Button
												variant="destructive"
												class="px-2"
												on:click={() => isConfirmingDelete.set(true)}
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
