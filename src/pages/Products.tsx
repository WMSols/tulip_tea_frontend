import { useState } from "react";
import ProductsHeader from "@/features/products/components/ProductsHeader";
import ProductsStats from "@/features/products/components/ProductsStats";
import ProductsTable from "@/features/products/components/ProductsTable";
import ProductFormDialog from "@/features/products/components/ProductFormDialog";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useProductsData,
  type ProductViewFilter,
} from "@/features/products/hooks/useProductsData";
import { useProductActions } from "@/features/products/hooks/useProductActions";
import { useProductDialog } from "@/features/products/hooks/useProductDialog";

export default function Products() {
  const [view, setView] = useState<ProductViewFilter>("all");

  // Fetch data (include_inactive and filtered list by view)
  const { products, stats, isLoading } = useProductsData({ view });

  // Actions
  const {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProductActions();

  // Dialog state
  const {
    isOpen,
    mode,
    editingProduct,
    formData,
    setFormData,
    handleOpenCreate,
    handleOpenEdit,
    handleClose,
  } = useProductDialog();

  // Handlers
  const onSubmit = async () => {
    let success = false;

    if (mode === "edit" && editingProduct) {
      success = await handleUpdateProduct(editingProduct.id, formData);
    } else {
      success = await handleCreateProduct(formData);
    }

    if (success) {
      handleClose();
    }
  };

  const onDelete = async (product: any) => {
    await handleDeleteProduct(product.id);
  };

  if (isLoading) {
    return (
      <PageSkeleton
        statCards={3}
        statColumns={3}
        tableColumns={5}
        tableRows={6}
        showHeader
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Create button */}
      <div className="flex justify-between items-center">
        <ProductsHeader />
        <ProductFormDialog
          isOpen={isOpen}
          mode={mode}
          formData={formData}
          isSubmitting={isCreating || isUpdating}
          onOpenChange={(open) => (open ? handleOpenCreate() : handleClose())}
          onFormChange={setFormData}
          onSubmit={onSubmit}
        />
      </div>

      {/* Active / Inactive toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as ProductViewFilter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats (reflect current view) */}
      <ProductsStats stats={stats} />

      {/* Table (filtered by view; status badge from product.is_active) */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onEdit={handleOpenEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
