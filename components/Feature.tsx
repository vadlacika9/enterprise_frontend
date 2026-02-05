import Link from "next/link";

const features=[
   "Instant Booking",
    "Real-Time Availability",
    "Seamless Experience",
    "Smart Filters",
    "Transparent Pricing",
    "Transparent Pricing",
  ];

export default function FeatureList() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6 md:px-12 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Included Features
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 border rounded-lg p-4 hover:shadow-md transition"
            >
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/rooms"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-lg"
          >
            Book a room
          </Link>
        </div>
      </div>
    </section>
  );
}
