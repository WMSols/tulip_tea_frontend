import { useToast } from "@/hooks/use-toast";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/Redux/Api/productsApi";
import { validateProductForm } from "../utils/helpers";
import type { Product, ProductFormData } from "../types";

interface UseProductActionsReturn {
  handleCreateProduct: (formData: ProductFormData) => Promise<boolean>;
  handleUpdateProduct: (
    productId: number,
    formData: ProductFormData,
  ) => Promise<boolean>;
  handleDeleteProduct: (productId: number) => Promise<boolean>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

/**
 * Hook for product CRUD operations
 */
export const useProductActions = (): UseProductActionsReturn => {
  const { toast } = useToast();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleCreateProduct = async (
    formData: ProductFormData,
  ): Promise<boolean> => {
    const validation = validateProductForm(formData);

    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: validation.error,
      });
      return false;
    }

    try {
      await createProduct({
        code: formData.code,
        name: formData.name,
        unit: formData.unit,
        price: Number(formData.price),
      }).unwrap();

      toast({ title: "Product created successfully" });
      return true;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.detail || "Something went wrong",
      });
      return false;
    }
  };

  const handleUpdateProduct = async (
    productId: number,
    formData: ProductFormData,
  ): Promise<boolean> => {
    const validation = validateProductForm(formData);

    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: validation.error,
      });
      return false;
    }

    try {
      await updateProduct({
        product_id: productId,
        code: formData.code,
        name: formData.name,
        unit: formData.unit,
        price: Number(formData.price),
        is_active: formData.is_active,
      }).unwrap();

      toast({ title: "Product updated successfully" });
      return true;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.detail || "Something went wrong",
      });
      return false;
    }
  };

  const handleDeleteProduct = async (productId: number): Promise<boolean> => {
    try {
      await deleteProduct(productId).unwrap();
      toast({ title: "Product deleted successfully" });
      return true;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err?.data?.detail || "Unable to delete product",
      });
      return false;
    }
  };

  return {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
