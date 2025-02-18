import React from "react";
import { Task } from "../../client";
import TaskActions from "./TaskActions";
import { AddIcon } from "@chakra-ui/icons";
import {
    Card,
    CardHeader,
    Flex,
    Heading,
    CloseButton,
    Tag,
    Button,
    CardFooter,
    Text,
} from "@chakra-ui/react";
interface TaskCardProps {
    task: Task;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "pedent":
            return "yellow";
        default:
            return "green";
    }
};

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <Card key={task.id} p={3} variant="outline">
            <CardHeader p={0} pb={1}>
                <Flex>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Heading size="sm">{task.name}</Heading>
                    </Flex>
                    <CloseButton />
                </Flex>
            </CardHeader>

            <Text fontSize="sm" color="gray.600" mb={2}>
                {task.description}
            </Text>
            <Tag
                size="sm"
                colorScheme={getStatusColor(task.status)}
                borderRadius="full"
            >
                {task.status}
            </Tag>
            <CardFooter justifyContent="flex-end">
                <Button size="sm">Confirm</Button>
            </CardFooter>
        </Card>
    );
}
