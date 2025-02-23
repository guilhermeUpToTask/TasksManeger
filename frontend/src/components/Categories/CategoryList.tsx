
import {  Category } from "../../client";
import { Wrap } from "@chakra-ui/react";
import CategoryCard from "./CategoryCard";
import React from "react";

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
