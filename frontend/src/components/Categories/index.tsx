import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../../client";
import React from "react";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";
import { Container, Flex, Heading } from "@chakra-ui/react";

export default function Categories() {
    const queryClient = useQueryClient();
    const { data: categories, isPending } = useQuery({
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
