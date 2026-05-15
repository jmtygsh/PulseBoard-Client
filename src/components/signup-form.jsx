import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
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
import { toast } from "sonner"

export function SignupForm({
  ...props
}) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast.success("Account created successfully! Please check your email to verify.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border border-white/20 text-white shadow-none" {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4 text-sm font-medium">{error}</div>}
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name" className="text-slate-300">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-orange-500"
              />
              <FieldDescription className="text-slate-500">
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword" className="text-slate-300">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-orange-500"
              />
              <FieldDescription className="text-slate-500">Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button disabled={loading} type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
                <Button disabled={loading} variant="outline" type="button" className="w-full bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300">
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
