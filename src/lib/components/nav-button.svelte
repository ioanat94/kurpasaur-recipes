<script lang="ts">
	import Button from './ui/button/button.svelte';

	const { label, imageSrc, imageAlt, href } = $props();
</script>

<Button class="w-max m-0 p-y px-2" aria-label={label} variant="ghost"
	><a {href}><img src={imageSrc} width="24px" alt={imageAlt} /></a></Button
>
