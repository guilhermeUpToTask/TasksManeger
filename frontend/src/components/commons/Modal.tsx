import {
    Modal as CModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from "@chakra-ui/react";
import React from "react";

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
