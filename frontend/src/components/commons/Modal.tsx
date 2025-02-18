import {
    Flex,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Stack,
    Text,
    Tag,
    IconButton,
    Button,
    useDisclosure,
    Modal as CModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Box,
} from "@chakra-ui/react";
import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    CheckIcon,
    ChevronDownIcon,
} from "@chakra-ui/icons";
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

interface ModalProps {
    modalTitle: string;
    onOpen: () => void;
    onClose: () => void;
    isOpen: boolean;
    children: React.ReactNode;
}

export default function Modal({
    modalTitle,
    onOpen,
    onClose,
    isOpen,
    children,
}: ModalProps) {

    return (
            <CModal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{modalTitle}</ModalHeader>
                    <ModalCloseButton onClick={onClose}/>

                    <ModalBody>{children}</ModalBody>
                </ModalContent>
            </CModal>
    );
}
