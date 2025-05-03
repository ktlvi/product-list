import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addProduct } from "../../redux/productSlice";
import { ProductProps } from "../../types";
import ModalTemplate from "../templates/Modal";
import InputField from "../templates/InputField";

interface AddProductModalProps {
    onClose: () => void;
}

interface FormData {
    name: string;
    imageUrl: string;
    count: number;
    width: number;
    height: number;
    weight: string;
}

interface FormErrors {
    name?: string;
    imageUrl?: string;
    count?: string;
    width?: string;
    height?: string;
    weight?: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        imageUrl: "",
        count: 0,
        width: 0,
        height: 0,
        weight: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Prevent scrolling when the modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Disable scrolling
        return () => {
            document.body.style.overflow = ""; // Re-enable scrolling when modal is closed
        };
    }, []);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (formData.count <= 0)
            newErrors.count = "Count must be greater than 0";
        if (formData.width <= 0)
            newErrors.width = "Width must be greater than 0";
        if (formData.height <= 0)
            newErrors.height = "Height must be greater than 0";
        if (!formData.weight) newErrors.weight = "Weight is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === "count" || name === "width" || name === "height"
                    ? value === ""
                        ? ""
                        : parseInt(value, 10)
                    : value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (validate()) {
            const newProduct: Omit<ProductProps, "id" | "comments"> = {
                name: formData.name,
                imageUrl:
                    formData.imageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/0/0e/DefaultImage.png",
                count: formData.count,
                size: {
                    width: formData.width,
                    height: formData.height,
                },
                weight: formData.weight,
            };

            dispatch(addProduct(newProduct));
            onClose();
        }
    };

    return (
        <ModalTemplate
            title="Add New Product"
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText="Add Product"
        >
            <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
            />
            <InputField
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                error={errors.imageUrl}
            />
            <InputField
                label="Count"
                name="count"
                type="number"
                value={formData.count}
                onChange={handleChange}
                error={errors.count}
            />
            <InputField
                label="Width"
                name="width"
                type="number"
                value={formData.width}
                onChange={handleChange}
                error={errors.width}
            />
            <InputField
                label="Height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                error={errors.height}
            />
            <InputField
                label="Weight (e.g. '200g')"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                error={errors.weight}
            />
        </ModalTemplate>
    );
};

export default AddProductModal;
