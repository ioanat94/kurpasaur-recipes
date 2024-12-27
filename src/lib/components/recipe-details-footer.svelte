<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { addNote, deleteRecipe, type Recipe } from '$lib/fetchHandlers';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';

	export let recipe: Recipe;
	export let fetchAllRecipes: () => void;
	export let isConfirmingDelete: boolean;
	export let setIsConfirmingDelete: (value: boolean) => void;
	export let isAddingNote: boolean;
	export let setIsAddingNote: (value: boolean) => void;
	export let newNoteContent: string;
	export let setNewNoteContent: (value: string) => void;
	export let isShowingNotes: boolean;
	export let setIsShowingNotes: (value: boolean) => void;
	export let setIsEditting: (value: boolean) => void;
</script>

{#if isConfirmingDelete}
	Do you really want to delete this recipe?
	<AlertDialog.Cancel
		class="p-0 bg-[#dc2626] w-min border-none rounded-lg"
		on:click={() => {
			deleteRecipe(recipe.id).then(() => fetchAllRecipes());
			setIsConfirmingDelete(false);
		}}
		><Button variant="destructive" class="px-3">Yes</Button>
	</AlertDialog.Cancel>
	<Button variant="outline" class="px-3 text-primary" on:click={() => setIsConfirmingDelete(false)}
		>No</Button
	>
{:else if isAddingNote}
	<div class="flex gap-2 grow">
		<Input
			type="text"
			placeholder="Add a note..."
			class="border border-primary rounded-lg p-2 w-full text-primary"
			on:input={(e) => setNewNoteContent((e.target as HTMLInputElement).value)}
		/>
		<Button
			variant="positive"
			class="px-2"
			on:click={() => {
				addNote(recipe.id, newNoteContent).then(() => fetchAllRecipes());
				setIsAddingNote(false);
			}}>Add</Button
		>
		<Button variant="outline" class="px-2 text-primary" on:click={() => setIsAddingNote(false)}
			>Cancel</Button
		>
	</div>
{:else}
	<div class="flex justify-between w-full">
		<div class="flex gap-2">
			<Button
				variant="outline"
				class="px-2 text-primary"
				on:click={() => {
					if (isShowingNotes === true) {
						setIsShowingNotes(false);
					} else {
						setIsShowingNotes(true);
					}
				}}>{isShowingNotes ? 'Hide' : 'Show'} notes</Button
			><Button variant="positive" class="px-2" on:click={() => setIsAddingNote(true)}
				>Add note</Button
			>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" class="px-2" on:click={() => setIsEditting(true)}
				><img src="/edit.png" alt="Edit button" width={20} /></Button
			>
			<Button variant="destructive" class="px-2" on:click={() => setIsConfirmingDelete(true)}
				><img src="/delete.png" alt="Delete button" width={20} /></Button
			>
		</div>
	</div>
{/if}
