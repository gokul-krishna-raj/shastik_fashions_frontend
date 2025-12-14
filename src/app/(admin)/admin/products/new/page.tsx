"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createAdminProduct } from "@/store/adminProductSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { status } = useSelector((state: RootState) => state.adminProduct);

  async function onSubmit(values: ProductFormValues) {
    try {
      await dispatch(createAdminProduct({
        name: values.name,
        description: values.description,
        originalPrice: values.originalPrice,
        price: values.price,
        category: values.category,
        fabric: values.fabric,
        color: values.color,
        stock: values.stock,
        isBestSeller: values.isBestSeller,
        isNewArrival: values.isNewArrival,
        images: values.images as any,
      })).unwrap();

      toast({
        title: "Success",
        description: "Product created successfully!",
      });

      router.push('/admin/products');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to create product",
        variant: "destructive",
      });
    }
  }

  return (
    <ProductForm
      onSubmit={onSubmit}
      isSubmitting={status === 'loading'}
    />
  );
}
