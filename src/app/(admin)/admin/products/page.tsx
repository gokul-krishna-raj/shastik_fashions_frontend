import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock product data
const products = [
  {
    id: "1",
    name: "Classic T-Shirt",
    category: "Apparel",
    price: 25.00,
    stock: 150,
  },
  {
    id: "2",
    name: "Designer Jeans",
    category: "Apparel",
    price: 75.00,
    stock: 80,
  },
  {
    id: "3",
    name: "Leather Wallet",
    category: "Accessories",
    price: 40.00,
    stock: 200,
  },
  {
    id: "4",
    name: "Running Shoes",
    category: "Footwear",
    price: 90.00,
    stock: 120,
  },
];

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" passHref>
          <Button>Add New Product</Button>
        </Link>
      </div>

      <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg border">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/products/${product.id}/edit`} passHref>
                      <Button variant="ghost" size="sm" className="mr-2">Edit</Button>
                    </Link>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
