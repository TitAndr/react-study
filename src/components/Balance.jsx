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
      <Card className="min-h-[200px] desktop:max-w-[480px] mobile:w-full mobile:min-w-[330px] desktop:min-h-0">
        <CardHeader className="flex gap-3 justify-between items-center">
          <h1 className="font-bold m-none text-[1.8rem] px-2 text-ellipsis overflow-hidden w-[95%] whitespace-nowrap">
            {currentWallet.name}
          </h1>
          {walletList.length > 1 ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <img
                  className="cursor-pointer mr-2"
                  width={30}
                  src={helper.getImgUrl("change.png")}
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
                    <DropdownItem key={w.id} className="font-semibold max-w-[170px]">
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
              className="cursor-pointer mr-2"
              width={20}
              src={helper.getImgUrl("edit.png")}
              alt="settings"
              onClick={onOpen}
            />
          )}
        </CardHeader>
        <CardBody className="py-0 px-[1.25rem] justify-center">
          {currentWallet?.is_main ? (
            <span className="font-bold p-1 text-center uppercase text-red-500 border-solid border-3 rounded-large border-red-500 mobile:p-2 w-fit max-w-[215px]">
              {t("wallet.MainWallet")}
            </span>
          ) : (
            <></>
          )}
          <div className="flex justify-between items-center">
            <span className="text-[1.3rem]">{t("wallet.TotalBalance")}:</span>
            <span className="text-[3rem] font-bold min-[430px]:text-[4rem]">
              {currentWallet.currency}
              {helper.getFormatBalance(currentWallet?.balance)}
            </span>
          </div>
        </CardBody>
      </Card>
      <WalletPopup wallet={currentWallet} title={t("wallet.EditWallet")} />
    </>
  );
};

export default Balance;
