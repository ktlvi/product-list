import { ProductProps } from "../types";

/**
 * Format date to display in comments
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date: string) => {
    return new Date(date)
        .toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        .replace(",", "");
};

/**
 * Generate a local storage key for storing products
 * @returns {string} - Local storage key
 */
export const PRODUCTS_STORAGE_KEY = "shop-app-products";

/**
 * Initialize local storage with default products if empty
 * @param {Array} defaultProducts - Default products to use
 */
export const initializeLocalStorage = (defaultProducts: ProductProps[]) => {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (!storedProducts) {
        localStorage.setItem(
            PRODUCTS_STORAGE_KEY,
            JSON.stringify(defaultProducts)
        );
    }
};

/**
 * Get products from local storage
 * @returns {Array} - Products from local storage
 */
export const getProductsFromStorage = () => {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
};

/**
 * Save products to local storage
 * @param {Array} products - Products to save
 */
export const saveProductsToStorage = (products: ProductProps[]) => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};
