<script lang="ts">
	import Badge from './Badge.svelte';
	import { getDifficultyColor } from '$lib/utils/statusUtils';
	import type { Difficulty } from '$lib/types';

	interface Props {
		difficulty: Difficulty;
	}

	let { difficulty }: Props = $props();

	const colorClass = $derived(getDifficultyColor(difficulty));
</script>

<Badge variant="difficulty" class={colorClass}>
	{difficulty}
</Badge>

