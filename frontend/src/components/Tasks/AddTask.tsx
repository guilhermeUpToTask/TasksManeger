import React from "react";
import { ApiError, CreateTask, TasksService } from "../../client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
    Button,

    useDisclosure,
} from "@chakra-ui/react";
import Modal from "../commons/Modal";

import { AddIcon } from "@chakra-ui/icons";
import TaskForm from "./TaskForm";

interface AddTaskProps{
    category_id:number
}

export default function AddTask({category_id}:AddTaskProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateTask) =>
            TasksService.createTask({ requestBody: data }),
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
        onClose();
    };

    return (
        <>
            <Button
                mt={4}
                leftIcon={<AddIcon />}
                w="full"
                variant="outline"
                onClick={onOpen}
            >
                Add Task
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                modalTitle="Create New Task"
            >
                <TaskForm
                onClose={onClose}
                onSubmit={onAddTask}
                category_id={category_id}
                />
            </Modal>
        </>
    );
}
