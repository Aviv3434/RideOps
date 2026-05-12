import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@rideops.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);

      if (user.role === "COMPANY_ADMIN") {
        navigate("/company");
      } else {
        navigate("/client");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold">RideOps</h1>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        {error && (
          <div className="rounded bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
          />
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}