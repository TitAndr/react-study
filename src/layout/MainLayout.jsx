/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { GlobalContext } from "../context/GlobalState";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MainLayout = ({ session, children }) => {
  let isLoadData = false;
  const { t } = useTranslation();
  const { darkMode, user, getData } = useContext(GlobalContext);
  const { pathname } = useLocation();

  const getTitles = useMemo(() => {
    let title = "";

    switch (pathname) {
      case "/":
        title = t("menu.MyWallet");
        break;

      case "/card":
        title = t("menu.MyCard");
        break;

      case "/transactions":
        title = t("main.Transactions");
        break;

      case "/finance-chart":
        title = t("menu.FinanceChart");
        break;

      case "/profile":
        title = t("main.MyProfile");
        break;
    }

    return { title };
  }, [pathname]);

  useEffect(() => {
    const setData = async () => {
      if (!user && !isLoadData && session) {
        getData(session.user?.id);
        isLoadData = true;
      }
    };

    setData();
  }, [user]);

  return (
    <main
      className={`${darkMode ? "dark" : ""} text-foreground bg-background flex`}
    >
      <Sidebar />
      <div className="wrapper w-full h-[100vh] overflow-y-auto">
        <Header />
        <div className="content mx-[28px] pt-[60px] mobile:px-[20px] w-max-[1075px]">
          <div className="mt-[15px] mb-[25px]">
            <h1 className="m-none text-title font-bold max-[550px]:text-[2rem]">
              {getTitles.title}
            </h1>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainLayout;
