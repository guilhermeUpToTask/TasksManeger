import React from "react";
import { ApiError, Task, TasksService, UpdateTask } from "../../client";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface TaskActionsProps {
    task: Task;
}

export default function TaskActions({ task }: TaskActionsProps) {
    const queryClient = useQueryClient();

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
        mutationFn: (taskId:number) =>
            TasksService.deleteTask({taskId}),
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
    };
    const onDeleteHandler = () => {
        deleteMutation.mutate(task.id)
    };

    const onConfirmHandler = () => {
        onUpdateCategory({...task, status:'completed'
        })
    };

    return <>
    <button onClick={onDeleteHandler}>Delete Task</button>
    <button onClick={onConfirmHandler}>Confirm Task</button>

    </>;
}
