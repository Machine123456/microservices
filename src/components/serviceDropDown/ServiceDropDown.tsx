import { UserRole, useUserContext } from "../../context/UserContext";
import DropDownMenu from "../dropDownMenu/DropDownMenu";
import "./ServiceDropDown.css";

interface Endpoint {
  path: string;
  requiredRole: string; // "ADMIN", "USER", ""
}

export interface MappingResponse {
  imageData: string;
  endpoints: Endpoint[];
  bridgeAdress: string;
}

interface ServiceDropDownProps extends React.HTMLAttributes<Element> {
  serviceName: string;
  serviceMapping: MappingResponse;
}

export default function ServiceDropDown({
  serviceName,
  serviceMapping,
}: ServiceDropDownProps) {
  let { user } = useUserContext();

  function getHeadOfPath(path: string) {
    const parts = path.split("/");
    return parts.length > 1 ? parts[parts.length - 1] : path;
  }

  function displayLink(linkReq: String): boolean {
    switch (linkReq) {
      case "ADMIN":
        return user.userRole === UserRole.Admin;
      case "USER":
        return user.userRole != UserRole.None;
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
              <div key={endpoint.path} className="dropdown-item">
                <a href={serviceMapping.bridgeAdress + "/" + endpoint.path}>
                  {getHeadOfPath(endpoint.path)}
                </a>
              </div>
            );
        })}
    </DropDownMenu>
  
  );
}
