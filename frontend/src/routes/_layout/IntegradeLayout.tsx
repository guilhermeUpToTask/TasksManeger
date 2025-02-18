import { 
    Flex, Card, CardHeader, CardBody, Heading, Stack, 
    Text, Tag, IconButton, Button, useDisclosure, 
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter, Input,
    Menu, MenuButton, MenuList, MenuItem, Box
  } from "@chakra-ui/react";
  import { AddIcon, DeleteIcon, EditIcon, CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
  import { FaTasks } from "react-icons/fa";
  import { useState } from "react";
import React from "react";
  
  type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
  };
  
  type Category = {
    id: number;
    title: string;
    tasks: Task[];
  };
  
  const IntegradeLayout = () => {
    const [categories, setCategories] = useState<Category[]>([
      {
        id: 1,
        title: "To Do",
        tasks: [
          { id: 1, title: "Design homepage", description: "Create Figma mockups", status: "High Priority" },
          { id: 2, title: "Setup database", description: "Configure PostgreSQL", status: "Medium Priority" },
        ],
      },
      {
        id: 2,
        title: "In Progress",
        tasks: [
          { id: 3, title: "API development", description: "Create REST endpoints", status: "Urgent" },
        ],
      },
      {
        id: 3,
        title: "Completed",
        tasks: [
          { id: 4, title: "User auth setup", description: "Implement JWT tokens", status: "Done" },
        ],
      },
    ]);
  
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newTask, setNewTask] = useState({ title: "", description: "", status: "" });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalType, setModalType] = useState<"category" | "task" | "edit">("category");
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case "High Priority": return "red";
        case "Urgent": return "orange";
        case "Medium Priority": return "yellow";
        case "Done": return "green";
        default: return "blue";
      }
    };
  
    const handleAddCategory = () => {
      if (newCategoryName.trim()) {
        const newCategory = {
          id: categories.length + 1,
          title: newCategoryName,
          tasks: []
        };
        setCategories([...categories, newCategory]);
        setNewCategoryName("");
        onClose();
      }
    };
  
    const handleAddTask = (categoryId: number) => {
      if (newTask.title.trim()) {
        const updatedCategories = categories.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              tasks: [...cat.tasks, {
                ...newTask,
                id: cat.tasks.length + 1,
                status: newTask.status || "Medium Priority"
              }]
            };
          }
          return cat;
        });
        setCategories(updatedCategories);
        setNewTask({ title: "", description: "", status: "" });
        onClose();
      }
    };
  
    const handleDelete = (categoryId: number, taskId?: number) => {
      if (taskId) {
        const updatedCategories = categories.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              tasks: cat.tasks.filter(task => task.id !== taskId)
            };
          }
          return cat;
        });
        setCategories(updatedCategories);
      } else {
        setCategories(categories.filter(cat => cat.id !== categoryId));
      }
    };
  
    const handleStatusChange = (categoryId: number, taskId: number) => {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            tasks: cat.tasks.map(task => 
              task.id === taskId ? { ...task, status: "Done" } : task
            )
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    };
  
    const handleEditTask = () => {
      if (selectedTask) {
        const updatedCategories = categories.map(cat => ({
          ...cat,
          tasks: cat.tasks.map(task => 
            task.id === selectedTask.id ? selectedTask : task
          )
        }));
        setCategories(updatedCategories);
        onClose();
      }
    };
  
    return (
      <Flex p={8} gap={6} minH="100vh" bg="gray.100">
        {/* Add Category Button */}
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="teal" 
          onClick={() => {
            setModalType("category");
            onOpen();
          }}
        >
          Add Category
        </Button>
  
        {/* Categories */}
        {categories.map((category) => (
          <Card key={category.id} w="350px" h="fit-content">
            <CardHeader pb={2}>
              <Flex justify="space-between" align="center">
                <Heading size="md">
                  <FaTasks style={{ marginRight: "8px", display: "inline" }} />
                  {category.title}
                </Heading>
                <Menu>
                  <MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="ghost" />
                  <MenuList>
                    <MenuItem icon={<EditIcon />} onClick={() => {
                      setNewCategoryName(category.title);
                      setModalType("category");
                      onOpen();
                    }}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={() => handleDelete(category.id)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </CardHeader>
  
            <CardBody pt={2}>
              <Stack spacing={4}>
                {category.tasks.map((task) => (
                  <Card key={task.id} p={4} variant="outline">
                    <Flex justify="space-between">
                      <Box>
                        <Text fontWeight="bold">{task.title}</Text>
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
                      </Box>
                      <Flex direction="column" gap={2}>
                        <IconButton
                          icon={<CheckIcon />}
                          aria-label="Complete Task"
                          colorScheme="green"
                          size="sm"
                          onClick={() => handleStatusChange(category.id, task.id)}
                        />
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit Task"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task);
                            setModalType("edit");
                            onOpen();
                          }}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete Task"
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(category.id, task.id)}
                        />
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Stack>
              
              <Button 
                mt={4} 
                leftIcon={<AddIcon />} 
                w="full" 
                variant="outline"
                onClick={() => {
                  setModalType("task");
                  setNewTask({ ...newTask, status: category.title });
                  onOpen();
                }}
              >
                Add Task
              </Button>
            </CardBody>
          </Card>
        ))}
  
        {/* Modals */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {modalType === "category" ? "New Category" : 
               modalType === "task" ? "New Task" : "Edit Task"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {modalType === "category" ? (
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              ) : (
                <>
                  <Input
                    placeholder="Task title"
                    mb={2}
                    value={modalType === "edit" ? selectedTask?.title : newTask.title}
                    onChange={(e) => modalType === "edit" 
                      ? setSelectedTask({ ...selectedTask!, title: e.target.value })
                      : setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Task description"
                    mb={2}
                    value={modalType === "edit" ? selectedTask?.description : newTask.description}
                    onChange={(e) => modalType === "edit" 
                      ? setSelectedTask({ ...selectedTask!, description: e.target.value })
                      : setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Status"
                    value={modalType === "edit" ? selectedTask?.status : newTask.status}
                    onChange={(e) => modalType === "edit" 
                      ? setSelectedTask({ ...selectedTask!, status: e.target.value })
                      : setNewTask({ ...newTask, status: e.target.value })
                    }
                  />
                </>
              )}
            </ModalBody>
  
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={() => {
                  if (modalType === "category") {
                    handleAddCategory();
                  } else if (modalType === "task") {
                    handleAddTask(categories[categories.length - 1].id);
                  } else {
                    handleEditTask();
                  }
                }}
              >
                {modalType === "edit" ? "Save Changes" : "Create"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    );
  };
  
  export default IntegradeLayout;