/* eslint-disable react/prop-types */
import { Button, useDisclosure } from "@nextui-org/react";
import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import BasePopup from "./BasePopup";
import Validation from "../../utils/validation";
import { useTranslation } from "react-i18next";
import CustomInput from "../CustomInput";
import parse from "html-react-parser";

const useResetPopup = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ResetPopup = ({ isLogIn }) => {
    const { t } = useTranslation();
    const { updateAuth, setNotification, resetPassword } =
      useContext(GlobalContext);
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const { handleField, getError, isValid } = Validation();

    const onResetClick = async (onClose) => {
      if (!isValid()) {
        return;
      }

      const result = isLogIn
        ? await updateAuth({ password: newPassword })
        : await resetPassword(email);

      const message = isLogIn ? "popup.ResetPassword" : "popup.ResetLink";

      onClose();

      if (result) {
        setNotification({
          message,
          type: "success",
        });
      }
    };

    const getTitle = () => {
      return isLogIn ? (
        t("popup.CreatePassword")
      ) : (
        <span>{parse(t("popup.SendLintReset"))}</span>
      );
    };

    const getFooterContent = (onClose) => {
      return (
        <Button
          className="save font-bold"
          color="success"
          variant="bordered"
          radius="full"
          isDisabled={!isValid()}
          onClick={() => onResetClick(onClose)}
        >
          {t(`popup.${isLogIn ? "Confirm" : "SendLinkEmail"}`)}
        </Button>
      );
    };

    return (
      <BasePopup
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={getTitle()}
        footerContent={getFooterContent}
        isDismissable={!isLogIn}
        withoutRemove
      >
        {!isLogIn ? (
          <CustomInput
            isRequired
            type="email"
            label={t("popup.Email")}
            value={email}
            endContent="MailIcon"
            errorMessage={getError("email", { email }, "required|email")}
            onChange={(e) => {
              handleField("email", e.target.value, setEmail, true);
            }}
          />
        ) : (
          <CustomInput
            isRequired
            type="password"
            label={t("popup.Password")}
            value={newPassword}
            endContent="LockIcon"
            errorMessage={getError(
              "newPassword",
              { newPassword },
              "required|uppercase|lowercase|hasNumbers|specificCharecters|min:6|max:256"
            )}
            onChange={(e) => {
              handleField("newPassword", e.target.value, setNewPassword, true);
            }}
          />
        )}
      </BasePopup>
    );
  };

  return {
    ResetPopup,
    onOpen,
  };
};

export default useResetPopup;
