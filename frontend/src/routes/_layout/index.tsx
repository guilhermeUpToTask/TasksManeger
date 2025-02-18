import React, { useState } from "react";
import {
    Flex,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Stack,
    Text,
    Tag,
    Button,
    CardFooter,
    IconButton,
    CloseButton,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Modal from "../../components/commons/Modal";

export default function MainLayout() {
    const categories = [
        {
            title: "Domestic Duties",
            tasks: [
                {
                    id: 1,
                    title: "Design homepage",
                    description: "Create Figma mockups",
                    status: "High Priority",
                },
                {
                    id: 2,
                    title: "Setup database",
                    description: "Configure PostgreSQL",
                    status: "Medium Priority",
                },
            ],
        },
        {
            title: "Work Tasks",
            tasks: [
                {
                    id: 3,
                    title: "API development",
                    description: "Create REST endpoints",
                    status: "Urgent",
                },
            ],
        },
        {
            title: "Projects Tasks",
            tasks: [
                {
                    id: 4,
                    title: "User auth setup",
                    description: "Implement JWT tokens",
                    status: "Done",
                },
            ],
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "High Priority":
                return "red";
            case "Urgent":
                return "orange";
            case "Medium Priority":
                return "yellow";
            default:
                return "green";
        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
        const [modalType, setModalType] = useState<"edit" | "create">("create");

    return (
        <Flex p={8} gap={6} minH="100vh" bg="gray.100">
            {
                //Categories Cards
                categories.map((category) => (
                    <Card key={category.title} w="350px" h="fit-content" p={3}>
                        <CardHeader p={0} pb={1}>
                            <Flex>
                                <Flex
                                    flex="1"
                                    gap="4"
                                    alignItems="center"
                                    flexWrap="wrap"
                                >
                                    <Heading size="md">
                                        {category.title}
                                    </Heading>
                                </Flex>
                                <CloseButton />
                            </Flex>
                        </CardHeader>

                        <CardBody pt={2} p={0}>
                            <Stack spacing={4}>
                                {
                                    //Tasks Cards
                                    category.tasks.map((task) => (
                                        <Card
                                            key={task.id}
                                            p={3}
                                            variant="outline"
                                        >
                                            <CardHeader p={0} pb={1}>
                                                <Flex>
                                                    <Flex
                                                        flex="1"
                                                        gap="4"
                                                        alignItems="center"
                                                        flexWrap="wrap"
                                                    >
                                                        <Heading size="sm">
                                                            {task.title}
                                                        </Heading>
                                                    </Flex>
                                                    <CloseButton />
                                                </Flex>
                                            </CardHeader>

                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                                mb={2}
                                            >
                                                {task.description}
                                            </Text>
                                            <Tag
                                                size="sm"
                                                colorScheme={getStatusColor(
                                                    task.status
                                                )}
                                                borderRadius="full"
                                            >
                                                {task.status}
                                            </Tag>
                                            <Button
                                                mt={4}
                                                leftIcon={<AddIcon />}
                                                w="full"
                                                variant="outline"
                                                onClick={() => {}}
                                            >
                                                Add Task
                                            </Button>
                                            <CardFooter justifyContent="flex-end">
                                                <Button size="sm">
                                                    Confirm
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))
                                }
                            </Stack>
                        </CardBody>
                    </Card>
                ))
            }

        </Flex>
    );
}
