import Balance from "../components/Balance";
import CreateButton from "../components/CreateButton";
import Purpose from "../components/Purpose";
import PaymentAction from "../components/PaymentAction";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/GlobalState";
import useWalletPopup from "../components/Popups/WalletPopup";
import helper from "../utils/helper";

const Home = () => {
  const { purposes, wallets, currentWallet } = useContext(GlobalContext);
  const { WalletPopup, onOpen } = useWalletPopup();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-4 desktop:flex-row">
        <Balance walletList={wallets} />
        <div className="flex justify-between items-center gap-6 min-w-[35vw]">
          <PaymentAction
            type="outcome"
            disable={currentWallet?.balance === 0}
            label={t("home.SendPayment")}
          />
          <PaymentAction type="income" label={t("home.RequestPayment")} />
        </div>
      </div>
      <div className="w-full grid place-content-start justify-center place-items-center tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4">
        {helper
          .sortBy(purposes, null, (purpose) => {
            return purpose
              ? !!purpose.amount && purpose.amount <= purpose.current_amount
              : false;
          })
          .map((p) => (
            <Purpose key={p.id} purpose={p} />
          ))}
        <Purpose />
      </div>
      <CreateButton label={t("home.CreateNewWallet")} onOpen={onOpen} />
      <WalletPopup title={t("home.NewWallet")} />
    </div>
  );
};

export default Home;
