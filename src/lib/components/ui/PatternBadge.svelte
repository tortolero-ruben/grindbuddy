<script lang="ts">
	import Badge from './Badge.svelte';
	import type { Pattern } from '$lib/types';

	interface Props {
		pattern: Pattern;
	}

	let { pattern }: Props = $props();
</script>

<Badge variant="pattern">
	{pattern}
</Badge>

