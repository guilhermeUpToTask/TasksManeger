import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TasksService, Task } from "../../client/";
import { useEffect } from "react";
import React from "react";
import TaskList from "./TaskList";
import AddTask from "./AddTask";


export default function Tasks(){
    const queryClient = useQueryClient()
    const {
        data:tasks,
        isPending
    } = useQuery({
        queryFn:TasksService.readTasks,
        queryKey:["tasks"]
    })

    return(
        <>
            <h1>Tasks</h1>
            <AddTask/>
            {isPending ? (
                <div>Loading...</div>
            ): <TaskList tasks={tasks? tasks: []}/>}
        </>
    )
    


}

