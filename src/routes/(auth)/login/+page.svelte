<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	let { form } = $props();
</script>

<div class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm md:max-w-3xl">
		<Card class="border border-border">
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl">Welcome back</CardTitle>
				<CardDescription>Sign in to continue.</CardDescription>
			</CardHeader>

			{#if form?.message}
				<p class="mx-6 mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
					{form.message}
				</p>
			{/if}

			<CardContent class="space-y-4">
				<form method="POST" class="space-y-4">
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={form?.email ?? ''}
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input id="password" name="password" type="password" placeholder="••••••••" required />
					</div>

					<Button type="submit" class="w-full">Sign in</Button>
				</form>

				<p class="text-center text-sm text-muted-foreground">
					Don't have an account?
					<a href="/register" class="font-medium text-primary hover:underline">
						Create one
					</a>
				</p>
			</CardContent>
		</Card>
	</div>
</div>

