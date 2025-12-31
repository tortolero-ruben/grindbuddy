<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: ((e: MouseEvent) => void) | (() => void);
		children: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		disabled = false,
		type = 'button',
		onclick,
		children
	}: Props = $props();

	const variantClasses = {
		primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
		secondary: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50',
		ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-50'
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	function handleClick(e: MouseEvent) {
		if (disabled || !onclick) return;
		// Call onclick - it may or may not use the event parameter
		onclick(e);
	}
</script>

<button
	class="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none {variantClasses[variant]} {sizeClasses[size]} {className}"
	{disabled}
	onclick={handleClick}
	{type}
>
	{@render children()}
</button>

