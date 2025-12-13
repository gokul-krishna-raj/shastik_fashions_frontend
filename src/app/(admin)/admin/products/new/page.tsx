"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createAdminProduct } from "@/store/adminProductSlice";
import { fetchCategories } from "@/store/categorySlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Product description must be at least 10 characters.",
  }),
  originalPrice: z.preprocess(
    (a) => (a === "" || a === null || a === undefined ? 0 : parseFloat(String(a))),
    z.number().min(0, { message: "Original price must be a positive number." })
  ),
  price: z.preprocess(
    (a) => (a === "" || a === null || a === undefined ? 0 : parseFloat(String(a))),
    z.number().positive({ message: "Price must be a positive number." })
  ),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  fabric: z.string().min(1, {
    message: "Fabric is required.",
  }),
  color: z.string().min(1, {
    message: "Color is required.",
  }),
  stock: z.preprocess(
    (a) => (a === "" || a === null || a === undefined ? 0 : parseInt(String(a), 10)),
    z.number().int().min(0, { message: "Stock cannot be negative." })
  ),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  images: z.array(z.instanceof(File)).min(1, {
    message: "At least one image is required.",
  }),
});

export default function CreateProductPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
  const { status, error } = useSelector((state: RootState) => state.adminProduct);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      originalPrice: 0,
      price: 0,
      category: "",
      fabric: "",
      color: "",
      stock: 0,
      isBestSeller: false,
      isNewArrival: false,
      images: [],
    },
  });

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...form.getValues('images'), ...files];
    form.setValue('images', newFiles, { shouldValidate: true });

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    const currentPreviews = [...imagePreviews];
    
    currentImages.splice(index, 1);
    currentPreviews.splice(index, 1);
    
    form.setValue('images', currentImages, { shouldValidate: true });
    setImagePreviews(currentPreviews);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        images: values.images,
      })).unwrap();

      toast({
        title: "Success",
        description: "Product created successfully!",
      });

      // Clean up preview URLs
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Product</h1>
          <p className="text-slate-600 mt-1">Add a new product to your catalog</p>
        </div>
        <Link href="/admin/products">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Premium Silk Saree"
                            className="rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the product in detail..."
                            className="rounded-lg min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900">Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (₹) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="rounded-lg"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>MRP or original price</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price (₹) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="rounded-lg"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>Current selling price</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="rounded-lg"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900">Product Attributes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fabric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fabric *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Silk, Cotton, Georgette"
                            className="rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Red, Blue, Maroon"
                            className="rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3 pt-2">
                    <FormField
                      control={form.control}
                      name="isBestSeller"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Best Seller</FormLabel>
                            <FormDescription>
                              Mark this product as a best seller
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isNewArrival"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>New Arrival</FormLabel>
                            <FormDescription>
                              Mark this product as a new arrival
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900">Product Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images *</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                  <p className="mb-2 text-sm text-slate-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-slate-500">PNG, JPG, WEBP (MAX. 5MB each)</p>
                                </div>
                                <input
                                  id="image-upload"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>

                            {imagePreviews.length > 0 && (
                              <div className="grid grid-cols-2 gap-4">
                                {imagePreviews.map((preview, index) => (
                                  <div
                                    key={index}
                                    className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square"
                                  >
                                    <Image
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload at least one image. You can upload multiple images.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="rounded-xl">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
