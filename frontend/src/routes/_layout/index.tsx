import React, { useState } from "react";
import { Heading } from "@chakra-ui/react";
import Categories from "../../components/Categories";

export default function Layout() {
    return (
        <>
            <Heading pb={4}>Tasks Manager</Heading>
            <Categories />
        </>
    );
}
