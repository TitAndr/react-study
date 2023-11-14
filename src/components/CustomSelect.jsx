/* eslint-disable react/prop-types */
import { Select, SelectItem } from "@nextui-org/react";
import helper from "../utils/helper";
import { useTranslation } from "react-i18next";

function CustomSelect({
  label,
  value,
  list,
  defaultSelectedKeys,
  errorMessage,
  onSelectionChange,
}) {
  const { t } = useTranslation();

  return (
    <Select
      isRequired
      disallowEmptySelection
      label={label}
      className="max-w-xs"
      selectedKeys={value}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      defaultSelectedKeys={defaultSelectedKeys || [list[0].value]}
      onSelectionChange={({ currentKey }) =>
        onSelectionChange(currentKey || "")
      }
      renderValue={(items) => {
        return items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <img width={15} src={helper.getImgUrl(item.props?.src)} />
            <span>{t(`popup.${item.props?.value}`)}</span>
          </div>
        ));
      }}
    >
      {list.map((item) => (
        <SelectItem key={item.value} value={item.value} src={item.src}>
          <div className="flex gap-5">
            <img width={15} src={helper.getImgUrl(item.src)} />
            <span>{t(`popup.${item.value}`)}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}

export default CustomSelect;
