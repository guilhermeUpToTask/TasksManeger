import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoriesService, Category } from "../../client";
import React from "react";
import CategoryActions from "./CategoryActions";

interface CategoryListProps {
    categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
    return (
        <ul>
            <h2>Categories</h2>
            {categories.map((category) => (
                <ul key={category.id}>
                    <li>{category.name} - Category</li>
                    <li>{category.description}</li>
                    <li><CategoryActions category={category}/></li>
                </ul>
            ))}
        </ul>
    );
}
