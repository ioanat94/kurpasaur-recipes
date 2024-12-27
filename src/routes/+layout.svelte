<script lang="ts">
	import NavButton from '$lib/components/nav-button.svelte';
	import '../app.css';

	let { children } = $props();

	const navButtons = [
		{ label: 'Home', imageSrc: '/home.png', imageAlt: 'Home icon', href: '/' },
		{ label: 'Add', imageSrc: '/add.png', imageAlt: 'Add icon', href: '/add' },
		{ label: 'Search', imageSrc: '/search.png', imageAlt: 'Search icon', href: '/search' }
	];
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="./favicon.png" />
</svelte:head>

<div
	class="dark bg-background text-secondary-foreground grid grid-cols-[60px_1fr] gap-x-6 min-h-screen font-nunito"
>
	<div class="flex flex-col items-center gap-4 pt-3 border-r border-primary-foreground">
		{#each navButtons as { label, imageSrc, imageAlt, href }}
			<NavButton {label} {imageSrc} {imageAlt} {href} />
		{/each}
	</div>

	<div>
		{@render children()}
	</div>
</div>
