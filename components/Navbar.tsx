import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
      {/* Left – Logo */}
      <div className="font-bold text-xl">
        <Link href="/">MyLogo</Link>
      </div>

      {/* Center – Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link
          href="/rooms"
          className="text-gray-700 hover:text-black font-medium"
        >
          Rooms
        </Link>
      </div>

      {/* Right – CTA */}
      <div>
        <Link
          href="/login"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
