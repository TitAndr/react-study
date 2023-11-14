/* eslint-disable react/prop-types */
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import CardItem from "./CardItem";
import EyeFilledIcon from "./Icons/EyeFilledIcon";
import EyeSlashFilledIcon from "./Icons/EyeSlashFilledIcon";
import { useState } from "react";
import helper from "../utils/helper";
import { useTranslation } from "react-i18next";

const cardInfos = [
  {
    label: "Card No.",
    key: "card_number",
  },
  {
    label: "Expiry date",
    key: "expiry_date",
  },
  {
    label: "CVV",
    key: "cvv",
  },
];

const CardInfo = ({ card }) => {
  const { t } = useTranslation();
  const [CVVVisible, setCVVVisible] = useState(false);

  const toggleCVVVisibility = () => setCVVVisible(!CVVVisible);

  const formatValue = (key, item) => {
    if (key === "cvv") {
      return CVVVisible ? item[key] : "***";
    }
    if (key === "expiry_date") {
      return `${new Date(item[key]).getMonth() + 1}/${new Date(
        item[key]
      ).getFullYear()}`;
    }
    return item[key];
  };

  return (
    <Card className="mobile:w-full mobile:min-w-[330px]">
      <CardBody className="px-[1.25rem] pb-0">
        <CardItem holder={card?.holder} nr={card?.card_number} />
      </CardBody>
      <CardFooter
        className={`flex flex-col items-${
          !card ? "center" : "start"
        } justify-center px-[1.5rem] pt-0 min-h-[175px]`}
      >
        {card ? (
          <>
            <div className="flex justify-between w-full mb-4 items-center">
              <span className="font-bold text-[1.1rem]">{t("card.CardInformation")}</span>
              <span className="font-bold p-1 text-center uppercase text-red-500 border-solid border-3 rounded-large border-red-500 mobile:p-2">
                {t("card.PrimaryCard")}
              </span>
            </div>
            {cardInfos.map((i) => {
              return (
                <div className="flex justify-between w-full py-1" key={i.key}>
                  <span>{t(`card.${i.key}`)}</span>
                  <span className="flex gap-3 items-center justify-between">
                    {i.key === "cvv" && CVVVisible ? (
                      <EyeSlashFilledIcon
                        className="text-default-400 cursor-pointer text-[1.3rem]"
                        onClick={toggleCVVVisibility}
                      />
                    ) : i.key === "cvv" && !CVVVisible ? (
                      <EyeFilledIcon
                        className="text-default-400 cursor-pointer text-[1.3rem]"
                        onClick={toggleCVVVisibility}
                      />
                    ) : i.key === "card_number" ? (
                      <img
                        width={23}
                        className="cursor-pointer"
                        src={helper.getImgUrl("copy.png")}
                        onClick={() =>
                          navigator.clipboard.writeText(card[i.key])
                        }
                        alt="copy"
                      />
                    ) : (
                      ""
                    )}
                    {formatValue(i.key, card)}
                  </span>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-[3rem] italic text-default-500">{t("card.NoCard")}</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CardInfo;
