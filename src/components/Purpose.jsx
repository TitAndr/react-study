/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, CardHeader, CardBody, Progress } from "@nextui-org/react";
import helper from "../utils/helper";
import CreateButton from "./CreateButton";
import { useContext, useLayoutEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import usePurposePopup from "./Popups/PurposePopup";
import { useTranslation } from "react-i18next";

function formatProgress(value, total) {
  return ((value / total) * 100).toFixed(0);
}

const Purpose = ({ purpose }) => {
  const { t } = useTranslation();
  const currentAmount = purpose?.current_amount || 0;
  const { currentWallet } = useContext(GlobalContext);
  const [progressValue, setProgressValue] = useState(() =>
    formatProgress(currentAmount, purpose?.amount || 1)
  );

  const { PurposePopup, onOpen } = usePurposePopup();

  const isCompleted = () => {
    return purpose
      ? !!purpose.amount && purpose.amount <= purpose.current_amount
      : false;
  };

  useLayoutEffect(() => {
    setProgressValue(formatProgress(currentAmount, purpose?.amount || 1));
  }, [purpose]);

  return (
    <>
      {purpose ? (
        <Card
          className="w-[80vw] tablet:max-w-[280px] tablet:w-full min-h-[155px]"
          isPressable
          onPress={onOpen}
        >
          <CardHeader className="flex flex-col items-start gap-3 pb-0 relative">
            <div className="flex gap-3 items-center">
              <img
                alt="purpose"
                width={40}
                src={purpose?.photo || helper.getImgUrl("purpose.png")}
              />
              <span className="m-none text-[1rem] w-[65%] font-semibold tablet:max-w-[130px] text-ellipsis overflow-hidden">
                {purpose.name}
              </span>
            </div>
            <span className="m-none text-[1rem] text-default-500">
              {t("purpose.LastPaid")}: {helper.timeSince(purpose.last_paid)}
            </span>
            {isCompleted() ? (
              <img
                className="absolute top-2 right-1"
                width={50}
                src={helper.getImgUrl("completed.png")}
                alt="completed"
              />
            ) : (
              <></>
            )}
          </CardHeader>
          <CardBody className="px-5 py-3">
            <Progress
              label={
                <p className="max-w-[100px]">
                  <span className="text-1rem text-yellow-500">
                    {currentWallet.currency}
                    {currentAmount <= purpose.amount
                      ? currentAmount
                      : purpose.amount}{" "}
                  </span>
                  /
                  <span className="text-yellow-200 text-[.8rem]">
                    {" "}
                    {currentWallet.currency}
                    {purpose.amount}{" "}
                  </span>
                </p>
              }
              size="md"
              value={progressValue <= 100 ? progressValue : 100}
              showValueLabel={true}
              classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: `${
                  isCompleted()
                    ? "bg-success"
                    : "bg-gradient-to-r from-pink-500 to-yellow-500"
                }`,
                label: "tracking-wider font-medium text-default-600",
                value: "text-foreground/80",
              }}
            />
          </CardBody>
        </Card>
      ) : (
        <CreateButton
          classes={
            "h-full w-[80vw] tablet:max-w-[280px] tablet:w-full min-w-[220px] min-h-[155px]"
          }
          label={t("purpose.CreatePurpose")}
          onOpen={onOpen}
        />
      )}
      <PurposePopup purpose={purpose} title="Edit purpose" />
    </>
  );
};

export default Purpose;
