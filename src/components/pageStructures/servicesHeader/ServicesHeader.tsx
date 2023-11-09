import "./ServicesHeader.css";
import ServiceMenu from "./servicesMenu/ServicesMenu.tsx";
import UserMenu from "./userMenu/UserMenu.tsx";


export default function ServicesHeader() {

  return (
    <div className="top-bar">
      <div className="bar-content">
        <ServiceMenu />
        <UserMenu />
      </div>
    </div>
  );
}
