<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { LayoutDashboard, BarChart2, BookOpen, Plus, User } from 'lucide-svelte';
	import { openSearchModal } from '$lib/stores/logsStore';

	type UserType = App.Locals['user'];

	let { user }: { user: UserType | null } = $props();

	const navItems = [
		{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ path: '/analytics', label: 'Analytics', icon: BarChart2 },
		{ path: '/logbook', label: 'Logbook', icon: BookOpen }
	];
</script>

<nav class="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo and nav links -->
			<div class="flex items-center gap-8">
				<a href="/dashboard" class="text-xl font-bold text-slate-900 dark:text-slate-50">
					GrindBuddy
				</a>
				<div class="hidden md:flex items-center gap-6">
					{#each navItems as item (item.path)}
						<a
							href={item.path}
							class="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === item.path
								? 'text-indigo-600 dark:text-indigo-400'
								: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'}"
						>
							{@render item.icon({ class: 'h-5 w-5' })}
							{item.label}
						</a>
					{/each}
				</div>
			</div>

			<!-- Right side: User avatar and Log Problem button -->
			{#if user}
				<div class="flex items-center gap-4">
					<Button onclick={openSearchModal} variant="primary" size="sm">
						<Plus class="mr-2 h-4 w-4" />
						Log Problem
					</Button>
					<div class="flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-50">
							{#if user?.name}{user.name.slice(0, 1)}{:else}<User class="h-4 w-4" />{/if}
						</div>
						<span class="hidden md:inline">{user.name}</span>
						<form method="POST" action="/logout">
							<Button type="submit" variant="ghost" size="sm">Logout</Button>
						</form>
					</div>
				</div>
			{:else}
				<div class="flex items-center gap-3">
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

