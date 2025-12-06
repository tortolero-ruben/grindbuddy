<script lang="ts">
	import Badge from './Badge.svelte';
	import { getStatusColor, getStatusIcon } from '$lib/utils/statusUtils';
	import type { Status } from '$lib/types';
	import * as icons from 'lucide-svelte';

	interface Props {
		status: Status;
		showIcon?: boolean;
	}

	let { status, showIcon = false }: Props = $props();

	const colorClass = $derived(getStatusColor(status));
	const IconComponent = $derived(icons[getStatusIcon(status) as keyof typeof icons] as typeof icons.Zap);
</script>

<Badge variant="status" class={colorClass}>
	{#if showIcon && IconComponent}
		<IconComponent class="mr-1 h-3 w-3" />
	{/if}
	{status}
</Badge>

