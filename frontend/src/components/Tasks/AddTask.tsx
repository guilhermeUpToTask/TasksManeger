import React from "react";
import {
    ApiError,
    CreateTask,
    TasksService,
} from "../../client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const statuses = ["Completed", "Pending"];

export default function AddTask() {
    
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateTask) =>
            TasksService.createTask({ requestBody: data}),
        onSuccess: () => {
            console.log("task created succeffuly");
        },
        onError: (err: ApiError) => {
            console.log("error", err.body);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const onAddTask = (data: CreateTask) => {
        mutation.mutate(data);
    };

    const { register, handleSubmit } = useForm<CreateTask>();


    return (
        <>
            <h1>Add Task</h1>
            <form onSubmit={handleSubmit(onAddTask)}>
                <VStack spacing={4} p={4} borderWidth={1} borderRadius="lg">
                    <FormControl>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input id="name" {...register("name")} required />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Input
                            id="description"
                            {...register("description")}
                            required
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="category_id">Category ID</FormLabel>
                        <Input
                            id="category_id"
                            type="number"
                            {...register("category_id")}
                            required
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="status">Status</FormLabel>
                        <Select id="status" {...register("status")} required>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <Button type="submit" colorScheme="blue">
                        Submit
                    </Button>
                </VStack>
            </form>
        </>
    );
}
