/* eslint-disable react/prop-types */
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { useTranslation } from "react-i18next";

const BasePopup = ({
  isOpen,
  isDismissable,
  onOpenChange,
  withoutRemove,
  title,
  onCallback,
  footerContent,
  children,
}) => {
  const { darkMode } = useContext(GlobalContext);
  const { t } = useTranslation();

  const getFooter = (onClose) => {
    return footerContent ? (
      footerContent(onClose)
    ) : (
      <>
        {!withoutRemove ? (
          <Button
            className="font-bold"
            color="danger"
            variant="flat"
            radius="full"
            onPress={() => onCallback("remove", onClose)}
          >
            {t("popup.REMOVE")}
          </Button>
        ) : (
          <></>
        )}
        <div className="flex gap-2">
          <Button
            className="cancel"
            color="danger"
            variant="bordered"
            radius="full"
            onPress={() => onCallback("cancel", onClose)}
          >
            {t("popup.Cancel")}
          </Button>
          <Button
            className="save"
            color="success"
            variant="bordered"
            radius="full"
            onPress={() => onCallback("save", onClose)}
          >
            {t("popup.Save")}
          </Button>
        </div>
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      isDismissable={!isDismissable}
      className={`${darkMode ? "dark text-white" : "light"} max-[490px]:w-[90vw]`}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-[1.7rem] text-center">
              {title}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter
              className={`justify-${!withoutRemove ? "between" : "end"}`}
            >
              {getFooter(onClose)}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BasePopup;
