/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Checkbox, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import BasePopup from "./BasePopup";
import { GlobalContext } from "../../context/GlobalState";
import helper from "../../utils/helper";
import useConfirmPopup from "./ConfirmPopup";
import Validation from "../../utils/validation";
import { useTranslation } from "react-i18next";
import CustomInput from "../CustomInput";

const useWalletPopup = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose: onCloseMain,
  } = useDisclosure();

  const WalletPopup = ({ wallet, title }) => {
    const { handleField, getError, isValid, hideMessages } = Validation();
    const { wallets, currencies, saveWallet, currentWallet, setCurrentWallet } =
      useContext(GlobalContext);
    const [selectedWallet, setSelectedWallet] = useState(
      () =>
        wallet || {
          name: "",
          currency: currencies[0].value,
          balance: 0,
          is_main: false,
        }
    );

    const { ConfirmPopup, onOpen: openConfirm } = useConfirmPopup();

    const getWalletsNames = () => {
      const list = wallet
        ? wallets.filter((w) => w.id !== selectedWallet.id)
        : wallets;

      return list.map((i) => i.name);
    };

    const getExistMain = () =>
      wallets.find((c) => c.is_main && c.id !== selectedWallet.id);

    const onCallback = (type, onClose, isConfirm) => {
      if (type === "save") {
        if (!isValid(setSelectedWallet)) {
          return;
        }

        if (!isConfirm && selectedWallet.is_main && getExistMain()) {
          openConfirm();
          return;
        }

        if (selectedWallet.id === currentWallet.id) {
          setCurrentWallet(selectedWallet);
        }
      }

      if (type === "remove") {
        setCurrentWallet(wallets.find((w) => w.is_main) || {});
      }

      helper.save(type, saveWallet, {
        newEntity: selectedWallet,
        oldEntity: wallet,
      });

      onClose ? onClose() : onCloseMain();
    };

    useEffect(() => {
      hideMessages();
    }, []);

    return (
      <>
        <BasePopup
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onCallback={onCallback}
          title={title}
          withoutRemove={wallet?.is_main || !selectedWallet.id}
        >
          <>
            <div className="flex gap-3 max-[400px]:flex-col">
              <Select
                isRequired
                disallowEmptySelection
                label={t("wallet.SelectCurrency")}
                className="max-w-xs"
                defaultSelectedKeys={[selectedWallet.currency]}
                selectedKeys={[selectedWallet.currency]}
                isInvalid={!!getError("currency", selectedWallet, "required")}
                errorMessage={getError("currency", selectedWallet, "required")}
                onSelectionChange={({ currentKey }) => {
                  handleField("currency", currentKey || "", setSelectedWallet);
                }}
              >
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    startContent={
                      <img
                        alt={currency.value}
                        className="w-8 h-6"
                        src={`https://flagcdn.com/${currency.code}.svg`}
                      />
                    }
                  >
                    {currency.label}
                  </SelectItem>
                ))}
              </Select>
              <CustomInput
                isRequired
                label={t("wallet.Name")}
                value={selectedWallet.name}
                errorMessage={getError(
                  "name",
                  selectedWallet,
                  `required|isUnique:${getWalletsNames()}`
                )}
                onChange={(e) => {
                  handleField("name", e.target.value, setSelectedWallet);
                }}
              />
            </div>
            <Checkbox
              color="warning"
              isDisabled={wallet?.is_main}
              isSelected={selectedWallet.is_main}
              onChange={(e) =>
                setSelectedWallet((w) => ({
                  ...w,
                  is_main: e.target.checked,
                }))
              }
            >
              {t("wallet.Main")}
            </Checkbox>
          </>
        </BasePopup>
        <ConfirmPopup
          title={t("wallet.ConfirmTitle")}
          message={t("wallet.ConfirmText")}
          callback={() => {
            // uncheck primary from existing card
            helper.save("save", saveWallet, {
              newEntity: { ...getExistMain(), is_main: false },
              oldEntity: getExistMain(),
            });

            setCurrentWallet(selectedWallet);

            onCallback("save", null, true);
          }}
        />
      </>
    );
  };

  return {
    WalletPopup,
    onOpen,
  };
};

export default useWalletPopup;
