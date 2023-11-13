/* eslint-disable react/prop-types */
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import CardListItem from "./CardListItem";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import helper from "../utils/helper";
import { useTranslation } from "react-i18next";

const CardList = () => {
  const { t } = useTranslation();
  const { cards } = useContext(GlobalContext);

  return (
    <Card className="mobile:w-full laptop:min-w-[330px] h-[65%]">
      {cards.length !== 0 ? (
        <CardHeader className="px-[1.25rem] pb-0">
          <h1 className="m-0">{t("card.CardsList")}</h1>
        </CardHeader>
      ) : (
        <></>
      )}
      <CardBody className="justify-center py-2">
        {cards.length !== 0 ? (
          <div className="flex flex-col gap-2 overflow-y-auto justify-normal h-full py-2">
            {helper.sortBy(cards, "is_primary").map((card) => (
              <CardListItem
                key={card.id}
                card={card}
                disablePrimary={cards.length > 2}
              />
            ))}
          </div>
        ) : (
          <div className="text-[3rem] text-center italic text-default-500">
            {t("card.Empty")}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CardList;
