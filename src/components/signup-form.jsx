import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  ...props
}) {
  return (
    <Card className="bg-transparent border border-white/20 text-white shadow-none" {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name" className="text-slate-300">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email" className="text-slate-300">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
              />
              <FieldDescription className="text-slate-500">
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-slate-300">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-orange-500"
              />
              <FieldDescription className="text-slate-500">
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password" className="text-slate-300">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-orange-500"
              />
              <FieldDescription className="text-slate-500">Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full">Create Account</Button>
                <Button variant="outline" type="button" className="w-full bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center text-slate-400 mt-4">
                  Already have an account? <a href="/login" className="text-slate-300 hover:underline hover:text-orange-300!">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
