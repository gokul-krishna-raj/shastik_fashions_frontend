'use client';

import MainLayout from '@/layouts/MainLayout';
import { AddressForm } from '@/components/address/AddressForm';

export default function AddAddressPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Add New Address</h1>
        <AddressForm />
      </div>
    </MainLayout>
  );
}
