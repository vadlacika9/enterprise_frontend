'use client'

import { useState, useEffect, useMemo } from "react";
import { fetchEquipments } from "../../../services/FetchEquipments"; 
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

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    postal_code: "",
    street: "",
    adress_number: "",
    room_number: "",
    capacity: 1,
    hourly_price: 0,
    description: "",
    selectedEquipments: [] as number[],
    images: [] as File[]
  });

  // Load Equipments
  useEffect(() => {
    async function loadEquipments() {
      try {
        const data = await fetchEquipments();
        setDbEquipments(data);
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

  // Group Equipments by Category
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

  // Navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Handlers
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
      formPayload.append("postal_code", String(formData.postal_code));
      formPayload.append("street", formData.street);
      formPayload.append("adress_number", formData.adress_number);
      formPayload.append("room_number", String(formData.room_number));
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

  // --- STÍLUSOK (DESIGN SYSTEM) ---
  // Ez biztosítja, hogy minden input egységes és jól látható legyen
  const inputClasses = "w-full border border-gray-300 p-3 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium bg-white";
  const labelClasses = "block text-sm font-bold text-gray-900 mb-1 ml-1";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        
        {/* Progress Bar */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`h-2 flex-1 mx-1 rounded-full transition-colors duration-300 ${step >= num ? "bg-black" : "bg-gray-200"}`} />
          ))}
        </div>

        {/* --- STEP 1: Basic Info --- */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-2 text-black">Basic Information</h2>
            
            <div>
              <label className={labelClasses}>Room Title</label>
              <input name="title" placeholder="e.g. Konferencia terem" onChange={handleChange} className={inputClasses} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>City</label>
                <input name="city" placeholder="Kolozsvár" onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Postal Code</label>
                <input name="postal_code" placeholder="601545" onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Street</label>
              <input name="street" placeholder="Kossuth Lajos utca" onChange={handleChange} className={inputClasses} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Address Number</label>
                <input name="adress_number" placeholder="1A" onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Room / Door</label>
                <input name="room_number" placeholder="4-es ajtó" onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Capacity (Person)</label>
                <input name="capacity" type="number" min="1" onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Hourly Price ($)</label>
                <input name="hourly_price" type="number" min="0" onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Description</label>
              <textarea name="description" placeholder="Írj egy érdekes lírást..." onChange={handleChange} className={`${inputClasses} h-32 resize-none`} />
            </div>

            <button onClick={nextStep} className="bg-black text-white p-4 rounded-xl mt-4 font-bold hover:bg-gray-800 transition shadow-md">
              Next: Equipments →
            </button>
          </div>
        )}

        {/* --- STEP 2: Equipments --- */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-extrabold text-black">Equipments</h2>
              <p className="text-gray-600 font-medium mt-1">Select what represents your room best.</p>
            </div>
            
            {isLoadingEquip ? (
              <p className="text-center py-10 text-gray-500 font-medium">Loading equipments...</p>
            ) : (
              <>
                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                        activeCategory === cat 
                          ? "bg-black text-white border-black shadow-md" 
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {groupedEquipments[activeCategory]?.map((item) => (
                    <label 
                      key={item.equipment_id} 
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.selectedEquipments.includes(item.equipment_id) 
                          ? "border-black bg-gray-50 ring-1 ring-black shadow-sm" 
                          : "border-gray-200 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <span className="font-bold text-gray-800">{item.name}</span>
                      <input 
                        type="checkbox" 
                        className="accent-black w-5 h-5 cursor-pointer"
                        checked={formData.selectedEquipments.includes(item.equipment_id)}
                        onChange={() => handleEquipmentChange(item.equipment_id)}
                      />
                    </label>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-4 mt-4">
              <button onClick={prevStep} className="flex-1 border-2 border-gray-200 text-black p-4 rounded-xl font-bold hover:bg-gray-100 transition">
                ← Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-md">
                Next: Photos →
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: Photos --- */}
        {step === 3 && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-extrabold text-black">Photos</h2>
              <p className="text-gray-600 font-medium mt-1">Upload high-quality images to attract more guests.</p>
            </div>

            {/* Drag & Drop Zone */}
            <div className="border-2 border-dashed border-gray-400 rounded-3xl p-12 text-center hover:border-black hover:bg-gray-50 transition-all relative bg-white group cursor-pointer">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop files here</p>
                </div>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                <p className="text-green-800 font-bold">
                  {formData.images.length} image(s) selected
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <button 
                onClick={prevStep} 
                className="flex-1 border-2 border-gray-200 text-black p-4 rounded-xl font-bold hover:bg-gray-100 transition"
              >
                ← Back
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={formData.images.length === 0 || isSubmitting}
                className="flex-1 bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? "Posting..." : "Finish & Post Room ✓"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}