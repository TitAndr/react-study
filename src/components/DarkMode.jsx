/* eslint-disable react/prop-types */
import { Switch } from "@nextui-org/react";
import Sun from "./Icons/Sun";
import Moon from "./Icons/Moon";
import { GlobalContext } from "../context/GlobalState";
import { useContext } from "react";

const DarkMode = ({ mobile }) => {
  const { darkMode, switchTheme } = useContext(GlobalContext);

  const switchThemeMode = (value) => {
    switchTheme(value);
    localStorage.setItem("darkMode", value);
  };

  return (
    <Switch
      size="lg"
      className={`${!mobile ? "hidden" : ""} ${
        mobile ? "min-[420px]:hidden" : "min-[420px]:flex"
      }`}
      isSelected={darkMode}
      onValueChange={switchThemeMode}
      color="secondary"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <Moon className={className} />
        ) : (
          <Sun className={className} />
        )
      }
    />
  );
};

export default DarkMode;
