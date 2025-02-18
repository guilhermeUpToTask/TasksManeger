import React from "react";
import { Category } from "../../client";
import { AddIcon } from "@chakra-ui/icons";
import {
    Card,
    CardHeader,
    Flex,
    Heading,
    CloseButton,
    CardBody,
    Stack,
    Tag,
    Button,
    CardFooter,
} from "@chakra-ui/react";
import CategoryActions from "./CategoryActions";
import Tasks from "../Tasks";

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Card key={category.id} w="350px" h="fit-content" p={3}>
            <CardHeader p={0} pb={1}>
            <Flex justify="space-between" align="center">
                <Heading size="md">
                  {category.name}
                </Heading>
                <CategoryActions category={category}/>
              </Flex>
            </CardHeader>

            <CardBody pt={2} p={0}>
                <Tasks category_id={category.id}/>
            </CardBody>
        </Card>
    );
}
