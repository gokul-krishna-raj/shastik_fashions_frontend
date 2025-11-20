'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchAddresses, deleteAddress, updateAddress, addAddress, setSelectedAddressId } from '@/store/addressSlice';
import AddressCard from './AddressCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {AddressModal} from './AddressModal'; // Your existing modal component

const CheckoutAddressSelector = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { addresses, selectedAddressId, status, error } = useSelector((state: RootState) => state.address);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<any | null>(null);

  // Fetch address list
  useEffect(() => {
    if (status === 'idle') dispatch(fetchAddresses());
  }, [status, dispatch]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteAddress(id));
    toast({ title: 'Address deleted successfully' });
    dispatch(fetchAddresses());
  };

  const handleEdit = (address: any) => {
    setEditAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditAddress(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editAddress) {
        console.log("data =>",data);
        
        await dispatch(updateAddress({ id: editAddress._id, updatedAddress: data }));
        toast({ title: 'Address updated successfully!' });
      } else {
        await dispatch(addAddress(data));
        toast({ title: 'Address added successfully!' });
      }
      setIsModalOpen(false);
      setEditAddress(null);
      dispatch(fetchAddresses());
    } catch {
      toast({ title: 'Failed to save address', variant: 'destructive' });
    }
  };

  const handleSelect = (id: string) => {
    dispatch(setSelectedAddressId(id));
  };

  if (status === 'loading' && addresses.length === 0) return <p>Loading addresses...</p>;
  if (error && status === 'failed') return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <p>No addresses found. Please add one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onDelete={handleDelete}
              onSelect={handleSelect}
              isSelected={selectedAddressId === (address.id || address._id)}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Add New Address button */}
      <Button variant="outline" className="w-full" onClick={handleAddNew}>
        Add New Address
      </Button>

      {/* Address Modal (Add/Edit shared) */}
      <AddressModal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditAddress(null); }}
        onSubmit={handleSubmit}
        address={editAddress}
      />
    </div>
  );
};

export default CheckoutAddressSelector;
