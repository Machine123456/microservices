import { useEffect, useRef, useState } from "react";
import "./ServicesList.css";
import ServiceDropDown from "../serviceDropDown/ServiceDropDown";

type Endpoint = {
  path: string;
  requiredRole: string; // "ADMIN", "USER", ""
}

export type MappingResponse = {
  imageData: string;
  endpoints: Endpoint[];
  bridgeAdress: string;
}


export default function ServicesList() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [servicesMap, setServicesMaps] = useState<Record<string,MappingResponse>>();

  useEffect(() => {
    fetchMapping();
  },[]);

  async function fetchMapping() {
    return fetch(import.meta.env.VITE_AUTH_SERVER + "/auth/getServicesMapping")
      .then((response) => response.json())
      .then((map) => {
        //Map<String, MappingResponse>
        if (!map || Object.keys(map).length === 0) 
          return;
        
        setServicesMaps(map as Record<string,MappingResponse>);
      })
      .catch((error) => {
        console.error("Error fetching mapps: ", error);
      });
  }

  return (
    <div className="services-list" ref={listRef}>
      {servicesMap && Object.entries(servicesMap).map(([serviceName, serviceMapping]) => {
       //return <div key={serviceName}> {serviceName} </div> 
       return <ServiceDropDown key={serviceName} serviceName={serviceName} serviceMapping={(serviceMapping as MappingResponse)} />;
      })}
  
    </div>
  );
}

/*

function updateCurrentUrls() {
    var links = document.getElementById("servicesWrapper").querySelectorAll("a");

    links.forEach(function (link) {

        var linkUrl = new URL(link.getAttribute("href"), window.location.href);

        if (!areHostnamesEqual(linkUrl.hostname, window.location.hostname)) {

            link.addEventListener("click", function (event) {
                event.preventDefault();
                redirectWithToken(event.target.href);
            });
        }
        else {
            if (linkUrl.port == window.location.port && linkUrl.pathname === window.location.pathname) {
                // Disable the link by preventing the default behavior
                link.addEventListener("click", function (event) {
                    event.preventDefault();
                });

                // Optionally, you can style the disabled link
                link.style.color = "gray";
                link.style.textDecoration = "none";
                link.style.cursor = "default";
            }
        }

        function areHostnamesEqual(hostname1, hostname2) {

            hostname1 = hostname1.toLowerCase();
            hostname2 = hostname2.toLowerCase();

            if (hostname1 === hostname2) return true;

            if ((hostname1 === "localhost" && hostname2 === "127.0.0.1") ||
                (hostname1 === "127.0.0.1" && hostname2 === "localhost")) {
                return true;
            }

            return false;
        }
    });
}



*/
