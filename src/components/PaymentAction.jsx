/* eslint-disable react/prop-types */
import { Card, CardBody } from "@nextui-org/react";
import helper from "../utils/helper";
import usePaymentPopup from "./Popups/PaymentPopup";
import { useTranslation } from "react-i18next";

const PaymentAction = ({ label, type }) => {
  const { t } = useTranslation();
  const { PaymentPopup, onOpen } = usePaymentPopup();

  return (
    <>
      <Card
        className="w-[85%] mobile:w-full desktop:max-w-[230px] desktop:min-w-[200px]"
        shadow="sm"
        isPressable
        onPress={onOpen}
      >
        <CardBody className="overflow-visible items-center">
          <img
            alt="d"
            width={100}
            height={100}
            className="object-cover"
            src={helper.getImgUrl(
              `${type === "income" ? "request" : "send"}-payment.svg`
            )}
          />
          <span className="font-bold pt-3 text-center">{label}</span>
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
