<script lang="ts">
  import { cn } from "$lib/utils";

  let { class: className, children, ...props } = $props();
</script>

<div
  class={cn(
    "relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/5",
    className
  )}
  {...props}
>
  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
  <div class="relative z-10">
    {@render children()}
  </div>
</div>
