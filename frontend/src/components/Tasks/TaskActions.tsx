import React from "react";
import { ApiError, Task, TasksService, UpdateTask } from "../../client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { CheckIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Modal from "../commons/Modal";
import TaskForm from "./TaskForm";

interface TaskActionsProps {
    task: Task;
}

export default function TaskActions({ task }: TaskActionsProps) {
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const updateMutation = useMutation({
        mutationFn: (data: UpdateTask) =>
            TasksService.updateTask({ requestBody: data, taskId: task.id }),
        onSuccess: () => {
            console.log("task edited succeffuly");
        },
        onError: (err: ApiError) => {
            console.log("error", err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (taskId: number) => TasksService.deleteTask({ taskId }),
        onSuccess: () => {
            console.log("task deleted succeffuly");
        },
        onError: (err: ApiError) => {
            console.log("error", err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const onUpdateCategory = (data: UpdateTask) => {
        updateMutation.mutate(data);
        onClose();
    };
    const onDeleteHandler = (taskId: number) => {
        deleteMutation.mutate(task.id);
    };

    const onConfirmHandler = (task: Task) => {
        onUpdateCategory({ ...task, status: "Completed" });
    };

    return (
        <Flex direction="column" gap={2}>
            <Modal
                modalTitle="Edit Task"
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
            >
                <TaskForm
                    task={task}
                    onClose={onClose}
                    category_id={task.category_id}
                    onSubmit={onUpdateCategory}
                />
            </Modal>
            <IconButton
                icon={<CheckIcon />}
                aria-label="Complete Task"
                colorScheme="green"
                size="sm"
                onClick={() => onConfirmHandler(task)}
            />
            <IconButton
                icon={<EditIcon />}
                aria-label="Edit Task"
                size="sm"
                onClick={onOpen}
            />
            <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete Task"
                colorScheme="red"
                size="sm"
                onClick={() => onDeleteHandler(task.id)}
            />
        </Flex>
    );
}
