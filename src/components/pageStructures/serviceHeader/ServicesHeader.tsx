import ServicesList from "./servicesList/ServicesList.tsx";
import "./ServicesHeader.css";
import UserDropDown from "../../dropDownMenu/userDropDown/UserDropDown.tsx";

export default function ServicesHeader() {

  return (
    <div className="top-bar">
      <div className="bar-content">
        <ServicesList />
        <UserDropDown />
      </div>
    </div>
  );
}
