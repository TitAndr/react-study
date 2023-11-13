/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import BasePopup from "./BasePopup";
import { useTranslation } from "react-i18next";

const useConfirmPopup = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ConfirmPopup = ({ title, message, callback }) => {
    const { t } = useTranslation();
    const onCallback = (onClose) => {
      callback ? callback(onClose) : null;
      onClose();
    };

    return (
      <BasePopup isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[1.7rem]">
                <h1>{title}</h1>
              </ModalHeader>
              <ModalBody>{message}</ModalBody>
              <ModalFooter className="justify-between">
                <Button
                  className="cancel font-bold"
                  color="danger"
                  variant="bordered"
                  radius="full"
                  onPress={onClose}
                >
                  {t("popup.NO")}
                </Button>
                <Button
                  className="save font-bold"
                  color="success"
                  variant="bordered"
                  radius="full"
                  onPress={() => onCallback(onClose)}
                >
                  {t("popup.YES")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </BasePopup>
    );
  };

  return {
    ConfirmPopup,
    onOpen,
  };
};

export default useConfirmPopup;
