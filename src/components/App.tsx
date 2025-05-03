import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import ProductList from "./ProductList/ProductList";
import ProductDetails from "./ProductDetails/ProductDetails";

const App = () => {
    return (
        <div>
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
