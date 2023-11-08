import { UserRole } from "../../../context/UserContext";
import { useUser } from "../../../hooks/useCustomContext";
import DropDownMenu from "../DropDownMenu";
import { MappingResponse } from "../../pageStructures/serviceHeader/servicesList/ServicesList.hooks";
import "./ServiceDropDown.css";

type ServiceDropDownProps = {
  serviceName: string;
  serviceMapping: MappingResponse;
}

export default function ServiceDropDown({
  serviceName,
  serviceMapping,
}: ServiceDropDownProps) {
  let { user } = useUser();

  function getHeadOfPath(path: string) {
    const parts = path.split("/");
    return parts.length > 1 ? parts[parts.length - 1] : path;
  }

  function displayLink(linkReq: String): boolean {
    switch (linkReq) {
      case "ADMIN":
        return user.role === UserRole.Admin;
      case "USER":
        return user.role != UserRole.None;
      default:
        return true;
    }
  }

  return (

    <DropDownMenu
      imgSrc={serviceMapping ? serviceMapping.imageData : undefined}
      imgAlt={serviceName}
    >
      {serviceMapping &&
        serviceMapping.endpoints.map((endpoint) => {
          if (displayLink(endpoint.requiredRole))
            return (
              <div key={endpoint.path} className="service-endpoint">
                <a href={serviceMapping.bridgeAdress + "/" + endpoint.path}>
                  {getHeadOfPath(endpoint.path)}
                </a>
              </div>
            );
        })
      }
    </DropDownMenu>

  );
}