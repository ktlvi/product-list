import axios from "axios";
import { CommentProps, ProductProps } from "../types";

const API_URL = "http://localhost:3001";

export const api = {
    // Product operations
    async getProducts() {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    },

    async getProduct(id: string) {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    },

    async createProduct(product: ProductProps) {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    },

    async updateProduct(id: string, product: ProductProps) {
        const response = await axios.put(`${API_URL}/products/${id}`, product);
        return response.data;
    },

    async deleteProduct(id: string) {
        await axios.delete(`${API_URL}/products/${id}`);
        return id;
    },

    // Comment operations
    async addComment(productId: string, comment: CommentProps) {
        const product = await this.getProduct(productId);
        const updatedComments = [...product.comments, comment];
        const updatedProduct = { ...product, comments: updatedComments };

        const response = await axios.put(
            `${API_URL}/products/${productId}`,
            updatedProduct
        );
        return response.data;
    },

    async deleteComment(productId: string, commentId: string) {
        const product = await this.getProduct(productId);
        const updatedComments = product.comments.filter(
            (comment: CommentProps) => comment.id != commentId
        );
        const updatedProduct = { ...product, comments: updatedComments };

        const response = await axios.put(
            `${API_URL}/products/${productId}`,
            updatedProduct
        );
        return response.data;
    },
};
