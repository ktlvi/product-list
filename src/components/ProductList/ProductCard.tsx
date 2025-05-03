import React from "react";
import { Link } from "react-router-dom";
import { ProductProps } from "../../types";

interface ProductCardProps {
    product: ProductProps;
    onDeleteClick: (product: ProductProps) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onDeleteClick,
}) => {
    return (
        <div className="product-card">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
            />
            <div className="product-card-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-count">In stock: {product.count}</p>
                <div className="product-card-actions">
                    <Link
                        to={`/products/${product.id}`}
                        className="btn btn-primary"
                    >
                        View Details
                    </Link>
                    <button
                        className="btn btn-danger"
                        onClick={() => onDeleteClick(product)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
