'use client'

import { StripeCardElementOptions } from '@stripe/stripe-js';
import Cookies from "js-cookie";
// components/CheckoutForm.tsx


import React, { useState, FormEvent } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 1. Definiáljuk, hogy milyen adatokat (props) fogadhat a komponens
interface CheckoutFormProps {
  amount: number;
  roomId: number;
}

// 2. A függvény fejlécében destrukturáljuk az amount-ot és megadjuk a típust
export default function CheckoutForm({ amount, roomId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  if (!stripe || !elements) return;

  setProcessing(true);
  setError(null); // Reseteljük a hibát minden próbálkozásnál

  try {
    // 1. LÉPÉS: PaymentIntent kérése a Backendetől
    // Átadjuk az összeget és a roomId-t is a metadata-hoz
    const response = await fetch("http://localhost:3000/payments/create-intent", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('auth-token')}` // Token a user azonosításhoz
      },
      body: JSON.stringify({ 
        amount: amount,
        roomId: roomId // Feltételezve, hogy ez a prop-okból vagy state-ből elérhető
      }) 
    });

    const data = (await response.json()) as { clientSecret: string };

    const cardElement = elements.getElement(CardElement);
    if (!cardElement || !data.clientSecret) {
      setProcessing(false);
      return;
    }

    // 2. LÉPÉS: Fizetés megerősítése a Stripe-al
    const payload = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card: cardElement }
    });

    if (payload.error) {
      setError(`Fizetési hiba: ${payload.error.message}`);
      setProcessing(false);
    } else if (payload.paymentIntent?.status === 'succeeded') {
      
      // ✅ 3. LÉPÉS: SIKERES FIZETÉS UTÁN -> Adatbázis rögzítése
      // Meghívjuk a saját végpontunkat, ami lefuttatja a Service -> Repo tranzakciót
      const confirmResponse = await fetch("http://localhost:3000/payments/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('auth-token')}`
        },
        body: JSON.stringify({ 
          paymentIntentId: payload.paymentIntent.id,
          roomId: roomId 
        }) 
      });

      if (confirmResponse.ok) {
        setSucceeded(true);
        console.log("Sikeres fizetés és foglalás rögzítve!");
      } else {
        const errorData = await confirmResponse.json();
        setError(`A fizetés sikerült, de a foglalás rögzítése hibába ütközött: ${errorData.error}`);
      }
      
      setProcessing(false);
    }
  } catch (err: any) {
    setError("Hiba történt a szerverrel való kommunikáció során.");
    setProcessing(false);
  }
};

const cardStyle: StripeCardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#aab7c4" }
    },
    invalid: { color: "#fa755a", iconColor: "#fa755a" }
  }
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="p-4 border rounded-xl bg-gray-50 shadow-inner">
        <CardElement options={cardStyle} />
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        disabled={processing || succeeded || !stripe}
        className="w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-all duration-200"
      >
        {processing ? "Feldolgozás..." : succeeded ? "✓ Sikeres fizetés!" : "Fizetés indítása"}
      </button>
    </form>
  );
}