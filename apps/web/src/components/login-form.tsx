import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@nexus/ui/components/field";
import { Input } from "@nexus/ui/components/input";
import { cn } from "@nexus/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, Landmark, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { authClient, demoLogin } from "@/lib/auth-client";

const DEMO_ACCOUNTS = [
	{
		role: "institution" as const,
		label: "Vantage Capital",
		sublabel: "Institution",
		icon: Building2,
		color: "text-blue-500",
		bg: "bg-blue-500/10",
	},
	{
		role: "counterparty" as const,
		label: "Prime Bank",
		sublabel: "Counterparty",
		icon: Landmark,
		color: "text-amber-500",
	},
	{
		role: "operator" as const,
		label: "SignUIT",
		sublabel: "Operator",
		icon: Settings,
		color: "text-emerald-500",
		bg: "bg-emerald-500/10",
	},
] as const;

export function LoginForm() {
	const navigate = useNavigate();
	const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{ email: value.email, password: value.password },
				{
					onSuccess: () => {
						toast.success("Login successful");
						navigate({ to: "/dashboard" });
					},
					onError: (error) => {
						toast.error(error.error.message || "Login failed");
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.string().min(1, "Email is required").email("Enter a valid email"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	const handleDemoLogin = async (role: "institution" | "counterparty" | "operator") => {
		setIsDemoLoading(role);
		try {
			await demoLogin(role);
			toast.success("Welcome!");
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Demo login failed");
		} finally {
			setIsDemoLoading(null);
		}
	};

	return (
		<div className="w-full max-w-[420px] flex flex-col items-center px-4">
			{/* Logo */}
			<div className="mb-6">
				<img src="/assets/logo_white.png" alt="SignUIT" className="h-9 w-auto hidden dark:block" />
				<img src="/assets/logo_black.png" alt="SignUIT" className="h-9 w-auto dark:hidden" />
			</div>

			{/* Title */}
			<h1 className="text-2xl font-bold tracking-tight text-center mb-2">Welcome back</h1>
			<p className="text-muted-foreground text-sm text-center mb-7">
				Don't have an account?{" "}
				<Link
					to="/signup"
					className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
				>
					Sign up
				</Link>
			</p>

			{/* Form */}
			<form
				className="w-full"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup className="gap-4">
					<form.Field name="email">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name} className="text-sm font-medium">
									Email
								</FieldLabel>
								<Input
									id={field.name}
									type="email"
									placeholder="m@example.com"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={() => field.handleBlur()}
									className="h-12 rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary/50 text-sm px-4"
								/>
								<FieldError
									errors={field.state.meta.errors
										.filter(Boolean)
										.map((e) => ({ message: String(e) }))}
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="password">
						{(field) => (
							<Field>
								<FieldLabel
									htmlFor={field.name}
									className="text-sm font-medium flex justify-between items-center"
								>
									<span>Password</span>
									<button
										type="button"
										className="text-xs text-primary hover:underline font-normal"
									>
										Forgot?
									</button>
								</FieldLabel>
								<Input
									id={field.name}
									type="password"
									placeholder="••••••••"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={() => field.handleBlur()}
									className="h-12 rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary/50 text-sm px-4"
								/>
								<FieldError
									errors={field.state.meta.errors
										.filter(Boolean)
										.map((e) => ({ message: String(e) }))}
								/>
							</Field>
						)}
					</form.Field>

					<form.Subscribe
						selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
					>
						{({ canSubmit, isSubmitting }) => (
							<button
								type="submit"
								disabled={!canSubmit}
								className="w-full h-12 mt-1 bg-foreground text-background rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99] transition-all"
							>
								{isSubmitting ? "Signing in..." : "Sign in"}
							</button>
						)}
					</form.Subscribe>
				</FieldGroup>
			</form>

			{/* Separator */}
			<FieldSeparator className="my-6 w-full">Or</FieldSeparator>

			{/* Demo accounts */}
			<div className="w-full">
				<p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] text-center mb-4">
					Demo Access
				</p>
				<div className="grid grid-cols-2 gap-2">
					{DEMO_ACCOUNTS.map(({ role, label, sublabel, icon: Icon, color }) => (
						<button
							key={role}
							type="button"
							onClick={() => handleDemoLogin(role)}
							disabled={isDemoLoading !== null}
							className={cn(
								"group flex items-center gap-2.5 p-2 rounded-xl border border-border/40 bg-muted/5 transition-all text-left",
								"hover:bg-muted/20 hover:border-border/60 active:scale-[0.98] disabled:opacity-50",
								role === "operator" ? "col-span-2" : "col-span-1",
							)}
						>
							<div className="p-2 rounded-lg bg-muted/20 shrink-0 group-hover:bg-background transition-colors">
								<Icon className={cn("w-3.5 h-3.5", color, "opacity-70 group-hover:opacity-100")} />
							</div>
							<div className="flex flex-col min-w-0">
								<div className="text-[11px] font-bold tracking-tight truncate uppercase">
									{isDemoLoading === role ? "..." : label}
								</div>
								<div className="text-[9px] text-muted-foreground/60 font-medium uppercase tracking-tight">
									{sublabel}
								</div>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Footer */}
			<p className="text-muted-foreground text-xs mt-8 text-center leading-relaxed">
				By continuing, you agree to our{" "}
				<button
					type="button"
					className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
				>
					Terms
				</button>{" "}
				and{" "}
				<button
					type="button"
					className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
				>
					Privacy Policy
				</button>
				.
			</p>
		</div>
	);
}
