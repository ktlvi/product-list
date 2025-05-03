import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { api } from "../api/api";
import { ProductProps, CommentProps } from "../types";
import { createSelector } from "reselect";

// Define the state type
interface ProductsState {
    products: ProductProps[];
    currentProduct: ProductProps | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    sortBy: "name" | "count";
}

// Initial state
const initialState: ProductsState = {
    products: [],
    currentProduct: null,
    status: "idle",
    error: null,
    sortBy: "name",
};

// Async thunks
export const fetchProducts = createAsyncThunk<ProductProps[]>(
    "products/fetchProducts",
    async () => {
        return await api.getProducts();
    }
);

export const fetchProductById = createAsyncThunk<ProductProps, string>(
    "products/fetchProductById",
    async (id) => {
        return await api.getProduct(id);
    }
);

export const addProduct = createAsyncThunk<
    ProductProps,
    Omit<ProductProps, "id" | "comments">
>("products/addProduct", async (product) => {
    const newProduct: ProductProps = {
        ...product,
        id: uuidv4(),
        comments: [],
    };
    return await api.createProduct(newProduct);
});

export const updateProduct = createAsyncThunk<
    ProductProps,
    { id: string; product: ProductProps }
>("products/updateProduct", async ({ id, product }) => {
    return await api.updateProduct(id, product);
});

export const deleteProduct = createAsyncThunk<string, string>(
    "products/deleteProduct",
    async (id) => {
        await api.deleteProduct(id);
        return id;
    }
);

export const addComment = createAsyncThunk<
    ProductProps,
    { productId: string; comment: string }
>("products/addComment", async ({ productId, comment }) => {
    const newComment: CommentProps = {
        id: uuidv4(),
        productId: parseInt(productId, 10),
        description: comment,
        date: new Date()
            .toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            .replace(",", ""),
    };

    return await api.addComment(productId, newComment);
});

export const deleteComment = createAsyncThunk<
    ProductProps,
    { productId: string; commentId: string }
>("products/deleteComment", async ({ productId, commentId }) => {
    // Call the API to delete the comment
    await api.deleteComment(productId, commentId);

    // Fetch the updated product from the backend
    const updatedProduct = await api.getProduct(productId);

    // Return the updated product
    return updatedProduct;
});

// Slice
const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSortBy: (state, action: PayloadAction<"name" | "count">) => {
            state.sortBy = action.payload;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                fetchProducts.fulfilled,
                (state, action: PayloadAction<ProductProps[]>) => {
                    state.status = "succeeded";
                    state.products = action.payload;
                }
            )
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })

            // Fetch single product
            .addCase(fetchProductById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                fetchProductById.fulfilled,
                (state, action: PayloadAction<ProductProps>) => {
                    state.status = "succeeded";
                    state.currentProduct = action.payload;
                }
            )
            .addCase(fetchProductById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })

            // Add product
            .addCase(
                addProduct.fulfilled,
                (state, action: PayloadAction<ProductProps>) => {
                    state.products.push(action.payload);
                }
            )

            // Update product
            .addCase(
                updateProduct.fulfilled,
                (state, action: PayloadAction<ProductProps>) => {
                    const index = state.products.findIndex(
                        (product) => product.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.products[index] = action.payload;
                    }
                    state.currentProduct = action.payload;
                }
            )

            // Delete product
            .addCase(
                deleteProduct.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.products = state.products.filter(
                        (product) => product.id !== action.payload
                    );
                }
            )

            // Add comment
            .addCase(
                addComment.fulfilled,
                (state, action: PayloadAction<ProductProps>) => {
                    const index = state.products.findIndex(
                        (product) => product.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.products[index] = action.payload;
                    }
                    state.currentProduct = action.payload;
                }
            )

            // Delete comment
            .addCase(
                deleteComment.fulfilled,
                (state, action: PayloadAction<ProductProps>) => {
                    const updatedProduct = action.payload;
                    const index = state.products.findIndex(
                        (product) => product.id === updatedProduct.id
                    );

                    if (index !== -1) {
                        // Update the specific product in the products array
                        state.products[index] = updatedProduct;
                    }

                    // Update the current product if it matches the updated product
                    if (state.currentProduct?.id === updatedProduct.id) {
                        state.currentProduct = updatedProduct;
                    }
                }
            );
    },
});

// Selectors
// Base selector to get the products state
const selectProductsState = (state: { products: ProductsState }) =>
    state.products;

// Memoized selector for all products
export const selectAllProducts = createSelector(
    [selectProductsState],
    (productsState) => {
        const products = [...productsState.products];

        // Sort by name alphabetically first
        products.sort((a, b) => a.name.localeCompare(b.name));

        // If sortBy is count, then sort by count
        if (productsState.sortBy === "count") {
            products.sort((a, b) => b.count - a.count);
        }

        return products;
    }
);

export const selectProductById = (
    state: { products: ProductsState },
    productId: string
): ProductProps | undefined =>
    state.products.products.find((product) => product.id === productId);

export const selectCurrentProduct = (state: {
    products: ProductsState;
}): ProductProps | null => state.products.currentProduct;

export const selectProductsStatus = (state: {
    products: ProductsState;
}): "idle" | "loading" | "succeeded" | "failed" => state.products.status;

export const selectProductsError = (state: {
    products: ProductsState;
}): string | null => state.products.error;

export const selectSortBy = (state: {
    products: ProductsState;
}): "name" | "count" => state.products.sortBy;

// Actions
export const { setSortBy, clearCurrentProduct } = productsSlice.actions;

// Reducer
export default productsSlice.reducer;
