/* eslint-disable react/prop-types */
import { Card, CardBody } from "@nextui-org/react";
import helper from "../utils/helper";
import { useTranslation } from "react-i18next";

const TotalInfo = ({ title, amount, image }) => {
  const { t } = useTranslation();
  return (
    <Card className="desktop:max-w-[280px] mobile:w-full mobile:min-w-[230px]">
      <CardBody className="py-0 px-[1.25rem] justify-start flex-row items-center gap-4">
        <img alt="hand" width={50} src={helper.getImgUrl(image)} />
        <div className="flex flex-col items-start py-2">
          <span className="text-[1rem]">{t(`main.${title}`)}</span>
          <span className="text-[1.5rem] font-bold">{amount}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default TotalInfo;
