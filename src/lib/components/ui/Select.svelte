<script lang="ts">
	interface Props {
		options: { value: string; label: string }[];
		value?: string;
		class?: string;
		id?: string;
		name?: string;
		onchange?: (e: Event) => void;
	}

	let { options, value = $bindable(), class: className = '', id, name, onchange }: Props = $props();
</script>

<select
	{id}
	{name}
	bind:value
	class="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{onchange}
>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
