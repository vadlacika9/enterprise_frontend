'use client'

// frontend/pages/booking.tsx
import { useEffect, useState } from "react";
import PaymentWrapper from '../../components/PaymentWrapper';
import CheckoutForm from '../../components/CheckoutForm'; // Ez lesz a belső formod

export default function PaymentPage() {
  const [paymentInfo, setPaymentInfo] = useState<{amount: number, title: string, roomId: number} | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("pendingPayment");
    if (data) {
      setPaymentInfo(JSON.parse(data));
    }
  }, []);

  if (!paymentInfo) return <div>Loading payment details...</div>;

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">Payment for {paymentInfo.title}</h1>
      <p className="text-2xl font-bold mb-6">{paymentInfo.amount} Lei</p>
      <PaymentWrapper>
        {/* Itt átadjuk az összeget a formnak propként */}
        <CheckoutForm amount={paymentInfo.amount} roomId={paymentInfo.roomId} />
      </PaymentWrapper>
    </div>
  );
}