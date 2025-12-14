"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProductDetails, updateAdminProduct, setCurrentProduct } from "@/store/adminProductSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();
    const { currentProduct, status, error } = useSelector((state: RootState) => state.adminProduct);

    const productId = params?.id as string;

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductDetails(productId));
        }
        return () => {
            dispatch(setCurrentProduct(null));
        };
    }, [dispatch, productId]);

    const onSubmit = async (values: ProductFormValues) => {
        try {
            await dispatch(updateAdminProduct({
                _id: productId,
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
                description: "Product updated successfully!",
            });

            router.push('/admin/products');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error || "Failed to update product",
                variant: "destructive",
            });
        }
    };

    if (!currentProduct) {
        if (status === 'failed' || error) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
                    <p>Error: {error || 'Failed to load product'}</p>
                    <Button
                        variant="link"
                        onClick={() => dispatch(fetchProductDetails(productId))}
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Pre-process initial values
    const initialValues: Partial<ProductFormValues> = {
        name: currentProduct.name,
        description: currentProduct.description,
        originalPrice: currentProduct.originalPrice,
        price: currentProduct.price,
        category: typeof currentProduct.category === 'object' ? currentProduct.category._id : currentProduct.category,
        fabric: currentProduct.fabric,
        color: currentProduct.color,
        stock: currentProduct.stock,
        isBestSeller: currentProduct.isBestSeller,
        isNewArrival: currentProduct.isNewArrival,
        images: currentProduct.images,
    };

    return (
        <ProductForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            isSubmitting={status === 'loading'}
            isEditing={true}
        />
    );
}
