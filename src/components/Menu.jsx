/* eslint-disable react/prop-types */
import { Button, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import helper from "../utils/helper";
import LanguageSwitch from "./LanguageSwitch";
import DarkMode from "./DarkMode";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { useTranslation } from "react-i18next";

const Menu = ({ mobile, menuChange }) => {
  const { t } = useTranslation();
  const { setNotification } = useContext(GlobalContext);
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    if (mobile) {
      menuChange();
    }
  };

  const onLogOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setNotification({ type: "error", message: error?.message || error });
    }

    navigate("/login");
  };

  const menuList = () => {
    return (
      <>
        <Button
          onClick={() => navigateTo("/")}
          className={`w-full h-[70px] ${
            mobile ? "my-2" : ""
          } gap-unit-6 px-unit-8 text-[1.2rem] font-bold justify-${
            mobile ? "center" : "start"
          } text-white hover:text-[#338EF7]`}
          color="primary"
          variant="light"
          startContent={
            <img width={30} alt="wallet" src={helper.getImgUrl("wallet.png")} />
          }
        >
          {t("menu.MyWallet")}
        </Button>
        <Button
          onClick={() => navigateTo("/card")}
          className={`w-full h-[70px] ${
            mobile ? "my-2" : ""
          } gap-unit-6 px-unit-8 text-[1.2rem] font-bold justify-${
            mobile ? "center" : "start"
          } text-white hover:text-[#338EF7]`}
          color="primary"
          variant="light"
          startContent={
            <img
              width={30}
              alt="credit-card"
              src={helper.getImgUrl("credit-card.png")}
            />
          }
        >
          {t("menu.MyCard")}
        </Button>
        <Button
          onClick={() => navigateTo("/finance-chart")}
          className={`w-full h-[70px] ${
            mobile ? "my-2" : ""
          } gap-unit-6 px-unit-8 text-[1.2rem] font-bold justify-${
            mobile ? "center" : "start"
          } text-white hover:text-[#338EF7]`}
          color="primary"
          variant="light"
          startContent={
            <img
              width={30}
              alt="financial-profit"
              src={helper.getImgUrl("financial-profit.png")}
            />
          }
        >
          {t("menu.FinanceChart")}
        </Button>
        <Button
          onClick={() => navigateTo("/transactions")}
          className={`w-full h-[70px] ${
            mobile ? "my-2" : ""
          } gap-unit-6 px-unit-8 text-[1.2rem] font-bold justify-${
            mobile ? "center" : "start"
          } text-white hover:text-[#338EF7]`}
          color="primary"
          variant="light"
          startContent={
            <img
              width={30}
              alt="transaction"
              src={helper.getImgUrl("transaction.png")}
            />
          }
        >
          {t("menu.Transactions")}
        </Button>
      </>
    );
  };

  return (
    <>
      {!mobile ? (
        <>
          <div className="flex flex-col justify-start gap-5">
            <img
              width={230}
              className="py-5 ml-[10px]"
              alt="logo"
              src={helper.getImgUrl("logo.svg")}
            />
            {menuList()}
          </div>
          <div className="text-center">
            <Button
              className="logout w-[90%] h-[50px] text-[1.2rem] font-bold gap-unit-5"
              color="success"
              variant="bordered"
              onClick={onLogOut}
              startContent={
                <img
                  width={30}
                  alt="logout"
                  src={helper.getImgUrl("logout.png")}
                />
              }
            >
              {t("menu.LogOut")}
            </Button>
          </div>
        </>
      ) : (
        <NavbarMenu className="py-5 justify-between bg-[#080325]">
          <NavbarMenuItem>
            <div className="flex flex-col justify-center items-center mb-5">
              <div className="flex justify-between w-full pb-3">
                <LanguageSwitch />
                <DarkMode mobile={true} />
              </div>
              <img width={280} alt="logo" src={helper.getImgUrl("logo.svg")} />
            </div>
            {menuList()}
          </NavbarMenuItem>
          <NavbarMenuItem className="text-center">
            <Button
              className="logout w-[90%] h-[50px] text-[1.2rem] font-bold gap-unit-5"
              color="success"
              variant="bordered"
              onClick={onLogOut}
              startContent={
                <img
                  width={30}
                  alt="logout"
                  src={helper.getImgUrl("logout.png")}
                />
              }
            >
              {t("menu.LogOut")}
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      )}
    </>
  );
};

export default Menu;
