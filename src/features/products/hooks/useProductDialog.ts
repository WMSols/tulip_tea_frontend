import { useState } from "react";
import { productToFormData } from "../utils/helpers";
import { INITIAL_PRODUCT_FORM } from "../utils/constants";
import type { Product, ProductFormData, ProductDialogMode } from "../types";

interface UseProductDialogReturn {
  isOpen: boolean;
  mode: ProductDialogMode;
  editingProduct: Product | null;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  handleOpenCreate: () => void;
  handleOpenEdit: (product: Product) => void;
  handleClose: () => void;
}

/**
 * Hook for managing product form dialog state
 */
export const useProductDialog = (): UseProductDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] =
    useState<ProductFormData>(INITIAL_PRODUCT_FORM);

  const mode: ProductDialogMode = editingProduct ? "edit" : "create";

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(INITIAL_PRODUCT_FORM);
    setIsOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(productToFormData(product));
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingProduct(null);
    setFormData(INITIAL_PRODUCT_FORM);
  };

  return {
    isOpen,
    mode,
    editingProduct,
    formData,
    setFormData,
    handleOpenCreate,
    handleOpenEdit,
    handleClose,
  };
};
