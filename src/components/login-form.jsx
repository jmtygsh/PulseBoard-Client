import { useState } from "react"
import { useNavigate } from "react-router"
import api from "@/api/axios"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
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

export function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password
      });

      if (response.data.success) {
        toast.success("Successfully logged in!");
        login(response.data.data.accessToken);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to login. Please try again.");
      setError(err.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-transparent border border-white/20 text-white shadow-none">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-slate-300">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-slate-300">Password</FieldLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 text-orange-500 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white focus-visible:ring-orange-500"
                />
              </Field>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Field>
                <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button" className="w-full bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
                <FieldDescription className="text-center text-slate-400 mt-4">
                  Don&apos;t have an account? <a href="/register" className="text-slate-300 hover:underline hover:text-orange-300!">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
