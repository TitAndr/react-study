/* eslint-disable react/prop-types */
import { Input } from "@nextui-org/react";
import MailIcon from "./Icons/MailIcon";
import LockIcon from "./Icons/LockIcon";

const CustomInput = ({
  label,
  type,
  value,
  isRequired,
  errorMessage,
  onChange,
  endContent,
  startContent,
  classNames,
  min,
  max,
  size,
  placeholder,
  isDisabled,
}) => {
  const getIcon = (icon) => {
    if (typeof icon !== "string") {
      return icon;
    }

    switch (icon) {
      case "MailIcon":
        return (
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        );

      case "LockIcon":
        return (
          <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        );

      default:
        return "";
    }
  };

  return (
    <Input
      type={type || "text"}
      isRequired={isRequired}
      label={label}
      variant="bordered"
      isDisabled={isDisabled}
      value={value}
      size={size}
      min={min}
      max={max}
      placeholder={placeholder}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      onChange={onChange}
      endContent={getIcon(endContent)}
      startContent={getIcon(startContent)}
      classNames={classNames}
    />
  );
};

export default CustomInput;
