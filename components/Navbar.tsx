'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Ellenőrizzük, van-e token. 
    // Ha van, bejelentkezettnek tekintjük a felhasználót.
    const token = Cookies.get("auth-token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("auth-token");
    setIsLoggedIn(false);
    window.location.href = "/"; // Visszavisz a főoldalra
  };

  return (
    <nav className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left – Logo */}
      <div className="font-bold text-xl">
        <Link href="/">MyLogo</Link>
      </div>

      {/* Center – Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-6">
        <Link href="/rooms" className="text-gray-700 hover:text-black font-medium">
          Rooms
        </Link>
        
        {/* HA BE VAN LÉPVE - Megjelenik az "Add Room" opció */}
        {isLoggedIn && (
          <Link href="/rooms/add" className="text-blue-600 hover:text-blue-800 font-medium">
            List Your Room
          </Link>
        )}
      </div>

      {/* Right – Auth Actions */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link href="/bookings" className="text-gray-700 hover:text-black text-sm">
              My Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}