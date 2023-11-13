/* eslint-disable react/prop-types */
import { Input, Checkbox, useDisclosure } from "@nextui-org/react";
import helper from "../../utils/helper";
import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import BasePopup from "./BasePopup";
import useConfirmPopup from "./ConfirmPopup";
import Validation from "../../utils/validation";
import { useTranslation } from "react-i18next";
import CustomInput from "../CustomInput";

const useCardPopup = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { handleField, getError, isValid } = Validation();

  const CardPopup = ({ card, title, disablePrimary }) => {
    const { t } = useTranslation();
    const { saveCard, cards } = useContext(GlobalContext);
    const [selectedCard, setSelectedCard] = useState(
      () =>
        card || {
          holder: "",
          card_number: "",
          expiry_date: new Date(),
          cvv: "",
          is_primary: !!disablePrimary,
        }
    );

    const { ConfirmPopup, onOpen: openConfirm } = useConfirmPopup();

    const getExistPrimary = () =>
      cards.find((c) => c.is_primary && c.id !== selectedCard.id);

    const onCallback = (type, onClose) => {
      if (type === "save") {
        if (!isValid(setSelectedCard)) {
          return;
        }

        if (selectedCard.is_primary && getExistPrimary()) {
          openConfirm();
          return;
        }
      }

      helper.save(type, saveCard, {
        newEntity: {
          ...selectedCard,
          expiry_date: new Date(selectedCard.expiry_date),
        },
        oldEntity: card,
      });

      onClose();
    };

    return (
      <>
        <BasePopup
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onCallback={onCallback}
          title={title}
          withoutRemove
        >
          <>
            <CustomInput
              isRequired
              label={t("popup.CardNumber")}
              value={selectedCard.card_number}
              errorMessage={getError(
                "card_number",
                selectedCard,
                "required|card_num|min:16|max:19"
              )}
              onChange={(e) => {
                handleField("card_number", e.target.value, setSelectedCard);
              }}
            />
            <div className="flex gap-3 max-[400px]:flex-col">
              <CustomInput
                isRequired
                type="date"
                placeholder="mm/dd/yyyy"
                label={t("popup.ExpiryDate")}
                value={selectedCard.expiry_date}
                errorMessage={getError("expiry_date", selectedCard, "required")}
                onChange={(e) => {
                  handleField("expiry_date", e.target.value, setSelectedCard);
                }}
              />
              <CustomInput
                isRequired
                type="number"
                min={0}
                max={999}
                label={t("popup.CVV")}
                value={selectedCard.cvv}
                errorMessage={getError(
                  "cvv",
                  selectedCard,
                  "required|integer|max:999,num"
                )}
                onChange={(e) => {
                  handleField("cvv", e.target.value, setSelectedCard);
                }}
              />
            </div>
            <Input
              label={t("card.CardHolder")}
              variant="bordered"
              value={selectedCard.holder}
              onChange={(e) =>
                setSelectedCard((c) => ({ ...c, holder: e.target.value }))
              }
            />
            <Checkbox
              color="warning"
              isDisabled={disablePrimary}
              isSelected={selectedCard.is_primary}
              onChange={(e) =>
                setSelectedCard((c) => ({
                  ...c,
                  is_primary: e.target.checked,
                }))
              }
            >
              {t("card.Primary")}
            </Checkbox>
          </>
        </BasePopup>
        <ConfirmPopup
          title={t("card.ConfirmTitle")}
          message={t("card.ConfirmText")}
          callback={(onClose) => {
            // uncheck primary from existing card
            helper.save("save", saveCard, {
              newEntity: { ...getExistPrimary(), is_primary: false },
              oldEntity: getExistPrimary(),
            });

            // save new primary card
            helper.save("save", saveCard, {
              newEntity: selectedCard,
              oldEntity: card,
            });

            onClose();
          }}
        />
      </>
    );
  };

  return {
    CardPopup,
    onOpen,
  };
};

export default useCardPopup;
