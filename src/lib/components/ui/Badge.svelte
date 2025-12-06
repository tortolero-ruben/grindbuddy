<script lang="ts">
	interface Props {
		variant?: 'default' | 'status' | 'difficulty' | 'pattern';
		class?: string;
		children: any;
	}

	let { variant = 'default', class: className = '', children }: Props = $props();
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {variant === 'pattern' ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : ''} {className}"
>
	{@render children()}
</span>

