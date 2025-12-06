<script lang="ts">
	import { ArrowRight, Brain, Zap, TrendingUp, CheckCircle } from 'lucide-svelte';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
</script>

<div
	class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 selection:bg-emerald-500/30"
>
	<!-- Navbar -->
	<nav
		class="container mx-auto flex items-center justify-between px-6 py-6 border-b border-slate-200 dark:border-transparent"
	>
		<div class="text-2xl font-bold tracking-tighter">
			Grind<span class="text-emerald-600 dark:text-emerald-400">Buddy</span>
		</div>
		<div class="flex items-center gap-4">
			<ModeToggle />
			<a
				href="/login"
				class="text-sm font-medium hover:text-emerald-600 dark:hover:text-white/80 transition-colors"
				>Log In</a
			>
			<a
				href="/register"
				class="rounded-full bg-slate-900 dark:bg-white px-5 py-2 text-sm font-semibold text-white dark:text-slate-950 transition-transform hover:scale-105 active:scale-95"
			>
				Get Started
			</a>
		</div>
	</nav>

	<!-- Hero Section -->
	<header class="container mx-auto px-6 py-20 text-center lg:py-32">
		<div class="animate-fade-in-up mx-auto max-w-3xl space-y-8">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-400"
			>
				<span class="relative flex h-2 w-2">
					<span
						class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
					></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
				</span>
				The smarter way to grind
			</div>

			<h1 class="text-5xl font-extrabold tracking-tight sm:text-7xl">
				Stop Forgetting <br />
				<span
					class="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
				>
					LeetCode Solutions
				</span>
			</h1>

			<p class="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
				Don't just solve it once. Master it forever. Grind Buddy uses
				<span class="text-slate-900 dark:text-white font-semibold">Spaced Repetition</span> to ensure
				you remember active patterns when it matters most—in the interview.
			</p>

			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/register"
					class="group flex items-center gap-2 rounded-full bg-emerald-600 dark:bg-emerald-500 px-8 py-4 text-lg font-bold text-white dark:text-slate-950 transition-all hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)]"
				>
					Start Grinding Free
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href="#how-it-works"
					class="rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-8 py-4 text-lg font-medium text-slate-700 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
				>
					How it Works
				</a>
			</div>
		</div>
	</header>

	<!-- Features Grid -->
	<section class="container mx-auto px-6 py-20">
		<div class="grid gap-8 md:grid-cols-3">
			<div
				class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm dark:shadow-none transition-colors hover:border-emerald-500/30"
			>
				<div
					class="mb-4 inline-flex items-center justify-center rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
				>
					<Brain class="h-6 w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold">Scientific Recall</h3>
				<p class="text-slate-600 dark:text-slate-400">
					Based on the Ebbinghaus Forgetting Curve. We schedule reviews exactly when you're about to
					forget.
				</p>
			</div>
			<div
				class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm dark:shadow-none transition-colors hover:border-cyan-500/30"
			>
				<div
					class="mb-4 inline-flex items-center justify-center rounded-lg bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-400"
				>
					<TrendingUp class="h-6 w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold">Track Mastery</h3>
				<p class="text-slate-600 dark:text-slate-400">
					Watch your knowledge grow from "Struggling" to "Mastered" with visual progress tracking.
				</p>
			</div>
			<div
				class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm dark:shadow-none transition-colors hover:border-purple-500/30"
			>
				<div
					class="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400"
				>
					<Zap class="h-6 w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold">Curated Lists</h3>
				<p class="text-slate-600 dark:text-slate-400">
					Built-in support for Blind 75, NeetCode 150, and Grind 75 patterns. Structure your study.
				</p>
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section
		id="how-it-works"
		class="border-t border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-950/50 py-24"
	>
		<div class="container mx-auto px-6">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold md:text-4xl text-slate-900 dark:text-white">
					The Forgetting Curve is Real
				</h2>
				<p class="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
					Most people forget 70% of what they learn within 24 hours. Spaced Repetition fixes that.
				</p>
			</div>

			<div class="relative mx-auto max-w-4xl">
				<!-- Mock visual of the curve or steps -->
				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					<div class="relative z-10 text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-xl font-bold text-slate-900 dark:text-white shadow-xl dark:shadow-lg border border-slate-200 dark:border-slate-700"
						>
							1
						</div>
						<h4 class="mb-2 font-bold text-emerald-600 dark:text-emerald-400">Day 1</h4>
						<p class="text-sm text-slate-600 dark:text-slate-400">
							Solve the problem. It's fresh in memory.
						</p>
					</div>
					<div class="relative z-10 text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-xl font-bold text-slate-900 dark:text-white shadow-xl dark:shadow-lg border border-slate-200 dark:border-slate-700"
						>
							3
						</div>
						<h4 class="mb-2 font-bold text-cyan-600 dark:text-cyan-400">Day 3</h4>
						<p class="text-sm text-slate-600 dark:text-slate-400">
							First review. Strengthen the neural pathway.
						</p>
					</div>
					<div class="relative z-10 text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-xl font-bold text-slate-900 dark:text-white shadow-xl dark:shadow-lg border border-slate-200 dark:border-slate-700"
						>
							7
						</div>
						<h4 class="mb-2 font-bold text-purple-600 dark:text-purple-400">Day 7</h4>
						<p class="text-sm text-slate-600 dark:text-slate-400">
							Second review. Move to long-term memory.
						</p>
					</div>
					<div class="relative z-10 text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-white dark:text-slate-900 shadow-lg shadow-emerald-500/20"
						>
							∞
						</div>
						<h4 class="mb-2 font-bold text-slate-900 dark:text-white">Interview</h4>
						<p class="text-sm text-slate-600 dark:text-slate-400">
							Recall the pattern instantly without stress.
						</p>
					</div>

					<!-- Connector Line (Visual only) -->
					<div
						class="absolute top-6 left-0 -z-0 hidden h-0.5 w-full bg-slate-300 dark:bg-slate-800 md:block"
					></div>
				</div>
			</div>
		</div>
	</section>

	<footer class="border-t border-slate-200 dark:border-slate-900 py-12 text-center text-slate-500">
		<p>&copy; {new Date().getFullYear()} Grind Buddy. Open Source & Built for Hackers.</p>
	</footer>
</div>

<style>
	/* Custom animations if not using tailwind-animate plugin */
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out forwards;
	}
</style>
