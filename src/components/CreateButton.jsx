/* eslint-disable react/prop-types */
import { Card, CardBody } from "@nextui-org/react";
import helper from "../utils/helper";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const CreateButton = ({ label, classes, onOpen }) => {
  const { darkMode } = useContext(GlobalContext);
  return (
    <>
      <Card
        className={`w-full hover:scale-105 ${classes || ""}`}
        isPressable
        onPress={onOpen}
      >
        <CardBody className={`items-center ${!darkMode ? "bg-[#F7F8FD]" : ""} justify-center`}>
          <img
            alt="d"
            width={50}
            height={50}
            className="object-cover"
            src={helper.getImgUrl("wallet-btn.svg")}
          />
          <p className="font-bold pt-3 text-[#4F46E5]">{label}</p>
        </CardBody>
      </Card>
    </>
  );
};

export default CreateButton;
