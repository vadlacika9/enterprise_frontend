import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-gray-100 min-h-[80vh] flex items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 gap-8">
        
        {/* Left side – Text */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Discover & Book Your Perfect Product
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Easily explore our selection and reserve your favorite items in just a few clicks.
          </p>
          <div className="mt-4">
            <Link
              href="/rooms"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-lg"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Right side – Image */}
        <div className="flex-1 hidden md:block">
          <Image
            src="/images/hero.jpg"
            alt="Product illustration"
            className="w-full rounded-2xl shadow-lg"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  );
}
