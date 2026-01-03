<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/Button.svelte';
	import { LayoutDashboard, BarChart2, BookOpen, Plus, User } from '@lucide/svelte';
	import { openSearchModal } from '$lib/stores/logsStore';
	import { signOut } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import ModeToggle from '$lib/components/ModeToggle.svelte';

	type UserType = App.Locals['user'];

	let { user }: { user: UserType | null } = $props();

	const navItems = [
		{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ path: '/analytics', label: 'Analytics', icon: BarChart2 },
		{ path: '/logbook', label: 'Logbook', icon: BookOpen }
	];

	async function handleLogout() {
		await signOut();
		await goto('/login');
	}
</script>

<nav
	class="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
>
	<div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
		<div class="flex h-16 items-center justify-between gap-2">
			<!-- Logo and nav links -->
			<div class="flex items-center gap-4 sm:gap-8 min-w-0 flex-shrink">
				<a
					href={user ? '/dashboard' : '/'}
					class="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 whitespace-nowrap"
				>
					GrindBuddy
				</a>
				<div class="hidden md:flex items-center gap-4 lg:gap-6">
					{#each navItems as item (item.path)}
						<a
							href={item.path}
							class="flex items-center gap-2 px-2 lg:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap {page
								.url.pathname === item.path
								? 'text-indigo-600 dark:text-indigo-400'
								: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'}"
						>
							<item.icon class="h-5 w-5" />
							{item.label}
						</a>
					{/each}
				</div>
			</div>

			<!-- Right side: User avatar and Log Problem button -->
			{#if user}
				<div class="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
					<ModeToggle />
					<div class="hidden md:block">
						<Button onclick={openSearchModal} variant="primary" size="sm">
							<Plus class="mr-1.5 sm:mr-2 h-4 w-4" />
							<span class="hidden lg:inline">Log Problem</span>
						</Button>
					</div>
					<div
						class="flex items-center gap-1.5 sm:gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 sm:px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200"
					>
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-50 flex-shrink-0"
						>
							{#if user?.name}{user.name.slice(0, 1)}{:else}<User class="h-4 w-4" />{/if}
						</div>
						<span class="hidden xl:inline">{user.name}</span>
						<Button onclick={handleLogout} variant="ghost" size="sm" class="px-2 sm:px-3">Logout</Button>
					</div>
				</div>
			{:else}
				<div class="flex items-center gap-3">
					<ModeToggle />
					<a
						href="/login"
						class="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-300"
					>
						Log in
					</a>
					<a
						href="/register"
						class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300"
					>
						Register
					</a>
				</div>
			{/if}
		</div>
	</div>
</nav>
