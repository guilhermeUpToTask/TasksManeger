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
    Container,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Modal from "../../components/commons/Modal";
import Categories from "../../components/Categories";

export default function Layout() {
    return (
        <>
            <Heading pb={4}>Tasks Manager</Heading>
            <Categories />
        </>
    );
}
