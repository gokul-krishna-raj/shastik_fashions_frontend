"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
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
import { ArrowLeft, Upload, X, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    images: z.union([
        z.array(z.instanceof(File)),
        z.array(z.string().url({ message: "Invalid URL" }))
    ]).refine((files) => files.length > 0, {
        message: "At least one image is required.",
    }),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialValues?: Partial<ProductFormValues>;
    onSubmit: (values: ProductFormValues) => Promise<void>;
    isSubmitting: boolean;
    isEditing?: boolean;
}

export default function ProductForm({
    initialValues,
    onSubmit,
    isSubmitting,
    isEditing = false
}: ProductFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();
    const { categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploadType, setUploadType] = useState<"file" | "url">("file");
    const [urlInput, setUrlInput] = useState("");

    const form = useForm<ProductFormValues>({
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
            ...initialValues,
        },
    });

    // Load existing images for preview if editing
    useEffect(() => {
        if (initialValues?.images && initialValues.images.length > 0) {
            const images = initialValues.images;
            if (typeof images[0] === 'string') {
                setUploadType('url');
                // Preview URLs are just the strings themselves
                // Ensure form knows these are the values
                form.setValue('images', images as any);
            }
        }
    }, [initialValues, form]);

    useEffect(() => {
        if (categoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [dispatch, categoriesStatus]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const currentImages = form.getValues('images');
        if (currentImages.length > 0 && typeof currentImages[0] === 'string') {
            form.setValue('images', files, { shouldValidate: true });
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
            return;
        }

        const newFiles = [...(currentImages as File[]), ...files];
        form.setValue('images', newFiles, { shouldValidate: true });

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues('images') as any[];

        // If we are in URL mode or current images are strings, handle as string array
        if (uploadType === 'url' || (currentImages.length > 0 && typeof currentImages[0] === 'string')) {
            const newImages = currentImages.filter((_, i) => i !== index);
            form.setValue('images', newImages, { shouldValidate: true });
            // For URLs, previews come directly from the form value usually, but if we used local state for previews logic (which we don't for URL mode in the render below), it's fine.
            // We need to keep previews specific to file upload unless we unification it.
            // The UI for URL renders from form.value, the UI for File renders from imagePreviews.
            // So for URL mode we don't need to update imagePreviews.
            return;
        }

        // File mode
        const currentPreviews = [...imagePreviews];
        const newImages = (currentImages as File[]).filter((_, i) => i !== index);
        currentPreviews.splice(index, 1);

        form.setValue('images', newImages, { shouldValidate: true });
        setImagePreviews(currentPreviews);
    };

    const handleTabChange = (value: string) => {
        const type = value as "file" | "url";
        setUploadType(type);
        form.setValue("images", []);
        setImagePreviews([]);
        setUrlInput("");
    };

    const handleAddUrl = () => {
        if (!urlInput) return;

        try {
            z.string().url().parse(urlInput);
        } catch (e) {
            toast({ title: "Invalid URL", description: "Please enter a valid image URL", variant: "destructive" });
            return;
        }

        const currentImages = form.getValues('images') || [];
        if (currentImages.length > 0 && currentImages[0] instanceof File) {
            form.setValue('images', [urlInput], { shouldValidate: true });
        } else {
            const newImages = [...(currentImages as string[]), urlInput];
            form.setValue('images', newImages, { shouldValidate: true });
        }

        setUrlInput("");
    };

    const removeUrl = (index: number) => {
        const currentImages = form.getValues('images') as string[];
        const newImages = currentImages.filter((_, i) => i !== index);
        form.setValue('images', newImages, { shouldValidate: true });
    };

    return (
        <div className="space-y-6 pb-10 max-w-full overflow-x-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{isEditing ? 'Edit Product' : 'Create New Product'}</h1>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">{isEditing ? 'Update product details' : 'Add a new product to your catalog'}</p>
                </div>
                <Link href="/admin/products">
                    <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </Button>
                </Link>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-6 min-w-0">
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
                        <div className="space-y-6 min-w-0">
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
                                    <div className="space-y-4">
                                        <Tabs value={uploadType} onValueChange={handleTabChange} className="w-full">
                                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                                <TabsTrigger value="file">Upload Images</TabsTrigger>
                                                <TabsTrigger value="url">Add Image URLs</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="file" className="mt-0">
                                                <FormField
                                                    control={form.control}
                                                    name="images"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Upload Files *</FormLabel>
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

                                                                    {(imagePreviews.length > 0) && (
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
                                                            <FormDescription>Upload one or more images from your device.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TabsContent>

                                            <TabsContent value="url" className="mt-0">
                                                <FormField
                                                    control={form.control}
                                                    name="images"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Image URLs *</FormLabel>
                                                            <FormControl>
                                                                <div className="space-y-4">
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            placeholder="https://example.com/image.jpg"
                                                                            value={urlInput}
                                                                            onChange={(e) => setUrlInput(e.target.value)}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    e.preventDefault();
                                                                                    handleAddUrl();
                                                                                }
                                                                            }}
                                                                            className="rounded-lg"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            onClick={handleAddUrl}
                                                                            variant="secondary"
                                                                            className="shrink-0"
                                                                        >
                                                                            <Plus className="w-4 h-4 mr-2" /> Add
                                                                        </Button>
                                                                    </div>

                                                                    {field.value && Array.isArray(field.value) && field.value.length > 0 && typeof field.value[0] === 'string' && (
                                                                        <div className="space-y-2">
                                                                            {(field.value as string[]).map((url, index) => (
                                                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                                                        <div className="relative w-10 h-10 rounded overflow-hidden bg-slate-200 shrink-0">
                                                                                            <Image
                                                                                                src={url}
                                                                                                alt="Url Preview"
                                                                                                fill
                                                                                                className="object-cover"
                                                                                                onError={(e) => {
                                                                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=Error';
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <span className="text-sm text-slate-600 truncate">{url}</span>
                                                                                    </div>
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => removeUrl(index)}
                                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription>Add one or more valid image URLs.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                        <Link href="/admin/products" className="w-full sm:w-auto">
                            <Button type="button" variant="outline" className="rounded-xl w-full">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl w-full sm:w-auto"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Product' : 'Create Product')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
