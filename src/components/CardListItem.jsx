/* eslint-disable react/prop-types */
import { Card, CardBody, Button } from "@nextui-org/react";
import helper from "../utils/helper";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import useCardPopup from "./Popups/CardPopup";
import { useTranslation } from "react-i18next";

const CardListItem = ({ card, disablePrimary }) => {
  const { t } = useTranslation();
  const { card_number: nr, is_primary } = card;
  const { saveCard, setNotification } = useContext(GlobalContext);
  const { CardPopup, onOpen } = useCardPopup();

  const onRemove = () => {
    if (is_primary && disablePrimary) {
      setNotification({
        type: "error",
        message: "card.ErrorRemove",
      });
      return;
    }

    saveCard("delete", card);
  };

  return (
    <>
      <Card className="mobile:w-full mobile:min-w-[330px] min-h-[56px]">
        <CardBody
          className={`px-[1rem] py-2 justify-between items-center flex-row gap-2 ${
            is_primary
              ? "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
              : ""
          }`}
        >
          <img src={helper.getImgUrl("card.png")} width={30} alt="card" />
          <span className="text-center">
            {helper.getCardNumber(nr).map((v, i) => {
              return <span key={i + 10}>{v} </span>;
            })}
          </span>
          <div className="flex gap-2">
            <Button isIconOnly variant="bordered" size="sm" onClick={onOpen}>
              <img
                src={helper.getImgUrl("edit.png")}
                className="cursor-pointer"
                width={20}
                alt="card"
              />
            </Button>
            <Button isIconOnly variant="bordered" size="sm" onClick={onRemove}>
              <img
                src={helper.getImgUrl("remove.png")}
                className="cursor-pointer"
                width={20}
                alt="card"
              />
            </Button>
          </div>
        </CardBody>
      </Card>
      <CardPopup
        card={card}
        title={t("card.EditCard")}
        disablePrimary={card.is_primary}
      />
    </>
  );
};

export default CardListItem;
