<script lang="ts">
	interface Props {
		placeholder?: string;
		value?: string;
		class?: string;
		id?: string;
		name?: string;
		rows?: number;
		oninput?: (e: Event) => void;
	}

	let {
		placeholder = '',
		value = $bindable(),
		class: className = '',
		id,
		name,
		rows = 4,
		oninput
	}: Props = $props();
</script>

<textarea
	{id}
	{name}
	{placeholder}
	bind:value
	{rows}
	class="flex min-h-[100px] w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{oninput}
></textarea>
