<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';

	import type { HTMLAttributes } from 'svelte/elements';

	let { placeholder, class: className, ...restProps }: HTMLAttributes<HTMLSpanElement> & { placeholder?: string } = $props();
</script>

<span class={className} {...restProps}>
	<!-- TODO: Re-implement selected value display for bits-ui v2 -->
	{placeholder}
</span>
