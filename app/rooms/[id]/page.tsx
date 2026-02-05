'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Rugalmas típusdefiníció (kezeli az elírásokat is)
type Room = {
  room_id: number;
  title: string;
  description: string;
  hourly_price: number | string; // Lehet string is, majd átalakítjuk
  city: string;
  street: string;
  adress_number?: string; // Lehet, hogy így jön
  address_number?: string; // De lehet, hogy így
  room_number?: string;
  postal_code: string;
  capacity: number;
};

type Equipment = {
  equipment_id: number;
  name: string;
};

type Image = {
  image_id: number;
  url: string;
};

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  
  // Képek (egyelőre csak alap logika, ha később lesznek)
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      
      try {
        setLoading(true);

        // 1. Adatok lekérése
        const roomRes = await fetch(`http://localhost:3000/rooms/${params.id}/details`);
        
        if (!roomRes.ok) throw new Error("Nem sikerült betölteni a szobát.");
        
        const roomData = await roomRes.json();
        
        // --- DEBUG: Nézzük meg a konzolon, pontosan mi jön! ---
        console.log("Szoba adatok:", roomData); 

        setRoom(roomData);
        setEquipments(roomData.equipments || []);

        // 2. Képek lekérése (Ha van endpoint)
        try {
            const imagesRes = await fetch(`http://localhost:3000/rooms/${params.id}/images`);
            if (imagesRes.ok) {
                const imagesData = await imagesRes.json();
                setImages(imagesData);
            }
        } catch (imgErr) {
            console.log("Képek betöltése sikertelen (nem baj, a szöveg a lényeg)");
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  const handleReserve = () => {
    if (!room) return;
    const price = Number(room.hourly_price); // Biztonsági átalakítás

    const paymentData = {
      roomId: room.room_id,
      title: room.title,
      amount: price,
    };
    sessionStorage.setItem("pendingPayment", JSON.stringify(paymentData));
    router.push("/payment");
  };

  if (loading) return <div className="text-center py-20 font-bold">Betöltés...</div>;
  if (error || !room) return <div className="text-center py-20 text-red-500 font-bold">{error || "A szoba nem található."}</div>;

  // Segédváltozók a megjelenítéshez
  const displayPrice = Number(room.hourly_price).toFixed(2);
  const addressNum = room.adress_number || room.address_number || ""; // Kezeli mindkét írásmódot

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* --- KÉPGALÉRIA (Egyszerűsítve) --- */}
          <div className="bg-gray-200 h-64 sm:h-96 flex items-center justify-center relative">
            {images.length > 0 ? (
                 // Ha van kép, próbáljuk megjeleníteni
                 <img 
                   src={images[currentImageIndex].url} 
                   alt="Room" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                       // Ha nem tölt be a kép, elrejtjük a törött ikont
                       (e.target as HTMLImageElement).style.display = 'none';
                   }} 
                 />
            ) : (
                <div className="text-gray-500 font-medium flex flex-col items-center">
                    <span className="text-4xl mb-2">🏠</span>
                    <span>No images available</span>
                </div>
            )}
            
            {/* Lapozó gombok (csak ha több kép van) */}
            {images.length > 1 && (
                <>
                    <button onClick={() => setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1)} className="absolute left-4 bg-white/80 p-2 rounded-full shadow hover:bg-white">←</button>
                    <button onClick={() => setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1)} className="absolute right-4 bg-white/80 p-2 rounded-full shadow hover:bg-white">→</button>
                </>
            )}
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              
              {/* --- BAL OLDAL: RÉSZLETEK --- */}
              <div className="flex-1 w-full">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{room.title}</h1>
                
                {/* CÍM MEGJELENÍTÉS (Javítva: Irányítószám + Emelet/Ajtó is) */}
                <div className="flex flex-wrap items-center text-gray-600 gap-2 text-lg mb-6">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>
                    {room.postal_code} <strong>{room.city}</strong>, {room.street} {addressNum}.
                    {room.room_number && <span className="ml-1">(Door: {room.room_number})</span>}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                        👥 Max {room.capacity} People
                    </span>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-xl font-bold mb-3 text-black">Description</h2>
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                    {room.description || "No description provided yet."}
                  </p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4 text-black">Equipment</h2>
                  {equipments.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {equipments.map((eq) => (
                        <li key={eq.equipment_id} className="bg-gray-100 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold">
                          ✓ {eq.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">No equipment listed.</p>
                  )}
                </div>
              </div>

              {/* --- JOBB OLDAL: ÁR ÉS FOGLALÁS --- */}
              <div className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
                <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-black text-gray-900">{displayPrice}</span>
                    <span className="text-gray-500 font-medium mb-1">RON / hour</span>
                </div>
                
                <button 
                  onClick={handleReserve}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition transform active:scale-95 shadow-lg"
                >
                  Reserve Now
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4">
                  Free cancellation up to 24h before.
                </p>
              </div>

            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100">
               <Link href="/rooms" className="text-gray-500 hover:text-black font-medium inline-flex items-center gap-2 transition">
                 ← Back to all rooms
               </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}