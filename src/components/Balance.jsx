/* eslint-disable react/prop-types */
import {
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
} from "@nextui-org/react";
import helper from "../utils/helper";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import useWalletPopup from "./Popups/WalletPopup";
import { useTranslation } from "react-i18next";

const Balance = ({ walletList }) => {
  const { t } = useTranslation();
  const { currentWallet, setCurrentWallet } = useContext(GlobalContext);
  const { WalletPopup, onOpen } = useWalletPopup();

  const switchWallets = (action) => {
    if (action === "edit") {
      onOpen();
    } else {
      setCurrentWallet(walletList.find((w) => w.id === Number(action)));
    }
  };

  if (!currentWallet) {
    return <></>;
  }

  return (
    <>
      <Card className="desktop:max-w-[480px] mobile:w-full mobile:min-w-[330px]">
        <CardHeader className="flex gap-3 relative">
          <h1 className="font-bold m-none text-[1.8rem] px-2">
            {currentWallet.name}
          </h1>
          {walletList.length > 1 ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <img
                  className="absolute top-2 right-3 cursor-pointer"
                  width={30}
                  src={helper.getImgUrl("settings.png")}
                  alt="settings"
                />
              </DropdownTrigger>
              <DropdownMenu
                onAction={switchWallets}
                variant="flat"
                disabledKeys={["devider"]}
              >
                {walletList
                  .filter((c) => c.id !== currentWallet.id)
                  .map((w) => (
                    <DropdownItem key={w.id} className="font-semibold">
                      {w.name}
                    </DropdownItem>
                  ))}
                <DropdownItem key="devider">
                  <Divider />
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  className="font-semibold text-warning"
                  color="warning"
                >
                  {t("wallet.EditCurrentWallet")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <img
              className="absolute top-2 right-3 cursor-pointer"
              width={30}
              src={helper.getImgUrl("settings.png")}
              alt="settings"
              onClick={onOpen}
            />
          )}
        </CardHeader>
        <CardBody className="py-0 px-[1.25rem]">
          <div className="flex justify-between items-center">
            <span className="text-[1.3rem]">{t("wallet.TotalBalance")}:</span>
            <span className="text-[3rem] font-bold min-[430px]:text-[4rem]">
              {currentWallet.currency}
              {currentWallet.balance}
            </span>
          </div>
        </CardBody>
      </Card>
      <WalletPopup wallet={currentWallet} title={t("wallet.EditWallet")} />
    </>
  );
};

export default Balance;
