'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Az ID kinyeréséhez
import Link from "next/link";
import Navbar from "@/components/Navbar";


type Room = {
  room_id: number;
  title: string;
  description: string;
  hourly_price: number;
  city: string;
  street: string;
  adress_number: string;
  postal_code: string;
  capacity: number;
  images: { url: string }[];
};

type Equipment = {
  equipment_id: number;
  name: string;
  value?: string | number;
};

type Image = {
  image_id: number;
  url: string;
};

export default function RoomPage() {
  const params = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);

      const [roomRes, imagesRes] = await Promise.all([
        fetch(`http://localhost:3000/rooms/${params.id}/details`),
        fetch(`http://localhost:3000/rooms/${params.id}/images`),
      ]);

      if (!roomRes.ok) throw new Error("Room not found");
      const roomData = await roomRes.json();
      setRoom(roomData);

     console.log(roomData);
     setEquipments(roomData.equipments || []);

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setImages(imagesData);
        setCurrentImageIndex(0);
      }


    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (params.id) fetchData();
}, [params.id]);

  if (loading) return <div className="text-center py-20">Loading room details...</div>;
  if (error || !room) return <div className="text-center py-20 text-red-500">{error || "Room not found"}</div>;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="p-2">
          {images && images.length > 0 ? (
            <div className="relative">
              <img
                key={images[currentImageIndex].image_id}
                src={images[currentImageIndex].url}
                alt={`${room.title} - ${currentImageIndex + 1}`}
                className="w-full h-96 object-cover rounded-xl"
              />

              <button
                type="button"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center shadow"
                aria-label="Previous image"
              >
                &larr;
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center shadow"
                aria-label="Next image"
              >
                &rarr;
              </button>

              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
          ) : (
            <div className="h-80 bg-gray-200 flex items-center justify-center rounded-xl">No images available</div>
          )}
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            
            {/* BAL OLDAL: INFÓK */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">{room.title}</h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <span className="font-medium">{room.city}, {room.street} {room.adress_number}</span>
                <span>•</span>
                <span>Max {room.capacity} people</span>
              </p>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {room.description || "No description provided."}
                </p>
              </div>
              <div className="mt-10">
  <h2 className="text-xl font-semibold mb-4">Equipment</h2>

  {equipments.length > 0 ? (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {equipments.map((eq) => (
        <li
          key={eq.equipment_id}
          className="bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium text-gray-900"
        >
          {eq.name}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-400">No equipment listed.</p>
  )}
</div>
            </div>

            {/* JOBB OLDAL: FOGLALÁS KÁRTYA */}
            <div className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-black text-gray-900">
                ${room.hourly_price.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ hour</span>
              </p>
              
              <button className="w-full bg-black text-white mt-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
                Reserve Now
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4 italic">
                You won't be charged yet
              </p>
            </div>

          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
             <Link href="/rooms" className="text-gray-500 hover:text-black transition flex items-center gap-2">
               ← Back to all rooms
             </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

