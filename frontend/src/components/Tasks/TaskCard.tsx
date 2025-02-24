import React from "react";
import { Task } from "../../client";
import TaskActions from "./TaskActions";
import { Card, Flex, Tag, Text, Box } from "@chakra-ui/react";
interface TaskCardProps {
    task: Task;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "Pending":
            return "yellow";
        default:
            return "green";
    }
};

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <Card key={task.id} p={4} variant="outline">
            <Flex justify="space-between">
                <Box>
                    <Text fontWeight="bold" data-testid="task-name">{task.name}</Text>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                        {task.description}
                    </Text>
                    <Tag
                        size="sm"
                        colorScheme={getStatusColor(task.status)}
                        borderRadius="full"
                        data-testid="task-status"
                     >
                        {task.status}
                    </Tag>
                </Box>
                <TaskActions task={task} />
            </Flex>
        </Card>
    );
}
