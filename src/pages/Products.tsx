import { useState } from "react";
import { Plus, Edit2, Package, Leaf, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialProducts: Product[] = [
  { id: "P001", code: "TLP-GRN-001", name: "Premium Green Tea", category: "Green Tea", unit: "Box (100g)", price: 350, description: "High-quality green tea leaves", status: "active", createdAt: "2024-01-01" },
  { id: "P002", code: "TLP-BLK-001", name: "Classic Black Tea", category: "Black Tea", unit: "Box (250g)", price: 280, description: "Traditional black tea blend", status: "active", createdAt: "2024-01-01" },
  { id: "P003", code: "TLP-SPL-001", name: "Tulip Special Blend", category: "Premium", unit: "Box (100g)", price: 450, description: "Our signature premium blend", status: "active", createdAt: "2024-01-05" },
  { id: "P004", code: "TLP-CRD-001", name: "Cardamom Tea", category: "Flavored", unit: "Box (100g)", price: 380, description: "Black tea with cardamom", status: "active", createdAt: "2024-01-10" },
  { id: "P005", code: "TLP-JSM-001", name: "Jasmine Tea", category: "Flavored", unit: "Box (100g)", price: 400, description: "Green tea with jasmine flowers", status: "active", createdAt: "2024-01-12" },
  { id: "P006", code: "TLP-GNG-001", name: "Ginger Tea", category: "Flavored", unit: "Box (100g)", price: 320, description: "Black tea with ginger", status: "inactive", createdAt: "2024-01-15" },
];

const categories = ["Green Tea", "Black Tea", "Premium", "Flavored", "Herbal"];
const units = ["Box (100g)", "Box (250g)", "Box (500g)", "Packet (50g)", "Bulk (1kg)"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    unit: "",
    price: "",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: Number(formData.price) }
          : p
      ));
      toast({ title: "Product Updated", description: "Product has been updated successfully." });
    } else {
      const newProduct: Product = {
        id: `P${String(products.length + 1).padStart(3, "0")}`,
        ...formData,
        price: Number(formData.price),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProducts([...products, newProduct]);
      toast({ title: "Product Created", description: "New product has been added." });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ code: "", name: "", category: "", unit: "", price: "", description: "", status: "active" });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      unit: product.unit,
      price: String(product.price),
      description: product.description,
      status: product.status,
    });
    setIsDialogOpen(true);
  };

  const toggleStatus = (id: string) => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, status: p.status === "active" ? "inactive" as const : "active" as const }
        : p
    ));
  };

  const columns = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Product Name", sortable: true },
    { 
      key: "category", 
      label: "Category",
      render: (product: Product) => (
        <StatusBadge 
          status={
            product.category === "Premium" ? "success" 
            : product.category === "Flavored" ? "info" 
            : "neutral"
          } 
          label={product.category} 
        />
      )
    },
    { key: "unit", label: "Unit", className: "hidden lg:table-cell" },
    { 
      key: "price", 
      label: "Price",
      render: (product: Product) => (
        <span className="font-medium text-primary">₨{product.price}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (product: Product) => (
        <StatusBadge 
          status={product.status === "active" ? "success" : "neutral"} 
          label={product.status === "active" ? "Active" : "Inactive"} 
        />
      ),
    },
  ];

  const activeCount = products.filter(p => p.status === "active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Products Catalog</h1>
          <p className="text-muted-foreground">Manage your tea products and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingProduct(null);
                setFormData({ code: "", name: "", category: "", unit: "", price: "", description: "", status: "active" });
              }}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product details below." : "Fill in the product details."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Code</Label>
                  <Input
                    placeholder="TLP-XXX-000"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (₨)</Label>
                  <Input
                    type="number"
                    placeholder="350"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  placeholder="e.g., Premium Green Tea"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief product description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active Status</Label>
                <Switch
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "inactive" })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{products.length}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Eye className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <EyeOff className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{products.length - activeCount}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Leaf className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{new Set(products.map(p => p.category)).size}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search products..."
        actions={(product) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleStatus(product.id)}
              className="text-muted-foreground hover:text-primary"
              title={product.status === "active" ? "Deactivate" : "Activate"}
            >
              {product.status === "active" ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(product)}
              className="text-muted-foreground hover:text-primary"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        )}
        mobileCard={(product) => (
          <div className="mobile-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.code}</p>
              </div>
              <StatusBadge 
                status={product.status === "active" ? "success" : "neutral"} 
                label={product.status === "active" ? "Active" : "Inactive"} 
              />
            </div>
            <div className="flex justify-between items-center">
              <StatusBadge 
                status={product.category === "Premium" ? "success" : product.category === "Flavored" ? "info" : "neutral"} 
                label={product.category} 
              />
              <span className="font-semibold text-primary">₨{product.price}</span>
            </div>
            <div className="text-sm text-muted-foreground">{product.unit}</div>
            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleStatus(product.id)}
              >
                {product.status === "active" ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {product.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(product)}
              >
                <Edit2 className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
