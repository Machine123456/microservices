import { useEffect, useState } from "react";
import { useFetch } from "../../../../hooks/useFetch";

type Endpoint = {
  path: string;
  requiredRole: string; // "ADMIN", "USER", ""
}

export type MappingResponse = {
  imageData: string;
  endpoints: Endpoint[];
  bridgeAdress: string;
}

export function useMapps() {
  const [servicesMap, setServicesMaps] = useState<Record<string, MappingResponse>>();
  const { doFetch, isLoading } = useFetch({
    service: "Authentication",
    onError: (error) => {
      console.error("Error fetching mapps: ", error);
    },
    onData: (data) => {
      try {
        data.json().then((map) => {
          //Map<String, MappingResponse>
          if (!map || Object.keys(map).length === 0)
            return;

          setServicesMaps(map as Record<string, MappingResponse>);
        });
        /*console.log("Mapps fetched");*/
        
      }
      catch (error) {
        console.error("Error parsing mapps: ", error);
      }
    }
});

  useEffect(() => {
    doFetch({ endpoint: "getServicesMapping" });
  }, []);

  return { servicesMap, isLoading };
}