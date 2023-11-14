/* eslint-disable react/prop-types */
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import i18n from "../i18n/index";

const LanguageSwitch = ({ isLogin }) => {
  const { darkMode, language, languagesList, changeLanguage } =
    useContext(GlobalContext);

  const setLanguage = ({ currentKey }) => {
    i18n.changeLanguage(currentKey.slice(0, 2));
    changeLanguage(currentKey);
    localStorage.setItem("language", currentKey);
    window.location.reload();
  };

  return (
    <Select
      disallowEmptySelection
      className="max-w-xs"
      radius="full"
      size="md"
      color={darkMode ? "default" : `${isLogin ? "default" : "primary"}`}
      selectedKeys={language}
      onSelectionChange={setLanguage}
      style={{ width: 190 }}
      labelPlacement="outside"
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <Avatar
              className="w-6 h-6"
              src={`https://flagcdn.com/${item.key
                .slice(item.key.length - 2)
                .toLowerCase()}.svg`}
            />
            <span>{item.props?.value}</span>
          </div>
        ));
      }}
    >
      {languagesList.map((l) => {
        return (
          <SelectItem
            key={l.value}
            value={l.label}
            startContent={
              <Avatar
                alt={l.label}
                className="w-6 h-6"
                src={`https://flagcdn.com/${l.value
                  .slice(l.value.length - 2)
                  .toLowerCase()}.svg`}
              />
            }
          >
            {l.label}
          </SelectItem>
        );
      })}
    </Select>
  );
};

export default LanguageSwitch;
