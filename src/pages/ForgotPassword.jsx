import { useState } from "react"
import { useNavigate } from "react-router"
import api from "@/api/axios"
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/forgot-password", { email });

      if (response.data.success) {
        toast.success(response.data.message || "Password reset email sent!");
        // We could redirect them or just tell them to check their email
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send reset email. Please try again.";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Card className="bg-transparent border border-white/20 text-white shadow-none">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your email to receive a password reset link
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Field className="mt-4">
                  <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Field>
                <div className="text-center text-sm text-slate-400 mt-4">
                  Remember your password? <a href="/login" className="text-slate-300 hover:underline hover:text-orange-300">Back to Login</a>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;