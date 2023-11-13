/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import helper from "../utils/helper";
import { useTranslation } from "react-i18next";

/* eslint-disable react/prop-types */
const CardItem = ({ holder, nr }) => {
  const { t } = useTranslation();

  const getCardType = () => {
    let re = new RegExp("^4");
    if (nr.match(re) !== null) return "visa";

    re = new RegExp("^(34|37)");
    if (nr.match(re) !== null) return "amex";

    re = new RegExp("^5[1-5]");
    if (nr.match(re) !== null) return "mastercard";

    re = new RegExp("^6011");
    if (nr.match(re) !== null) return "discover";

    return "visa";
  };

  return (
    <div className="card-item">
      <div className="card-item__side -front">
        <div className="card-item__cover">
          <img
            src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${Math.floor(
              Math.random() * 25 + 1
            )}.jpeg`}
            className="card-item__bg"
            alt="Card Background"
          />
        </div>
        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img
              src={helper.getImgUrl("chip.png")}
              className="card-item__chip"
              alt="Credit Card Chip"
            />
            {nr ? (
              <div className="card-item__type">
                <img
                  src={helper.getImgUrl(`${getCardType()}.png`)}
                  alt={`${getCardType()} Logo`}
                  className="card-item__typeImg"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          {nr ? (
            <>
              <div className="card-item__number flex justify-around w-full">
                {helper.getCardNumber(nr).map((v, i) => {
                  return <span key={i + 20}>{v}</span>;
                })}
              </div>
              <div className="card-item__content">
                <label className="card-item__info">
                  <div className="card-item__holder">{t("card.CardHolder")}</div>
                  <div className="card-item__name">{holder}</div>
                </label>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CardItem);
