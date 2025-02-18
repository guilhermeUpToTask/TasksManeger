import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ApiError,
    CategoriesService,
    Category,
    CreateCategory,
    UpdateCategory,
} from "../../client";
import React from "react";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface CategoryFormProps {
    onClose: () => void;
    onSubmit:
        | ((data: CreateCategory) => void)
        | ((data: UpdateCategory) => void);
    category?: Category;
}

export default function CategoryForm({ onClose, onSubmit, category }: CategoryFormProps) {
    const { register, handleSubmit } = useForm<CreateCategory>({
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
        },
    });


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} p={4} borderWidth={1} borderRadius="lg">
                <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input id="name" {...register("name")} required/>
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                        id="description"
                        {...register("description")}
                        required
                    />
                </FormControl>

                <Flex>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" colorScheme="blue">
                        Submit
                    </Button>
                </Flex>
            </VStack>
        </form>
    );
}
