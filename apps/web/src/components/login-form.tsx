import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@nexus/ui/components/field";
import { Input } from "@nexus/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

export function LoginForm() {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
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

	return (
		<div className="w-full max-w-[480px] px-6 flex flex-col items-center">
			{/* SignUIT Logo */}
			<div className="mb-8">
				<img src="/assets/logo_white.png" alt="SignUIT Logo" className="h-10 w-auto hidden dark:block" />
				<img src="/assets/logo_black.png" alt="SignUIT Logo" className="h-10 w-auto block dark:hidden" />
			</div>

			{/* Title */}
			<h1 className="text-foreground text-[28px] font-bold tracking-tight text-center mb-2">
				Welcome back
			</h1>

			{/* Subtitle */}
			<p className="text-muted-foreground text-[15px] text-center mb-8">
				Don't have an account?{" "}
				<Link
					to="/signup"
					className="text-primary hover:underline underline-offset-[3px] text-[15px] transition-colors cursor-pointer font-medium"
				>
					Create account
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
				<FieldGroup className="gap-5">
					{/* Email */}
					<form.Field name="email">
						{(field) => (
							<Field>
								<FieldLabel
									htmlFor={field.name}
									className="text-foreground text-sm font-medium"
								>
									Email
								</FieldLabel>
								<Input
									id={field.name}
									type="email"
									placeholder="m@example.com"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={() => field.handleBlur()}
									className="h-12 rounded-xl bg-muted/50 border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-primary/10 text-[15px] px-4"
								/>
								<FieldError
									errors={field.state.meta.errors
										.filter(Boolean)
										.map((e) => ({ message: String(e) }))}
								/>
							</Field>
						)}
					</form.Field>

					{/* Password */}
					<form.Field name="password">
						{(field) => (
							<Field>
								<FieldLabel
									htmlFor={field.name}
									className="text-foreground text-sm font-medium flex justify-between"
								>
									<span>Password</span>
									<button type="button" className="text-xs text-primary hover:underline font-normal">
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
									className="h-12 rounded-xl bg-muted/50 border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-primary/10 text-[15px] px-4"
								/>
								<FieldError
									errors={field.state.meta.errors
										.filter(Boolean)
										.map((e) => ({ message: String(e) }))}
								/>
							</Field>
						)}
					</form.Field>

					{/* Submit */}
					<form.Subscribe
						selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
					>
						{({ canSubmit, isSubmitting }) => (
							<button
								type="submit"
								disabled={!canSubmit}
								className="w-full py-3.5 mt-2 bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-primary/20"
							>
								{isSubmitting ? "Signing in..." : "Sign in"}
							</button>
						)}
					</form.Subscribe>
				</FieldGroup>
			</form>

			{/* Footer */}
			<p className="text-muted-foreground text-xs mt-10 text-center leading-relaxed max-w-[320px]">
				By continuing, you agree to our{" "}
				<button type="button" className="text-foreground hover:underline underline-offset-2">Terms</button>
				{" "}and{" "}
				<button type="button" className="text-foreground hover:underline underline-offset-2">Privacy Policy</button>.
			</p>
		</div>
	);
}
