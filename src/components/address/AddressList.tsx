'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAddresses, deleteAddress } from '@/store/addressSlice';
import AddressCard from '@/components/address/AddressCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AddressList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, status, error } = useSelector((state: RootState) => state.address);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAddresses());
    }
  }, [status, dispatch]);

  const handleDelete = async (id: string) => {
    dispatch(deleteAddress(id));
  };

  useEffect(() => {
    if (status === 'succeeded' && !error) {
      // Optionally show a toast for successful fetch, but usually not needed for initial load
    } else if (status === 'failed' && error) {
      toast({
        title: 'Error',
        description: error || 'Failed to load addresses. Please try again.',
        variant: 'destructive',
      });
    }
  }, [status, error, toast]);

  if (status === 'loading' && addresses.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 relative min-h-screen">
      <div className="pb-[70px]"> {/* Padding for the fixed button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Addresses</h1>
          {/* Button moved to fixed position below */}
        </div>

        {addresses.length === 0 && status !== 'loading' ? (
          <p className="text-center text-gray-600">No addresses found. Click &quot;Add New Address&quot; to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <AddressCard key={address.id || address._id} address={address} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Fixed "Add New Address" button for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t md:relative md:border-t-0 md:p-0 md:bg-transparent md:flex md:justify-end">
        <Button onClick={() => router.push('/address/add')} className="w-full md:w-auto">
          Add New Address
        </Button>
      </div>
    </div>
  );
};

export default AddressList;
