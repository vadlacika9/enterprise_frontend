'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Az átirányításhoz
import { registerUser } from "../../services/RegisterUser";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordAgain, setPasswordAgain] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    console.log(formData)
  },[formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ha a password_again mezőt gépeljük, csak a saját state-jét frissítjük
    if (e.target.name === "password_again") {
      setPasswordAgain(e.target.value);
      return;
    }

    // Minden mást a formData-ba mentünk
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Csak itt hasonlítjuk össze, nem küldjük el
    if (formData.password !== passwordAgain) {
      setError("A két jelszó nem egyezik meg!");
      return;
    }

    setIsLoading(true);

    try {
      // Most már csak a tiszta formData megy ki: password_again nélkül
      await registerUser(formData);
      router.push("/login?message=successful_registration");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-center">Register</h1>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        <input
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-50"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-50"
        />

        <div className="flex gap-2">
          <input
            name="first_name"
            placeholder="First Name"
            required
            value={formData.first_name}
            onChange={handleChange}
            disabled={isLoading}
            className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-50"
          />
          <input
            name="last_name"
            placeholder="Last Name"
            required
            value={formData.last_name}
            onChange={handleChange}
            disabled={isLoading}
            className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-50"
          />
        </div>

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          disabled={isLoading}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-50"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-50"
        />

       <input
          name="password_again"
          type="password"
          placeholder="Password again"
          required
          value={passwordAgain} // A különálló state-ből jön
          onChange={handleChange}
          disabled={isLoading}
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
            passwordAgain && formData.password !== passwordAgain ? 'border-red-500' : ''
          }`}
        />

        <button
          type="submit"
         
          disabled={isLoading}
          className="bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition disabled:bg-gray-500 flex justify-center items-center"
        >
          {isLoading ? "Processing..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}