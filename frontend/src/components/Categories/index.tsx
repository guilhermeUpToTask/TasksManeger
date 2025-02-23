import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "../../client";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";
import { Flex, Heading } from "@chakra-ui/react";
import React from "react";

export default function Categories() {
    const { data: categories } = useQuery({
        queryFn: CategoriesService.readCategories,
        queryKey: ["categories"],
    });

    return (
       <>
            <Flex justify={'start'} gap={2} pb={4}>
                <Heading as={'h2'} size={'lg'}>Task Categories</Heading>
                <AddCategory />
            </Flex>
            <CategoryList categories={categories ? categories : []} />
        </>
    );
}
