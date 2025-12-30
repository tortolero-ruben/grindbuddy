<script lang="ts">
	import Badge from './Badge.svelte';
	import { getStatusColor, getStatusIcon } from '$lib/utils/statusUtils';
	import type { Status } from '$lib/types';
	import { Zap, CheckCircle, HelpCircle, Eye, AlertTriangle, Circle } from '@lucide/svelte';

	interface Props {
		status: Status;
		showIcon?: boolean;
	}

	let { status, showIcon = false }: Props = $props();

	const colorClass = $derived(getStatusColor(status));

	const iconMap = {
		Optimal: Zap,
		Suboptimal: CheckCircle,
		Hints: HelpCircle,
		Solution: Eye,
		Failed: AlertTriangle,
		Circle
	};

	const IconComponent = $derived(iconMap[status] || Circle);
</script>

<Badge variant="status" class={colorClass}>
	{#if showIcon && IconComponent}
		<IconComponent class="mr-1 h-3 w-3" />
	{/if}
	{status}
</Badge>

