import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Avatar,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useContext, useState } from "react";
import LanguageSwitch from "./LanguageSwitch";
import DarkMode from "./DarkMode";
import Menu from "./Menu";
import helper from "../utils/helper";
import { GlobalContext } from "../context/GlobalState";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div className="header w-full">
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        isBordered
      >
        <NavbarContent className="smd:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarContent className="hidden smd:flex gap-4" justify="center">
          <NavbarItem className="w-[130px]">
            <LanguageSwitch />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          <NavbarItem>
            <DarkMode />
          </NavbarItem>
          <NavbarItem>
            <Avatar
              onClick={() => navigate("/profile")}
              isBordered
              as="button"
              color="success"
              size="sm"
              src={
                user?.photo || helper.getImgUrl(`${user?.gender || "male"}.png`)
              }
            />
          </NavbarItem>
        </NavbarContent>

        <Menu mobile={true} menuChange={() => setIsMenuOpen(!isMenuOpen)} />
      </Navbar>
    </div>
  );
};

export default Header;
