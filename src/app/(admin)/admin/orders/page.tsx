import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock order data
const orders = [
  {
    id: "ORD001",
    customer: "Alice Smith",
    date: "2023-11-20",
    total: 120.00,
    status: "Processing",
  },
  {
    id: "ORD002",
    customer: "Bob Johnson",
    date: "2023-11-19",
    total: 75.50,
    status: "Shipped",
  },
  {
    id: "ORD003",
    customer: "Charlie Brown",
    date: "2023-11-18",
    total: 200.00,
    status: "Delivered",
  },
  {
    id: "ORD004",
    customer: "Diana Prince",
    date: "2023-11-17",
    total: 50.00,
    status: "Cancelled",
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Processing":
      return "default";
    case "Shipped":
      return "secondary";
    case "Delivered":
      return "success"; // Assuming a 'success' variant exists or can be styled
    case "Cancelled":
      return "destructive";
    default:
      return "default";
  }
};

export default function AdminOrdersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg border">
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Add action buttons here, e.g., View Details */}
                    <span className="text-muted-foreground">View Details</span>
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
