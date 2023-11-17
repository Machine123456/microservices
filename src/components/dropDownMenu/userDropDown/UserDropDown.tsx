import DropDownMenu from "../DropDownMenu";
import UserSettings from "./userSettings/UserSettings";
import "./UserDropDown.css";
import { User } from "../../../context/UserContext";
import LogoutBtn from "../../logoutBtn/LogoutBtn";
import LanguageSelector from "../../utils/enumSelector/languageSelector/LanguageSelector";
import ThemeToggle from "../../utils/toggleButton/themeToggle/ThemeToggle";
import { useState } from "react";

type UserDropDownProps = {
  user?: User;
};

export default function UserDropDown({ user }: UserDropDownProps) {

    const [active,setActive] = useState(false);
    
  
    return (
    <DropDownMenu  imgSrc="/user.png" active={active} onToggle={setActive} imgAlt="settings">
      <div className="user-content">
        {!user || user.name === "" ? (
          <>
            <ThemeToggle/>
            <LanguageSelector />
          </>
        ) : (
          <>
            <UserSettings {...user} />

            <div className="divider"></div>

            <ThemeToggle/>
            <LanguageSelector />
            
            <div className="divider"></div>
            <LogoutBtn onLogout={() => setActive(false)}/>

          </>
        )}

        
      </div>
    </DropDownMenu>
  );
}
