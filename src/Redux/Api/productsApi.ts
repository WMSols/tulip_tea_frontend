import { baseApi } from "@/Redux/Api/baseApi";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/product";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      Product[],
      { include_inactive?: boolean } | void
    >({
      query: (arg) => ({
        url: "/products/",
        params:
          arg && typeof arg.include_inactive === "boolean"
            ? { include_inactive: arg.include_inactive }
            : undefined,
      }),
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (body) => ({
        url: "/products/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: ({ product_id, ...body }) => ({
        url: `/products/${product_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (product_id) => ({
        url: `/products/${product_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
