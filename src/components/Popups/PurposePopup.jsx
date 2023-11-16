/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDisclosure } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import BasePopup from "./BasePopup";
import { GlobalContext } from "../../context/GlobalState";
import helper from "../../utils/helper";
import CustomAvatar from "../CustomAvatar";
import Validation from "../../utils/validation";
import { useTranslation } from "react-i18next";
import CustomInput from "../CustomInput";

const usePurposePopup = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const PurposePopup = ({ purpose, title }) => {
    const { t } = useTranslation();
    const { handleField, getError, isValid, hideMessages } = Validation();
    const { currentWallet, savePurpose, purposes } = useContext(GlobalContext);
    const [selectedPurpose, setSelectedPurpose] = useState(
      () =>
        purpose || {
          name: "",
          amount: "",
          current_amount: 0,
          last_paid: new Date(),
        }
    );

    const getPurposesNames = () => {
      const list = purpose
        ? purposes.filter((w) => w.id !== selectedPurpose.id)
        : purposes;

      return list.map((i) => i.name);
    };

    const onCallback = (type, onClose) => {
      if (type === "save" && !isValid(setSelectedPurpose)) {
        return;
      }

      selectedPurpose.photo =
        typeof selectedPurpose.photo === "string"
          ? selectedPurpose.photo
          : null;

      helper.save(type, savePurpose, {
        newEntity: selectedPurpose,
        oldEntity: purpose,
      });

      onClose();
    };

    const isCompleted = () => {
      return selectedPurpose
        ? !!selectedPurpose.amount &&
            selectedPurpose.amount <= selectedPurpose.current_amount
        : false;
    };

    useEffect(() => {
      hideMessages();
    }, []);

    return (
      <BasePopup
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCallback={onCallback}
        title={title}
        withoutRemove={!purpose}
      >
        <>
          <div className="relative w-full flex justify-center mb-2">
            <CustomAvatar
              forPopup={true}
              image={selectedPurpose?.photo || helper.getImgUrl("purpose.png")}
              imgCallback={(img) =>
                setSelectedPurpose((p) => ({ ...p, photo: img }))
              }
            />
            {isCompleted() ? (
              <img
                className="absolute top-[-70px] left-0"
                width={50}
                src={helper.getImgUrl("completed.png")}
                alt="completed"
              />
            ) : (
              <></>
            )}
          </div>
          <CustomInput
            isRequired
            label={t("popup.Name")}
            value={selectedPurpose.name}
            errorMessage={getError(
              "name",
              selectedPurpose,
              `required|isUnique:${getPurposesNames()}`
            )}
            onChange={(e) =>
              handleField("name", e.target.value, setSelectedPurpose)
            }
          />
          <CustomInput
            isRequired
            label={t("popup.Amount")}
            min={0}
            value={selectedPurpose.amount}
            errorMessage={getError(
              "amount",
              selectedPurpose,
              "required|numeric|not_regex:^0|max:999999,num"
            )}
            onChange={(e) =>
              handleField("amount", e.target.value, setSelectedPurpose)
            }
            startContent={
              <span className="text-default-500 text-large font-bold mr-3 px-2">
                {currentWallet?.currency}
              </span>
            }
            classNames={{
              label: "uppercase",
            }}
          />
        </>
      </BasePopup>
    );
  };

  return {
    PurposePopup,
    onOpen,
  };
};

export default usePurposePopup;
