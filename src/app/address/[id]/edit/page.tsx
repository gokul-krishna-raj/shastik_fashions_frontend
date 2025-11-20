'use client';

import MainLayout from '@/layouts/MainLayout';
import { AddressForm } from '@/components/address/AddressForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Address } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAddresses } from '@/store/addressSlice';
import { useToast } from '@/hooks/use-toast';

export default function EditAddressPage() {
  const router = useRouter();
  const { id } = router.query as { id: string }; // Assuming id is a string
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, status, error } = useSelector((state: RootState) => state.address);
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAddresses());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && id && addresses.length > 0) {
      const foundAddress = addresses.find(addr => (addr.id === id || addr._id === id));
      setCurrentAddress(foundAddress);
    } else if (status === 'failed' && error) {
      toast({
        title: 'Error',
        description: error || 'Failed to load addresses.',
        variant: 'destructive',
      });
    }
  }, [status, id, addresses, error, toast]);

  if (status === 'loading' && !currentAddress) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <p>Loading address...</p>
        </div>
      </MainLayout>
    );
  }

  if (!currentAddress && status === 'succeeded') {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <p>Address not found.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Edit Address</h1>
        {currentAddress ? <AddressForm address={currentAddress} /> : <p>Loading form...</p>}
      </div>
    </MainLayout>
  );
}
