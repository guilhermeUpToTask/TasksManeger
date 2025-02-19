import React from "react";
import { CreateTask, UpdateTask } from "../../client";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";

const statuses = ["Completed", "Pending"];

interface TaskFormProps {
    onClose: () => void;
    onSubmit: ((data: CreateTask) => void) | ((data: UpdateTask) => void);
    task?: UpdateTask;
    category_id: number;
}

export default function TaskForm({
    onClose,
    onSubmit,
    task,
    category_id,
}: TaskFormProps) {
    const { register, handleSubmit } = useForm<CreateTask>({
        defaultValues: {
            name: task?.name || "",
            description: task?.description || "",
            status: task?.status || "Pending",
            category_id: category_id,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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

                <FormControl display={"none"}>
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
                <Flex>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" colorScheme="blue">
                        Submit
                    </Button>
                </Flex>
            </VStack>
        </form>
    );
}
