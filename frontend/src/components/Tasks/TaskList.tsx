import React from "react";
import { Task } from "../../client";
import {
    Stack,
} from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
interface TaskListProps {
    tasks: Task[];
    category_id:number
}

export default function TaskList({ tasks, category_id }: TaskListProps) {
    return (
        <Stack spacing={4}>
            {tasks.map((task) => (
                <TaskCard task={task} key={task.id}/>
            ))}
            <AddTask category_id={category_id}/>
        </Stack>
    );
}
