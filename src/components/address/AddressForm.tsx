'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Address } from '@/types';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addAddress, updateAddress } from '@/store/addressSlice';
import { useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  phone: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits.'),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits.'),
  addressLine1: z.string().min(5, 'Address line 1 must be at least 5 characters.'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters.'),
  state: z.string().min(2, 'State must be at least 2 characters.'),
  country: z.string().min(2, 'Country must be at least 2 characters.'),
  addressType: z.enum(['Home', 'Work']),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address;
  onSuccess?: () => void;
}

export function AddressForm({ address, onSuccess }: AddressFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.address);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: address?.fullName || '',
      phone: address?.phone || '',
      email: address?.email || '',
      pincode: address?.pincode || '',
      addressLine1: address?.addressLine1 || '',
      addressLine2: address?.addressLine2 || '',
      city: address?.city || '',
      state: address?.state || '',
      country: address?.country || 'India',
      addressType: address?.addressType || 'Home',
      isDefault: address?.isDefault || false,
    },
  });

  useEffect(() => {
    if (status === 'succeeded' && !error) {
      toast({
        title: 'Success',
        description: address ? 'Address updated successfully.' : 'Address added successfully.',
        variant: "default"
      });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/address');
      }
    } else if (status === 'failed' && error) {
      toast({
        title: 'Error',
        description: error || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }, [status, error, toast, router, onSuccess, address]);

  const onSubmit = async (data: AddressFormValues) => {
    if (address && (address.id || address._id)) {
      const id = address.id || address._id!;
      dispatch(updateAddress({ id, updatedAddress: data }));
    } else {
      dispatch(addAddress(data));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Details Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" className="bg-slate-50 border-slate-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" type="tel" className="bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" type="email" className="bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Details Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="House no, building, street" className="bg-slate-50 border-slate-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Landmark or area" className="bg-slate-50 border-slate-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" className="bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" className="bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="000000" maxLength={6} className="bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="India" className="bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Home">Home (7am - 9pm delivery)</SelectItem>
                      <SelectItem value="Work">Work (10am - 5pm delivery)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Settings Section */}
        <div className="pt-2">
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-rose-100 bg-rose-50/30 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-rose-400 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base font-medium text-slate-800 cursor-pointer">
                    Use as default address
                  </FormLabel>
                  <FormDescription className="text-xs text-slate-500">
                    We&apos;ll use this address for your future orders.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving Address...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              {address ? 'Update Address' : 'Save Address'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
