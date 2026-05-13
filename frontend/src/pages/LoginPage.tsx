import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { labels } from "../constants/labels";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

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
      await login(email, password);

      navigate("/dashboard");
    } catch {
      setError(labels.loginError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8"
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-xl font-bold text-white shadow-sm">
            R
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {labels.appName}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {labels.appDescription}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {labels.loginTitle}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {labels.loginSubtitle}
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                {labels.email}
              </label>

              <input
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder={labels.emailPlaceholder}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                {labels.password}
              </label>

              <input
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder={labels.passwordPlaceholder}
                autoComplete="current-password"
              />
            </div>

            <Button disabled={isSubmitting} className="w-full">
              {isSubmitting ? labels.loginSubmitting : labels.loginSubmit}
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-gray-400">
          {labels.appDescription}
        </p>
      </div>
    </div>
  );
}