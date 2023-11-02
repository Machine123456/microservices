import ServicesList from "../servicesList/ServicesList.tsx";
import "./ServicesHeader.css";
import UserDropDown from "../userDropDown/UserDropDown.tsx";

export default function ServicesHeader() {

  return (
    <div className="top-bar">
      <ServicesList />
      <UserDropDown/>
    </div>
  );
}
