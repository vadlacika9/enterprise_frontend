'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    role: "RENTER", // <--- 1. ÚJ MEZŐ: Alapértelmezett érték
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "password_again") {
      setPasswordAgain(e.target.value);
      return;
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== passwordAgain) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData);
      router.push("/login?message=successful_registration");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full border border-gray-300 p-3 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium bg-white";
  const labelClasses = "block text-sm font-bold text-gray-900 mb-1 ml-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-black mb-2">Create Account</h1>
          <p className="text-gray-500">Join us to book unique rooms and spaces.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <p className="text-sm text-red-800 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* --- 2. ÚJ UI ELEM: ROLE KIVÁLASZTÁS --- */}
          <div>
            <label className={labelClasses}>I want to...</label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                <option value="RENTER">Rent a Room</option>
                <option value="OWNER">List my Room</option>
                {/* Admin-t ide ne tegyünk biztonsági okokból */}
              </select>
              {/* Kis nyíl ikon a select végére */}
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          {/* --------------------------------------- */}

          <div>
            <label className={labelClasses}>Username</label>
            <input name="username" placeholder="CoolUser123" required value={formData.username} onChange={handleChange} disabled={isLoading} className={inputClasses} />
          </div>

          <div>
            <label className={labelClasses}>Email Address</label>
            <input name="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} disabled={isLoading} className={inputClasses} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>First Name</label>
              <input name="first_name" placeholder="John" required value={formData.first_name} onChange={handleChange} disabled={isLoading} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Last Name</label>
              <input name="last_name" placeholder="Doe" required value={formData.last_name} onChange={handleChange} disabled={isLoading} className={inputClasses} />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Phone Number</label>
            <input name="phone_number" placeholder="+40 712 345 678" value={formData.phone_number} onChange={handleChange} disabled={isLoading} className={inputClasses} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className={labelClasses}>Password</label>
                <input name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} disabled={isLoading} className={inputClasses} />
             </div>
             <div>
                <label className={labelClasses}>Confirm Password</label>
                <input name="password_again" type="password" placeholder="••••••••" required value={passwordAgain} onChange={handleChange} disabled={isLoading} className={inputClasses} />
             </div>
          </div>

          <button type="submit" disabled={isLoading} className="mt-4 w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex justify-center items-center">
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}