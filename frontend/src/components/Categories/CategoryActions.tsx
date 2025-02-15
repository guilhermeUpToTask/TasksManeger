import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
    ApiError,
    CategoriesService,
    Category,
    UpdateCategory,
} from "../../client";

interface CategoriesServiceProps {
    category: Category;
}

export default function CategoryActions({ category }: CategoriesServiceProps) {
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

    const onUpdateCategory = (data:Category) =>{
        updateMutation.mutate(data)
    }
    const onDeleteCategory = () =>{
        deleteMutation.mutate(category.id)
    }

    return(
        <>
        <button>Edit Category</button>
        <button onClick={onDeleteCategory}>Delete Category</button>
        </>
    )

}
