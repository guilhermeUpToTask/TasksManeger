import React from "react";
import { Task } from "../../client";
import TaskActions from "./TaskActions";
interface TaskListProps {
    tasks: Task[];
}

export default function TaskList(props: TaskListProps) {
    return (
        <table>
            <tbody>
                {props.tasks.map((task) => (
                    <tr key={task.id}>
                        <td>task - {task.name}</td>
                        <td> description: {task.description}</td>
                        <td> status: {task.status}</td>
                        <td>
                            <TaskActions task={task} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
