<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import '../app.css';

	let { children } = $props();
</script>

<div
	class="dark bg-background text-secondary-foreground grid grid-cols-[60px_1fr] gap-x-6 min-h-screen font-nunito"
>
	<div class="flex flex-col items-center gap-4 pt-3 border-r border-primary-foreground">
		<Button class="w-max m-0 p-y px-2" aria-label="Home" variant="ghost"
			><a href="/"><img src="/home.png" width="24px" alt="Home icon" /></a></Button
		>
		<Button class="w-max m-0 p-y px-2" aria-label="Add" variant="ghost"
			><a href="/add"><img src="/add.png" width="24px" alt="Add icon" /></a></Button
		>
	</div>

	<div>
		{@render children()}
	</div>
</div>
