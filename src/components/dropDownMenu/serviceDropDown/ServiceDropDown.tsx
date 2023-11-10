import { UserRole } from "../../../context/UserContext";
import { useUser } from "../../../hooks/useCustomContext";
import { Service, servicesData } from "../../../utils/servicesData";
import { getServiceViewInfo } from "../../pageStructures/servicePage/ServicePage";
import DropDownMenu from "../DropDownMenu";
import "./ServiceDropDown.css";
import { useState } from "react";

type ServiceDropDownProps = {
  service: Service;
};

export default function ServiceDropDown({ service }: ServiceDropDownProps) {
  const [active, setActive] = useState(false);
  let { user } = useUser();

  const serviceData = servicesData[service];

  function displayLink(linkReq: UserRole): boolean {
    switch (linkReq) {
      case UserRole.Admin:
        return user.role === UserRole.Admin;
      case UserRole.User:
        return user.role != UserRole.None;
      default:
        return true;
    }
  }

  return (
    <DropDownMenu
      imgSrc={serviceData.serviceImgPath}
      imgAlt={service}
      active={active}
      onToggle={setActive}
    >
      {serviceData.serviceViews.map((viewName, index) => {
        const info = getServiceViewInfo(service, viewName);

        if (displayLink(info.requiredRole))
          return (
            <div key={index} className="service-endpoint">
              <a href={getServiceViewInfo(service,viewName).location}>
                {viewName}
              </a>
            </div>
          );
      })}
    </DropDownMenu>
  );
}
