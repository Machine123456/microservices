import { Link } from "react-router-dom";
import { hasAuthorities } from "../../../context/UserContext";
import { useUser } from "../../../hooks/useCustomContext";
import { Service, getUserServiceLinks, servicesData } from "../../pageStructures/servicePage/ServicePage";
import DropDownMenu from "../DropDownMenu";
import "./ServiceDropDown.css";
import { useState } from "react";
import { getHeadOfPath } from "../../../utils/funcs";

type ServiceDropDownProps = {
  service: Service;
};

export default function ServiceDropDown({ service }: ServiceDropDownProps) {
  const [active, setActive] = useState(false);
  let { user } = useUser();

  const serviceData = servicesData[service];
  const enable:boolean = hasAuthorities(user,...serviceData.requiredAuthorities);

  return (<>
    <DropDownMenu
      imgSrc={serviceData.serviceImgPath}
      imgAlt={service}
      active={active}
      onToggle={setActive}
      enable={enable}
    >
      {
        enable &&
        getUserServiceLinks(user, service).map(( linkPath, index) => {
            return (
              <div key={index} className="service-endpoint">
                <Link to={linkPath} onClick={() => setActive(false)}> {getHeadOfPath(linkPath)}</Link>
              </div>
            );
        })}
    </DropDownMenu>
  </>

  );
}
