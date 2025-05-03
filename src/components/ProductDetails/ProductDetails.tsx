import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProductById,
    selectCurrentProduct,
    selectProductsStatus,
    selectProductsError,
    clearCurrentProduct,
} from "../../redux/productSlice";
import { AppDispatch } from "../../redux/store";
import CommentList from "./CommentList";
import AddCommentForm from "./AddCommentForm";
import EditProductModal from "./EditProductModal";

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const product = useSelector(selectCurrentProduct);
    const status = useSelector(selectProductsStatus);
    const error = useSelector(selectProductsError);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }

        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, id]);

    const handleBackClick = () => {
        navigate("/");
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    if (status === "loading") {
        return <div className="loading">Loading product details...</div>;
    }

    if (status === "failed") {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!product) {
        return <div className="error-message">Product not found</div>;
    }

    return (
        <div>
            <button
                className="btn btn-secondary back-button"
                onClick={handleBackClick}
            >
                Back to Products
            </button>

            <div className="product-details">
                <div className="product-header">
                    <h2>{product.name}</h2>
                    <button
                        className="btn btn-primary"
                        onClick={handleEditClick}
                    >
                        Edit Product
                    </button>
                </div>

                <div className="product-info">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-details-image"
                    />
                    <div className="product-meta">
                        <p>
                            <strong>Count:</strong> {product.count}
                        </p>
                        <p>
                            <strong>Size:</strong> {product.size.width} x{" "}
                            {product.size.height}
                        </p>
                        <p>
                            <strong>Weight:</strong> {product.weight}
                        </p>
                    </div>
                </div>

                <div className="comments-section">
                    <h3>Comments</h3>
                    <CommentList
                        comments={product.comments || []}
                        productId={product.id}
                    />
                    <AddCommentForm productId={product.id} />
                </div>
            </div>

            {isEditModalOpen && (
                <EditProductModal
                    product={product}
                    onClose={handleCloseEditModal}
                />
            )}
        </div>
    );
};

export default ProductDetails;
