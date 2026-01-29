import { useState } from "react";
import {
  Plus,
  Edit2,
  Package,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeleteConfirmDialog } from "@/components/dashboard/DeleteConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/Redux/Api/productsApi";

/* ================= CONSTANTS ================= */

const units = ["kg", "pcs", "box", "pack"];

/* ================= COMPONENT ================= */

export default function Products() {
  const { toast } = useToast();

  const { data: products = [], isLoading } = useGetProductsQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    unit: "",
    price: "",
    is_active: true,
  });

  /* ================= HANDLERS ================= */

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await updateProduct({
          product_id: editingProduct.id,
          code: formData.code,
          name: formData.name,
          unit: formData.unit,
          price: Number(formData.price),
          is_active: formData.is_active,
        }).unwrap();

        toast({ title: "Product updated successfully" });
      } else {
        await createProduct({
          code: formData.code,
          name: formData.name,
          unit: formData.unit,
          price: Number(formData.price),
        }).unwrap();

        toast({ title: "Product created successfully" });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        code: "",
        name: "",
        unit: "",
        price: "",
        is_active: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      unit: product.unit,
      price: String(product.price),
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

  const toggleStatus = async (product: Product) => {
    try {
      await updateProduct({
        product_id: product.id,
        is_active: !product.is_active,
      }).unwrap();
    } catch {
      toast({
        title: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id).unwrap();
      toast({ title: "Product deleted successfully" });
    } catch {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  };

  /* ================= TABLE ================= */

  const columns = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Product Name", sortable: true },
    { key: "unit", label: "Unit" },
    {
      key: "price",
      label: "Price",
      render: (p: Product) => (
        <span className="font-medium text-primary">₨{p.price}</span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (p: Product) => (
        <StatusBadge
          status={p.is_active ? "success" : "neutral"}
          label={p.is_active ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  const activeCount = products.filter((p) => p.is_active).length;

  /* ================= UI ================= */

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products Catalog</h1>
          <p className="text-muted-foreground">
            Manage your products and pricing
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription>Enter product details below</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Code</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) =>
                    setFormData({ ...formData, unit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingProduct && (
                <div className="flex items-center justify-between">
                  <Label>Active Status</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <Package /> {products.length} Products
        </div>
        <div className="stat-card">
          <Eye /> {activeCount} Active
        </div>
        <div className="stat-card">
          <EyeOff /> {products.length - activeCount} Inactive
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={products}
        columns={columns}
        actions={(product) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleEdit(product)}
            >
              <Edit2 />
            </Button>

            <DeleteConfirmDialog
              onConfirm={() => handleDelete(product)}
              loading={isDeleting}
            />
          </div>
        )}
      />
    </div>
  );
}
