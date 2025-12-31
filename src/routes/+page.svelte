<script lang="ts">
	import { ArrowRight, Brain, Zap, TrendingUp } from '@lucide/svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
</script>

<div class="relative overflow-hidden">
	<!-- Top Gradient Blob -->
	<div
		class="pointer-events-none absolute -top-[20%] left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] md:h-[1000px] md:w-[1000px] md:opacity-20"
	></div>

	<!-- Navbar -->
	<nav
		class="container mx-auto flex items-center justify-between px-6 py-6"
	>
		<a href="/" class="font-display text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
			Grind<span class="text-primary">Buddy</span>
		</a>
		<div class="flex items-center gap-4">
			<a
				href="/login"
				class="text-sm font-medium hover:text-primary transition-colors"
				>Log In</a
			>
			<a
				href="/register"
				class="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_-5px_hsl(var(--primary))]"
			>
				Get Started
			</a>
		</div>
	</nav>

	<!-- Hero Section -->
	<header class="container mx-auto px-6 py-20 text-center lg:py-32">
		<div class="animate-fade-in-up mx-auto max-w-4xl space-y-8">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
			>
				<span class="relative flex h-2 w-2">
					<span
						class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
					></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
				</span>
				The smarter way to grind
			</div>

			<h1 class="font-display text-5xl font-extrabold tracking-tight sm:text-7xl md:leading-[1.1]">
				Stop Forgetting <br />
				<span class="text-gradient-primary">
					LeetCode Solutions
				</span>
			</h1>

			<p class="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
				Don't just solve it once. Master it forever. Grind Buddy uses
				<span class="text-foreground font-semibold">Spaced Repetition</span> to ensure
				you remember active patterns when it matters most—in the interview.
			</p>

			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/register"
					class="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))]"
				>
					Start Grinding Free
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href="#how-it-works"
					class="rounded-full border border-border bg-background/50 backdrop-blur-sm px-8 py-4 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					How it Works
				</a>
			</div>
		</div>
	</header>

	<!-- Features Grid -->
	<section class="container mx-auto px-6 py-20">
		<div class="grid gap-8 md:grid-cols-3">
			<Card class="group/card">
				<div
					class="mb-6 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover/card:bg-primary group-hover/card:text-primary-foreground"
				>
					<Brain class="h-6 w-6" />
				</div>
				<h3 class="font-display mb-2 text-xl font-bold">Scientific Recall</h3>
				<p class="text-muted-foreground">
					Based on the Ebbinghaus Forgetting Curve. We schedule reviews exactly when you're about to
					forget.
				</p>
			</Card>
			<Card class="group/card">
				<div
					class="mb-6 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover/card:bg-primary group-hover/card:text-primary-foreground"
				>
					<TrendingUp class="h-6 w-6" />
				</div>
				<h3 class="font-display mb-2 text-xl font-bold">Track Mastery</h3>
				<p class="text-muted-foreground">
					Watch your knowledge grow from "Struggling" to "Mastered" with visual progress tracking.
				</p>
			</Card>
			<Card class="group/card">
				<div
					class="mb-6 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover/card:bg-primary group-hover/card:text-primary-foreground"
				>
					<Zap class="h-6 w-6" />
				</div>
				<h3 class="font-display mb-2 text-xl font-bold">Curated Lists</h3>
				<p class="text-muted-foreground">
					Built-in support for Blind 75, NeetCode 150, and Grind 75 patterns. Structure your study.
				</p>
			</Card>
		</div>
	</section>

	<!-- Interview Intelligence Section -->
	<section class="container mx-auto px-6 py-24 lg:py-32">
		<div class="grid items-center gap-16 lg:grid-cols-2">
			<div class="space-y-8">
				<div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
					<TrendingUp class="h-4 w-4" />
					Target Specific Companies
				</div>
				<h2 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
					Interview <span class="text-gradient-primary">Intelligence</span>
				</h2>
				<p class="text-lg text-muted-foreground">
					Our data-driven insights compare your current coding patterns against the actual problem distributions of top tech companies. Know exactly where your gaps are before you walk into the room.
				</p>
				<ul class="space-y-4">
					{#each [
						{ icon: Brain, text: "Compare against 400+ tech companies" },
						{ icon: Zap, text: "Real-time skill gap analysis" },
						{ icon: TrendingUp, text: "Data-backed pattern frequency" }
					] as feature}
						<li class="flex items-center gap-3">
							<div class="rounded-full bg-primary/10 p-1 text-primary">
								<feature.icon class="h-5 w-5" />
							</div>
							<span class="font-medium">{feature.text}</span>
						</li>
					{/each}
				</ul>
				<div class="pt-4">
					<a
						href="/register"
						class="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-105"
					>
						Analyze My Skills
						<ArrowRight class="h-5 w-5" />
					</a>
				</div>
			</div>

			<div class="relative group">
				<!-- Mock Radar Chart Design -->
				<div class="relative aspect-square max-w-[500px] mx-auto rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-xl transition-all hover:border-primary/30">
					<div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
					
					<div class="flex h-full w-full items-center justify-center">
						<div class="relative h-full w-full">
							<RadarChart 
								labels={['Arrays', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search', 'Linked List', 'Trees', 'Backtracking', 'Graphs', 'DP']}
								primaryData={{
									label: 'You',
									data: [65, 45, 75, 60, 55, 40, 70, 30, 80, 50],
									color: 'hsl(217, 91%, 60%)'
								}}
								comparisonData={{
									label: 'Google',
									data: [85, 70, 60, 80, 75, 65, 90, 50, 60, 85],
									color: '#4285F4'
								}}
							/>
						</div>
					</div>

					<!-- Floating Badges -->
					<div class="absolute -left-4 top-1/4 animate-bounce-slow">
						<div class="rounded-xl border border-white/10 bg-black/60 px-4 py-2 text-xs font-bold shadow-2xl backdrop-blur-md">
							<span class="text-blue-400">Google</span> Match: 78%
						</div>
					</div>
					<div class="absolute -right-4 bottom-1/4 animate-float">
						<div class="rounded-xl border border-white/10 bg-black/60 px-4 py-2 text-xs font-bold shadow-2xl backdrop-blur-md">
							<span class="text-primary">Amazon</span> Target
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section
		id="how-it-works"
		class="relative py-32 bg-background/50"
	>
		<!-- Background Glow -->
		<div class="absolute right-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[100px] opacity-20"></div>

		<div class="container mx-auto px-6">
			<div class="mb-20 text-center">
				<h2 class="font-display mb-4 text-3xl font-bold md:text-5xl">
					The Forgetting Curve is Real
				</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Most people forget 70% of what they learn within 24 hours. Spaced Repetition fixes that.
				</p>
			</div>

			<div class="relative mx-auto max-w-5xl">
				<!-- Steps Timeline -->
				<div class="grid gap-8 md:grid-cols-4 relative">
					<!-- Connecting Line -->
					<div class="hidden md:block absolute top-[2.5rem] left-0 w-full h-0.5 bg-border -z-10"></div>
					
					{#each [
						{ step: '1', title: 'Day 1', desc: "Solve the problem. It's fresh.", color: 'bg-primary' },
						{ step: '3', title: 'Day 3', desc: "First review. Strengthen pathway.", color: 'bg-primary/80' },
						{ step: '7', title: 'Day 7', desc: "Second review. Long-term memory.", color: 'bg-primary/60' },
						{ step: '∞', title: 'Interview', desc: "Instant recall without stress.", color: 'bg-white text-black' }
					] as item}
						<div class="relative flex flex-col items-center text-center group">
							<div
								class={`mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-background ${item.color === 'bg-white text-black' ? 'bg-foreground text-background' : 'bg-background text-foreground'} shadow-xl transition-transform duration-500 group-hover:scale-110`}
							>
								<div class={`flex h-full w-full items-center justify-center rounded-full ${item.color === 'bg-white text-black' ? 'bg-foreground' : 'bg-primary/10'}`}>
									<span class={`text-2xl font-bold ${item.color === 'bg-white text-black' ? 'text-background' : 'text-primary'}`}>{item.step}</span>
								</div>
							</div>
							<h4 class="font-display mb-2 text-xl font-bold">{item.title}</h4>
							<p class="text-sm text-muted-foreground px-4">
								{item.desc}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<footer class="border-t border-white/5 py-12 text-center text-muted-foreground">
		<p>&copy; {new Date().getFullYear()} Grind Buddy. Open Source & Built for Hackers.</p>
	</footer>
</div>
