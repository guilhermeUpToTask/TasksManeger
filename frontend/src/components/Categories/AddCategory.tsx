import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, CategoriesService, CreateCategory } from "../../client";
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
import Modal from "../commons/Modal";
import CategoryForm from "./CategoryForm";
import { AddIcon } from "@chakra-ui/icons";

export default function AddCategory() {
    const queryClient = useQueryClient();
    const createMutation = useMutation({
        mutationFn: (data: CreateCategory) =>
            CategoriesService.createCategory({ requestBody: data }),
        onSuccess: () => {
            console.log("sucesefully created category");
        },
        onError: (error: ApiError) => {
            console.log("Error while creating category:", error.body);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
    const { register, handleSubmit } = useForm<CreateCategory>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const onSubmit = (data: CreateCategory) => {
        createMutation.mutate(data);
        onClose();
    };

    return (
        <>
            <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
                Add Category
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                modalTitle="Create New Category"
            >
                <CategoryForm onClose={onClose} onSubmit={onSubmit} />
            </Modal>
        </>
    );
}
