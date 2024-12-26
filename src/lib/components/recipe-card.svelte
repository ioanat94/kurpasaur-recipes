<script lang="ts">
	type RecipeCardProps = {
		recipe: {
			id: number;
			name: string;
			imageUrl?: string;
		};
	};

	const { recipe }: RecipeCardProps = $props();
</script>

<div class="border border-border w-[250px] rounded-lg flex flex-col items-center hover:opacity-80">
	{#if recipe.imageUrl}
		<img src={recipe.imageUrl} alt={recipe.name} class="w-[250px] rounded-t-lg" />
	{:else}
		<img src="./placeholder_food.png" alt={recipe.name} class="w-[250px] rounded-t-lg" />
	{/if}

	<div class="h-full min-h-[40px] flex items-center justify-center">
		<h2 class="text-lg w-[230px] text-ellipsis overflow-hidden text-nowrap">
			{recipe.name}
		</h2>
	</div>
</div>
