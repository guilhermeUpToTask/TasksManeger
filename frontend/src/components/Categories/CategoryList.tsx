import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoriesService, Category } from "../../client";
import React from "react";
import CategoryActions from "./CategoryActions";
import { Flex } from "@chakra-ui/react";
import CategoryCard from "./CategoryCard";

interface CategoryListProps {
    categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
    return <Flex p={8} gap={6} minH="100vh" bg="gray.100">
        {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
        ))}
    </Flex>;
}
