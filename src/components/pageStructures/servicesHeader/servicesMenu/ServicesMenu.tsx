import "./ServicesMenu.css";
import ServiceDropDown from "../../../dropDownMenu/serviceDropDown/ServiceDropDown";
import { ServicesList } from "../../servicePage/ServicePage";

export default function ServiceMenu() {
  return (
    <div className="services-list">
      {
      
      ServicesList.map((service,index) => {
            //return <div key={serviceName}> {serviceName} </div> 
            return <ServiceDropDown key={index}  service={service} />;
          })

      }

    </div>
  );
}
