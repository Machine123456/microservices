
import { UserRole, useUserContext } from "../../context/UserContext.tsx";
import DropDownMenu from "../dropDownMenu/DropDownMenu.tsx";
import LoginForm from "../loginForm/LoginForm.tsx";
import ServicesList from "../servicesList/ServicesList.tsx";
import UserSettings from "../userSettings/UserSettings.tsx";
import "./ServicesHeader.css";

export default function ServicesHeader() {

  let {user} = useUserContext();
  

  return (
    <div className="top-bar">
      <ServicesList />

      <div className="right-items">
        <DropDownMenu imgSrc="/user.png" >
          {user.userRole === UserRole.None ? <LoginForm /> : <UserSettings />}
        </DropDownMenu>
      </div>
    </div>
 
  );
}
