// frontend/components/PaymentWrapper.tsx
import { ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// A Promise típusa automatikusan Stripe | null lesz
const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_tovabbi_karakterek'
);

interface PaymentWrapperProps {
  children: ReactNode;
}

export default function PaymentWrapper({ children }: PaymentWrapperProps) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}