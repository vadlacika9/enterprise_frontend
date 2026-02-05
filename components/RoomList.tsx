'use client'

import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  room_id: number;
  title: string;
  description: string;
  hourly_price: number;
  city: string;
  address_number: string;
  postal_code: number;
  capacity: number;
  is_available: number;
  room_number: string;
  user_id: number;
  images: { url: string }[];
  equipments: [];
};

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("http://localhost:3000/rooms");
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading) return <p className="text-center py-8 text-lg font-medium">Loading rooms...</p>;

  return (
    <div className="container mx-auto px-6 md:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {rooms.map((room) => {
        const detailsUrl = `/rooms/${room.room_id}`;

        return (
          <div key={room.room_id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            
            <Link href={detailsUrl} className="block overflow-hidden">
              {room.images && room.images.length > 0 ? (
                <img
                  src={room.images[0].url}
                  alt={room.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">No image</div>
              )}
            
            
            <div className="p-5 flex flex-col grow gap-3">
              <div>
                  <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">{room.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{room.city}</p>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {room.description || "No description available for this room."}
              </p>
              
              <div className="mt-auto">
                 <p className="text-2xl font-black text-gray-900 mb-4">
                  {room.hourly_price.toFixed(2)} <span className="text-sm font-normal text-gray-500">RON / hour</span>
                </p>

              </div>
            </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}