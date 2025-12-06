<script lang="ts">
	interface Props {
		for?: string;
		class?: string;
		children: any;
	}

	let { for: htmlFor, class: className = '', children }: Props = $props();
</script>

<label
	for={htmlFor}
	class="text-sm font-medium text-slate-700 dark:text-slate-200 {className}"
>
	{@render children()}
</label>

