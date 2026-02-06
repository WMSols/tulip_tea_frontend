import ProductsHeader from "@/features/products/components/ProductsHeader";
import ProductsStats from "@/features/products/components/ProductsStats";
import ProductsTable from "@/features/products/components/ProductsTable";
import ProductFormDialog from "@/features/products/components/ProductFormDialog";
import { useProductsData } from "@/features/products/hooks/useProductsData";
import { useProductActions } from "@/features/products/hooks/useProductActions";
import { useProductDialog } from "@/features/products/hooks/useProductDialog";

export default function Products() {
  // Fetch data
  const { products, stats, isLoading } = useProductsData();

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

      {/* Stats */}
      <ProductsStats stats={stats} />

      {/* Table */}
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
