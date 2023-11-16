/* eslint-disable react/prop-types */
import { Card, CardBody } from "@nextui-org/react";
import helper from "../utils/helper";
import usePaymentPopup from "./Popups/PaymentPopup";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const PaymentAction = ({ label, type, disable }) => {
  const { t } = useTranslation();
  const { setNotification } = useContext(GlobalContext);
  const { PaymentPopup, onOpen } = usePaymentPopup();

  const openPayment = () => {
    if (disable) {
      setNotification({ type: "error", message: "popup.ErrorPayment" });
      return;
    }

    onOpen();
  };

  return (
    <>
      <Card
        className="w-[85%] max-[490px]:w-[40vw] mobile:w-[50vw] desktop:max-w-[230px] desktop:min-w-[200px]"
        shadow="sm"
        isPressable
        onClick={openPayment}
      >
        <CardBody className="overflow-visible items-center">
          <img
            alt="d"
            width={100}
            height={100}
            className="object-cover max-[490px]:w-[60px]"
            src={helper.getImgUrl(
              `${type === "income" ? "request" : "send"}-payment.svg`
            )}
          />
          <span className="font-bold whitespace-nowrap pt-3 text-center max-[490px]:text-[.8rem] max-[345px]:whitespace-break-spaces">{label}</span>
        </CardBody>
      </Card>
      <PaymentPopup
        type={type}
        title={t(`popup.${type === "income" ? "Request" : "Send"}Payment`)}
      />
    </>
  );
};

export default PaymentAction;
