import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TasksService, Task } from "../../client/";
import React from "react";
import TaskList from "./TaskList";

interface TasksProps {
    category_id: number;
}

export default function Tasks({ category_id }: TasksProps) {
    const queryClient = useQueryClient();
    const { data: tasks, isPending } = useQuery({
        queryFn: TasksService.readTasks,
        queryKey: ["tasks"],
    });

    const getfilteredTasks = (tasks: Task[], category_id: number) => {
        return tasks.filter((task: Task) => task.category_id === category_id);
    };
    return (
        <>
            {isPending ? (
                <div>Loading...</div>
            ) : (
                <TaskList
                    tasks={tasks ? getfilteredTasks(tasks, category_id) : []}
                    category_id={category_id}
                />
            )}
        </>
    );
}
