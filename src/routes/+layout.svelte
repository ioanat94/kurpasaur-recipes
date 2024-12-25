<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import '../app.css';

	let { children } = $props();
</script>

<div class="grid grid-cols-[200px_1fr] bg-primary text-primary-foreground min-h-screen">
	<Button class="w-max m-2" aria-label="Home"
		><a href="/"><img src="/home.png" width="24px" alt="Home icon" /></a></Button
	>

	<div>
		{@render children()}
	</div>
</div>
