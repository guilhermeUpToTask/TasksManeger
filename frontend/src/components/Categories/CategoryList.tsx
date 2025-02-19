import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoriesService, Category } from "../../client";
import React from "react";
import CategoryActions from "./CategoryActions";
import { Box, Center, Flex, Wrap } from "@chakra-ui/react";
import CategoryCard from "./CategoryCard";

interface CategoryListProps {
    categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
    return (
            <Wrap
                p={8}
                minH="100vh"
                minWidth={"80vw"}
                bg="gray.100"
                spacing={"1rem"}
                justify="center"
            >
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </Wrap>
    );
}
