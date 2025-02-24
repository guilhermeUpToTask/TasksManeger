import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
    ApiError,
    CategoriesService,
    Category,
    UpdateCategory,
} from "../../client";
import {
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Modal from "../commons/Modal";
import CategoryForm from "./CategoryForm";

interface CategoryActionsProps {
    category: Category;
}

export default function CategoryActions({ category }: CategoryActionsProps) {
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: (data: UpdateCategory) =>
            CategoriesService.updateCategory({
                requestBody: data,
                categoryId: category.id,
            }),
        onSuccess: () => {
            console.log("sucesefully updated category");
        },
        onError: (error: ApiError) => {
            console.log("Error while updating category:", error.body);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: (categoryId: number) =>
            CategoriesService.deleteCategory({ categoryId }),
        onSuccess: () => {
            console.log("sucesefully deleted category");
        },
        onError: (error: ApiError) => {
            console.log("Error while deleting category:", error.body);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const onUpdateCategory = (data: UpdateCategory) => {
        updateMutation.mutate(data);
        onClose();
    };
    const onDeleteCategory = () => {
        deleteMutation.mutate(category.id);
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                modalTitle="Update Category"
            >
                <CategoryForm
                    onClose={onClose}
                    onSubmit={onUpdateCategory}
                    category={category}
                />
            </Modal>

            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<ChevronDownIcon />}
                    variant="ghost"
                />
                <MenuList>
                    <MenuItem icon={<EditIcon />} onClick={onOpen}>
                        Edit
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={onDeleteCategory}>
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
}
