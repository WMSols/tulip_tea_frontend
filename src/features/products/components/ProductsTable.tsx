import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeleteConfirmDialog } from "@/components/dashboard/DeleteConfirmDialog";
import { formatPrice } from "../utils/formatters";
import {
  getProductStatusVariant,
  getProductStatusLabel,
} from "../utils/helpers";
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductsTable({
  products,
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const columns = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Product Name", sortable: true },
    { key: "unit", label: "Unit" },
    {
      key: "price",
      label: "Price",
      render: (product: Product) => (
        <span className="font-medium text-primary">
          {formatPrice(product.price)}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (product: Product) => (
        <StatusBadge
          status={getProductStatusVariant(product.is_active)}
          label={getProductStatusLabel(product.is_active)}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      actions={(product) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(product)}
            title="Edit product"
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <DeleteConfirmDialog
            onConfirm={() => onDelete(product)}
            loading={isDeleting}
          />
        </div>
      )}
    />
  );
}
