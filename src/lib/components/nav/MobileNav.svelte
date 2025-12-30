<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutDashboard, BarChart2, BookOpen, Plus, LogOut } from '@lucide/svelte';
	import { openSearchModal } from '$lib/stores/logsStore';
	import { signOut } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	type UserType = App.Locals['user'];
	let { user }: { user: UserType | null } = $props();

	const navItems = $derived([
		{ path: user ? '/dashboard' : '/', label: 'Home', icon: LayoutDashboard },
		{ path: '/analytics', label: 'Charts', icon: BarChart2 },
		{ path: '/logbook', label: 'List', icon: BookOpen }
	]);

	async function handleLogout() {
		await signOut();
		await goto('/login');
	}
</script>

<nav
	class="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 md:hidden"
>
	<div class="flex h-full items-center justify-around">
		{#each navItems as item (item.path)}
			<a
				href={item.path}
				class="flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs font-medium transition-colors {$page
					.url.pathname === item.path
					? 'text-indigo-600 dark:text-indigo-400'
					: 'text-slate-600 dark:text-slate-400'}"
			>
				<item.icon class="h-6 w-6" />
				{item.label}
			</a>
		{/each}
		{#if user}
			<button
				onclick={handleLogout}
				class="flex flex-col items-center justify-center px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300"
			>
				<LogOut class="h-6 w-6" />
				Logout
			</button>
		{/if}
	</div>
</nav>

<!-- Floating Action Button -->
<button
	onclick={openSearchModal}
	class="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 md:hidden"
	aria-label="Log Problem"
>
	<Plus class="h-6 w-6" />
</button>
