'use client'

import { useState, useEffect, useMemo } from "react";
import { fetchEquipments } from "../../../services/FetchEquipments"; // Importáld a szervizt
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

type Equipment = {
  equipment_id: number;
  name: string;
  category: string;
};

export default function AddRooms() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [dbEquipments, setDbEquipments] = useState<{equipment_id: number, name: string, category: string}[]>([]);
  const [isLoadingEquip, setIsLoadingEquip] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    postal_code: null,
    street: "",
    adress_number: "",
    room_number: null,
    capacity: 1,
    hourly_price: 0,
    description: "",
    selectedEquipments: [] as number[],
    images: [] as File[]
  });

  useEffect(() => {
    async function loadEquipments() {
      try {
        const data = await fetchEquipments();
        setDbEquipments(data);
        // Alapértelmezetten az első kategóriát tesszük aktívvá
        if (data.length > 0) {
          setActiveCategory(data[0].category);
        }
      } catch (err) {
        console.error("Error loading equipments:", err);
      } finally {
        setIsLoadingEquip(false);
      }
    }
    loadEquipments();
  }, []);

  const groupedEquipments = useMemo(() => {
    return dbEquipments.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = [];
      }
      acc[curr.category].push(curr);
      return acc;
    }, {} as Record<string, Equipment[]>);
  }, [dbEquipments]);

  const categories = Object.keys(groupedEquipments);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEquipmentChange = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedEquipments: prev.selectedEquipments.includes(id)
        ? prev.selectedEquipments.filter(item => item !== id)
        : [...prev.selectedEquipments, id]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = Cookies.get('auth-token');

      if (formData.images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("city", formData.city);
      formPayload.append("postal_code", String(formData.postal_code ?? ""));
      formPayload.append("street", formData.street);
      formPayload.append("adress_number", formData.adress_number);
      formPayload.append("room_number", String(formData.room_number ?? ""));
      formPayload.append("capacity", String(formData.capacity));
      formPayload.append("hourly_price", String(formData.hourly_price));
      formPayload.append("description", formData.description);
      formPayload.append("selectedEquipments", JSON.stringify(formData.selectedEquipments));
      formData.images.forEach((file) => formPayload.append("images", file));

      const response = await fetch("http://localhost:3000/rooms/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formPayload
      });

      const result = await response.json();

      if (response.ok) {
        alert("Room successfully listed!");
        router.push('/rooms');
      } else {
        alert(`Error: ${result.message || result.error || "Failed to add room"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`h-2 flex-1 mx-1 rounded-full ${step >= num ? "bg-black" : "bg-gray-200"}`} />
          ))}
        </div>

        {/* STEP 1: Basic Info (Változatlan) */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
            <input name="title" placeholder="Room Title" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input name="city" placeholder="City" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
              <input name="postal_code" placeholder="Postal Code" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
            </div>
            <input name="street" placeholder="Street Name" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input name="adress_number" placeholder="Address Number" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
              <input name="room_number" placeholder="Room/Suite Number" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 ml-2">Capacity</label>
                <input name="capacity" type="number" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 ml-2">Hourly Price ($)</label>
                <input name="hourly_price" type="number" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none" />
              </div>
            </div>
            <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-3 rounded-xl h-32 focus:ring-2 focus:ring-gray-300 outline-none" />
            <button onClick={nextStep} className="bg-black text-white p-4 rounded-xl mt-4 font-bold hover:bg-gray-800 transition">Next: Equipments</button>
          </div>
        )}

        {/* STEP 2: Dinamikus Equipments */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Equipments</h2>
            <p className="text-gray-500 mb-2">What's available in this room?</p>
            
            {isLoadingEquip ? (
              <p className="text-center py-10">Loading...</p>
            ) : (
              <>
                {/* KATEGÓRIA VÁLASZTÓ TABS */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                        activeCategory === cat 
                          ? "bg-black text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* AZ AKTÍV KATEGÓRIA ESZKÖZEI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 animate-in fade-in duration-300">
                  {groupedEquipments[activeCategory]?.map((item) => (
                    <label 
                      key={item.equipment_id} 
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.selectedEquipments.includes(item.equipment_id) 
                          ? "border-black bg-gray-50 ring-1 ring-black" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <input 
                        type="checkbox" 
                        className="accent-black w-5 h-5"
                        checked={formData.selectedEquipments.includes(item.equipment_id)}
                        onChange={() => handleEquipmentChange(item.equipment_id)}
                      />
                    </label>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="flex-1 border p-4 rounded-xl font-bold">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-black text-white p-4 rounded-xl font-bold">Next: Photos</button>
            </div>
          </div>
        )}

        {/* STEP 3: Images (Változatlan) */}
        {step === 3 && (
  <div className="flex flex-col gap-4 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold mb-2">Photos</h2>
    <p className="text-gray-500 mb-4">Upload at least one high-quality photo of the room.</p>

    {/* Feltöltő zóna */}
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-black transition-colors relative bg-gray-50 group">
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleImageChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
      />
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <p className="text-gray-600">
          <span className="font-bold underline">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 5MB per file)</p>
      </div>
    </div>

    {formData.images.length > 0 && (
      <p className="text-sm text-gray-600">
        {formData.images.length} file(s) selected
      </p>
    )}
    <div className="flex gap-4 mt-8">
      <button 
        onClick={prevStep} 
        className="flex-1 border p-4 rounded-xl font-bold hover:bg-gray-50 transition"
      >
        Back
      </button>
      <button 
        onClick={handleSubmit} 
        disabled={formData.images.length === 0}
        className="flex-1 bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Finish & Post Room
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
