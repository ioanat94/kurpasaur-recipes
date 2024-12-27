<script lang="ts">
	import { deleteNote, editNote, type Recipe } from '$lib/fetchHandlers';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';

	export let recipe: Recipe;
	export let fetchAllRecipes: () => void;
	export let isShowingNotes: boolean;
	export let noteToBeEditted: number | undefined;
	export let setNoteToBeEditted: (value: number | undefined) => void;
	export let noteToBeDeleted: number | undefined;
	export let setNoteToBeDeleted: (value: number | undefined) => void;
</script>

<div class="flex items-center">
	<p class="text-xl font-bold">{recipe.name}</p>
	{#if recipe.source}
		<Button variant="ghost" class="px-2 hover:bg-primary hover:opacity-60"
			><a aria-label="Link to source" href={recipe.source} target="_blank" rel="noopener noreferrer"
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
				<span class="border rounded-full py-0 px-1.5 h-min">{index + 1}</span>{direction}
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
					<div class="flex items-center gap-2 min-h-10">
						{#if noteToBeEditted === note.id}
							<Input
								type="text"
								placeholder="Edit note..."
								class="border border-primary rounded-lg p-2 w-full text-primary"
								value={note.content}
								on:input={(e) => (note.content = (e.target as HTMLInputElement).value)}
							/>
							<Button
								variant="positive"
								class="px-2"
								on:click={() => {
									editNote(note.id, note.content).then(() => fetchAllRecipes());
									setNoteToBeEditted(undefined);
								}}>Save</Button
							>
							<Button
								variant="outline"
								class="px-2 text-primary"
								on:click={() => setNoteToBeEditted(undefined)}>Cancel</Button
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
											setNoteToBeDeleted(undefined);
											deleteNote(note.id).then(() => fetchAllRecipes());
										}}>Yes</Button
									>
									<Button
										class="px-2 text-primary h-2 bg-secondary hover:bg-secondary hover:opacity-90"
										on:click={() => setNoteToBeDeleted(undefined)}>No</Button
									>
								</div>
							{:else}
								<Button
									class="px-2 text-primary h-2 bg-secondary hover:bg-secondary hover:opacity-90"
									on:click={() => setNoteToBeEditted(note.id)}>Edit</Button
								>
								<Button
									variant="destructive"
									class="px-2 h-2"
									on:click={() => setNoteToBeDeleted(note.id)}>Delete</Button
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
