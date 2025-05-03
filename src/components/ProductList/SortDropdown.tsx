import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSortBy, selectSortBy } from "../../redux/productSlice";
import { AppDispatch } from "../../redux/store";

const SortDropdown: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentSortBy = useSelector(selectSortBy);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        dispatch(setSortBy(e.target.value as "name" | "count"));
    };

    return (
        <select
            className="sort-dropdown"
            value={currentSortBy}
            onChange={handleChange}
        >
            <option value="name">Sort by Name</option>
            <option value="count">Sort by Count</option>
        </select>
    );
};

export default SortDropdown;
