import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    selectAllProducts,
    selectProductsStatus,
    selectProductsError,
    deleteProduct,
} from "../../redux/productSlice";
import { AppDispatch } from "../../redux/store";
import ProductCard from "./ProductCard";
import SortDropdown from "./SortDropdown";
import AddProductModal from "./AddProductModal";
import ConfirmationModal from "../templates/ConfirmationModal";
import { ProductProps } from "../../types";

const ProductList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector(selectAllProducts);
    const status = useSelector(selectProductsStatus);
    const error = useSelector(selectProductsError);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductProps | null>(
        null
    );

    useEffect(() => {
        // Fetch products when the component mounts
        if (status === "idle") {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleDeleteClick = (product: ProductProps) => {
        setProductToDelete(product);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            dispatch(deleteProduct(productToDelete.id));
            setProductToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setProductToDelete(null);
    };

    if (status === "loading") {
        return <div className="loading">Loading products...</div>;
    }

    if (status === "failed") {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="product-list">
            <div className="product-list-header">
                <h2>Products</h2>
                <div className="product-list-actions">
                    <SortDropdown />
                    <button
                        className="btn btn-primary"
                        onClick={handleAddClick}
                    >
                        Add Product
                    </button>
                </div>
            </div>

            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onDeleteClick={() => handleDeleteClick(product)}
                    />
                ))}
            </div>

            {isAddModalOpen && (
                <AddProductModal onClose={handleCloseAddModal} />
            )}

            {productToDelete && (
                <ConfirmationModal
                    title="Delete Product"
                    message={`Are you sure you want to delete the product "${productToDelete.name}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}
        </div>
    );
};

export default ProductList;
