import { Field, FieldError, FieldGroup, FieldLabel } from "@nexus/ui/components/field";
import { Input } from "@nexus/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

export function SignupForm() {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{ email: value.email, password: value.password, name: value.name },
				{
					onSuccess: () => {
						toast.success("Account created");
						navigate({ to: "/dashboard" });
					},
					onError: (error) => {
						toast.error(error.error.message || "Registration failed");
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.string().min(1, "Email is required").email("Enter a valid email"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	return (
		<div className="w-full max-w-[480px] px-6 flex flex-col items-center">
			{/* SignUIT Logo */}
			<div className="mb-8">
				<img
					src="/assets/logo_white.png"
					alt="SignUIT Logo"
					className="h-10 w-auto hidden dark:block"
				/>
				<img
					src="/assets/logo_black.png"
					alt="SignUIT Logo"
					className="h-10 w-auto block dark:hidden"
				/>
			</div>

			{/* Title */}
			<h1 className="text-foreground text-[28px] font-bold tracking-tight text-center mb-2">
				Create an account
			</h1>

			{/* Subtitle */}
			<p className="text-muted-foreground text-[15px] text-center mb-8">
				Already have an account?{" "}
				<Link
					to="/login"
					className="text-primary hover:underline underline-offset-[3px] text-[15px] transition-colors cursor-pointer font-medium"
				>
					Sign in
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
					{/* Name */}
					<form.Field name="name">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name} className="text-foreground text-sm font-medium">
									Full Name
								</FieldLabel>
								<Input
									id={field.name}
									type="text"
									placeholder="John Doe"
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

					{/* Email */}
					<form.Field name="email">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name} className="text-foreground text-sm font-medium">
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
								<FieldLabel htmlFor={field.name} className="text-foreground text-sm font-medium">
									Password
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
								{isSubmitting ? "Creating account..." : "Create account"}
							</button>
						)}
					</form.Subscribe>
				</FieldGroup>
			</form>

			{/* Footer */}
			<p className="text-muted-foreground text-xs mt-10 text-center leading-relaxed max-w-[320px]">
				By continuing, you agree to our{" "}
				<button type="button" className="text-foreground hover:underline underline-offset-2">
					Terms
				</button>{" "}
				and{" "}
				<button type="button" className="text-foreground hover:underline underline-offset-2">
					Privacy Policy
				</button>
				.
			</p>
		</div>
	);
}
