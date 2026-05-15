import { useState } from "react"
import { useNavigate, useParams } from "react-router"
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

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.put(`/api/auth/reset-password/${token}`, { password });

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to reset password. Please try again.";
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
            <CardTitle>Reset Password</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password" className="text-slate-300">New Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white focus-visible:ring-orange-500"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-slate-300">Confirm Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white focus-visible:ring-orange-500"
                  />
                </Field>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Field className="mt-4">
                  <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;