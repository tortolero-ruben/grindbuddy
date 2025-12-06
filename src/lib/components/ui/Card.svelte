<script lang="ts">
	interface Props {
		class?: string;
		children: any;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div
	class="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm {className}"
>
	{@render children()}
</div>

