'use client'

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "../../services/LoginUser"; // Importáld a logikát
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await loginUser({ email, password });
      router.push('/')

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-80 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {isLoading ? "Folyamatban..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don&apost have an account?{" "}
          <Link href="/register" className="text-black font-medium hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
}