import { useContext } from "react";
import CardInfo from "../components/CardInfo";
import CardList from "../components/CardList";
import CreateButton from "../components/CreateButton";
import { GlobalContext } from "../context/GlobalState";
import useCardPopup from "../components/Popups/CardPopup";
import { useTranslation } from "react-i18next";

const CardPage = () => {
  const { cards } = useContext(GlobalContext);
  const { CardPopup, onOpen } = useCardPopup();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col place-content-center place-items-center justify-around gap-8 laptop:flex-row">
      <div className="flex flex-col justify-between gap-4 w-full laptop:w-[45%] mobile:min-w-[450px]">
        <CardInfo card={cards.find((c) => c.is_primary) || cards[0]} />
      </div>
      <div className="flex flex-col justify-between w-full laptop:w-[45%] h-[450px]">
        {cards.length > 0 ? <CardList /> : <></>}
        <CreateButton label={t("card.AddNewCard")} onOpen={onOpen} />
      </div>
      <CardPopup
        title={t("card.NewCard")}
        disablePrimary={cards.length === 0}
      />
    </div>
  );
};

export default CardPage;
