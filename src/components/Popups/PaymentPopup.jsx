/* eslint-disable react/prop-types */
import { Button, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import helper from "../../utils/helper";
import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import BasePopup from "./BasePopup";
import Validation from "../../utils/validation";
import CustomSelect from "../CustomSelect";
import { useTranslation } from "react-i18next";
import CustomInput from "../CustomInput";

const usePaymentPopup = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { handleField, getError, isValid } = Validation();

  const PaymentPopup = ({ type, title }) => {
    const {
      purposes,
      categories,
      paymentTypes,
      saveTransaction,
      currentWallet,
      savePurpose,
      saveWallet,
      setCurrentWallet,
    } = useContext(GlobalContext);
    const [selectedTransaction, setTransaction] = useState({
      type,
      name: "",
      amount: "",
      payment: "",
      category: "",
      wallet_id: currentWallet?.id,
      created_at: new Date().toISOString().replace(/T.{1,}/g, ""),
    });
    const [selectedPurpose, setPurpose] = useState(null);

    const onCallback = (onClose) => {
      if (!isValid(setTransaction)) {
        return;
      }

      // Check and update selected purpose balance
      if (selectedPurpose) {
        const existPurpose = purposes.find(
          (p) => p.id === Number(selectedPurpose.currentKey)
        );

        const purposeAmount =
          existPurpose.current_amount + Number(selectedTransaction.amount);

        helper.save("save", savePurpose, {
          newEntity: {
            ...existPurpose,
            current_amount:
              purposeAmount > 0
                ? purposeAmount > existPurpose.amount
                  ? existPurpose.amount
                  : purposeAmount
                : 0,
            last_paid: new Date(),
          },
          oldEntity: existPurpose,
        });
      }

      // Save new transaction
      helper.save("save", saveTransaction, {
        newEntity: {
          ...selectedTransaction,
          created_at: new Date(
            new Date(selectedTransaction.created_at).setHours(
              new Date().getHours(),
              new Date().getMinutes()
            )
          ),
        },
      });

      // Update current wallet balance
      const updatedWallet = {
        ...currentWallet,
        balance:
          type === "income"
            ? currentWallet?.balance + Number(selectedTransaction.amount)
            : currentWallet?.balance - Number(selectedTransaction.amount),
      };

      helper.save("save", saveWallet, {
        newEntity: updatedWallet,
        oldEntity: currentWallet,
      });
      setCurrentWallet(updatedWallet);

      onClose();
    };

    const getFooterContent = (onClose) => {
      return (
        <Button
          radius="full"
          color="success"
          className="w-full font-bold text-white text-medium my-1"
          onPress={() => onCallback(onClose)}
        >
          {t("popup.MakePayment")}
        </Button>
      );
    };

    return (
      <BasePopup
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={
          <span className="flex items-center gap-6">
            <img width={50} src={helper.getImgUrl(`${type}-title.png`)} />
            {title}
          </span>
        }
        footerContent={getFooterContent}
      >
        <>
          <CustomInput
            isRequired
            label={t("popup.Amount")}
            type="number"
            size="lg"
            min={0}
            max={currentWallet?.balance}
            value={selectedTransaction.amount}
            errorMessage={getError(
              "amount",
              selectedTransaction,
              `required|numeric|not_regex:^0|max:${
                type === "outcome" ? currentWallet?.balance || 0 : "999999"
              },num`
            )}
            onChange={(e) => {
              handleField("amount", e.target.value, setTransaction);
            }}
            classNames={{
              input: ["font-bold"],
              label: "uppercase font-bold",
            }}
            startContent={
              <span className="text-default-500 text-large font-bold mr-3 px-2">
                $
              </span>
            }
          />
          <CustomInput
            isRequired
            label={t("popup.Name")}
            value={selectedTransaction.name}
            errorMessage={getError("name", selectedTransaction, "required")}
            onChange={(e) => {
              handleField("name", e.target.value, setTransaction);
            }}
          />
          {type === "outcome" && purposes.length > 0 ? (
            <div className="flex justify-center">
              <Select
                label={t("popup.SelectPurpose")}
                className="max-w-xs"
                onSelectionChange={setPurpose}
              >
                {purposes.map((purpose) => (
                  <SelectItem
                    key={purpose.id}
                    value={purpose.name}
                    startContent={
                      <img
                        alt="purpose"
                        className="w-6 h-6"
                        src={purpose.photo || helper.getImgUrl(`purpose.png`)}
                      />
                    }
                  >
                    {purpose.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          ) : (
            <></>
          )}
          <div className="flex gap-3 max-[400px]:flex-col">
            <CustomSelect
              label={t("popup.PaymentType")}
              list={paymentTypes}
              value={[selectedTransaction.payment]}
              errorMessage={getError(
                "payment",
                selectedTransaction,
                "required"
              )}
              onSelectionChange={(value) => {
                handleField("payment", value, setTransaction);
              }}
              defaultSelectedKeys={
                paymentTypes.length !== 0 && paymentTypes.length < 2
                  ? [paymentTypes[0].value]
                  : []
              }
            />
            <CustomSelect
              label={t("popup.Category")}
              value={[selectedTransaction.category]}
              list={categories.filter((c) => c.type === type)}
              errorMessage={getError(
                "category",
                selectedTransaction,
                "required"
              )}
              onSelectionChange={(value) => {
                handleField("category", value, setTransaction);
              }}
            />
          </div>
          <CustomInput
            isRequired
            type="date"
            placeholder="mm/dd/yyyy"
            label={t("popup.Date")}
            value={selectedTransaction.created_at}
            errorMessage={getError(
              "created_at",
              selectedTransaction,
              "required"
            )}
            onChange={(e) => {
              handleField("created_at", e.target.value, setTransaction);
            }}
          />
        </>
      </BasePopup>
    );
  };

  return {
    PaymentPopup,
    onOpen,
  };
};

export default usePaymentPopup;
