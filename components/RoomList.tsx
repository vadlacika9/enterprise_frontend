'use client'

import { useEffect, useState } from "react";

type Room = {
  room_id: number;
  title: string;
  description: string;
  hourly_price: number;
  imageUrl?: string;
};

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("http://localhost:3000/rooms"); // itt legyen a saját API végpontod
        const data = await res.json();
        setRooms(data);
        console.log(data)
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  if (loading) return <p className="text-center py-8">Loading rooms...</p>;

  return (
    <div className="container mx-auto px-6 md:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.room_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
          {room.imageUrl && (
            <img
              src={room.imageUrl}
              alt={room.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-xl font-semibold">{room.title}</h3>
            <p className="text-gray-600 text-sm">{room.description}</p>
            <p className="text-gray-900 font-bold mt-2">${room.hourly_price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
