'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Az ID kinyeréséhez
import Link from "next/link";


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
  equipment: any;
};

export default function RoomPage() {
  const params = useParams(); // Kinyerjük az URL-ből az id-t
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);

      const [roomRes, equipmentRes] = await Promise.all([
        fetch(`http://localhost:3000/rooms/${params.id}`),
        fetch(`http://localhost:3000/equipment/rooms/${params.id}`)
      ]);

      if (!roomRes.ok) throw new Error("Room not found");

      const roomData = await roomRes.json();
      setRoom(roomData);

      if (equipmentRes.ok) {
        const equipmentData = await equipmentRes.json();
        setEquipments(equipmentData);
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
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* KÉPGALÉRIA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {room.images && room.images.length > 0 ? (
            room.images.map((img, index) => (
              <img 
                key={index} 
                src={img.url} 
                alt={`${room.title} - ${index}`} 
                className={`w-full h-80 object-cover ${index === 0 ? 'md:col-span-2' : ''} rounded-xl`}
              />
            ))
          ) : (
            <div className="h-80 bg-gray-200 flex items-center justify-center md:col-span-2 rounded-xl">No images available</div>
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
          {eq.equipment.name}
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
  );
}