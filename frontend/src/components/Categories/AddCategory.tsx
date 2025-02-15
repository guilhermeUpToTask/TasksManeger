import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, CategoriesService, CreateCategory } from "../../client";
import React from "react";
import { Button, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function AddCategory(){
    const queryClient = useQueryClient()
    const createMutation = useMutation({
        mutationFn: (data: CreateCategory) =>
           CategoriesService.createCategory({requestBody:data}),
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

    const onSubmit = (data: CreateCategory) => {
      createMutation.mutate(data)
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} p={4} borderWidth={1} borderRadius="lg">
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input id="name" {...register("name")} required />
          </FormControl>
  
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea id="description" {...register("description")} required />
          </FormControl>
  
          <Button type="submit" colorScheme="blue">Submit</Button>
        </VStack>
      </form>
    )

}
