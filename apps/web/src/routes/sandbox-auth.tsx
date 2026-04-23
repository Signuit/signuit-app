import { Button } from "@nexus/ui/components/button";
import { Input } from "@nexus/ui/components/input";
import { Label } from "@nexus/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { nexus } from "@/lib/nexus-client";

export const Route = createFileRoute("/sandbox-auth")({
	component: RouteComponent,
});

function RouteComponent() {
	const session = nexus.auth.useSession();
	const login = nexus.auth.useLogin();
	const logout = nexus.auth.useLogout();

	const form = useForm({
		defaultValues: {
			userId: "alice",
		},
		onSubmit: async ({ value }) => {
			login.mutate(
				{ userId: value.userId },
				{
					onSuccess: (data) => {
						toast.success(`Logged in as ${data.userId}`);
					},
					onError: (error) => {
						toast.error(error.message || "Login failed");
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				userId: z.string().min(1, "userId is required"),
			}),
		},
	});

	async function handleTestConnection() {
		try {
			await session.refetch();
			if (session.data?.authenticated) {
				toast.success(`Connection OK: ${session.data.userId} (${session.data.partyId})`);
			} else {
				toast.warning("Not authenticated");
			}
		} catch (error) {
			toast.error("Connection test failed");
		}
	}

	const sessionData = session.data;

	return (
		<div className="mx-auto w-full mt-10 max-w-md p-6">
			<h1 className="mb-6 text-center text-3xl font-bold">Canton Sandbox Auth</h1>

			{sessionData?.authenticated ? (
				<div className="space-y-4">
					<div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
						<h2 className="mb-2 text-lg font-semibold text-green-700 dark:text-green-400">
							Session Active
						</h2>
						<dl className="space-y-1 text-sm">
							<div className="flex justify-between">
								<dt className="text-gray-500">User ID:</dt>
								<dd className="font-mono font-medium">{sessionData.userId}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-gray-500">Party ID:</dt>
								<dd className="font-mono font-medium">{sessionData.partyId}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-gray-500">Expires:</dt>
								<dd className="font-mono">
									{sessionData.expiresAt ? new Date(sessionData.expiresAt).toLocaleString() : "N/A"}
								</dd>
							</div>
						</dl>
					</div>

					<div className="flex gap-2">
						<Button onClick={handleTestConnection} disabled={session.isFetching} className="flex-1">
							{session.isFetching ? "Testing..." : "Test Connection"}
						</Button>
						<Button
							onClick={() =>
								logout.mutate(undefined, {
									onSuccess: () => toast.success("Logged out"),
									onError: () => toast.error("Logout failed"),
								})
							}
							variant="destructive"
							disabled={logout.isPending}
						>
							{logout.isPending ? "Logging out..." : "Logout"}
						</Button>
					</div>
				</div>
			) : (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<div>
						<form.Field name="userId">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>User ID</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p key={String(error)} className="text-red-500 text-xs mt-1">
											{String(error)}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<form.Subscribe
						selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
					>
						{({ canSubmit }) => (
							<Button type="submit" className="w-full" disabled={!canSubmit || login.isPending}>
								{login.isPending ? "Connecting..." : "Connect to Sandbox"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			)}

			<div className="mt-6 text-center text-sm text-gray-500">
				<p>This authenticates with the Canton Ledger sandbox.</p>
				<p>Session cookie: nexus_session</p>
			</div>
		</div>
	);
}
