import { useRef, useState } from "react";
import { Service, getServiceUrl } from "../utils/servicesData";

type handleFetchProps = {
    onError?: (error: string) => any,
    onData?: (data: Response) => any,

    service: Service
    //name: string //for debug
}


export function useFetch({service, onError, onData}: handleFetchProps){

    type FetchProps = {
        endpoint: string
        fetchParams?: RequestInit
    }

    const [isLoading, setIsLoading] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);
    const abortedStack = useRef(0);

    const doFetch = async ({endpoint,fetchParams}:FetchProps) => {
        
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

/*        console.log("start fetch: " + name);*/
        
        setIsLoading(true);

        //await delay(1000); //overwrites abort signal if used here

        await fetch(getServiceUrl(service) + endpoint,{
            ...fetchParams,
            signal: abortControllerRef.current.signal,
        })
        .then(onData)
        .catch((e:Error) => {
            if(e.name === "AbortError")
                abortedStack.current ++;

            onError?.(e.message);
        })
        .finally(async () => {
            //await delay(1000); 
  
            if(abortedStack.current > 0) // is it was aborted do not stop loading
                abortedStack.current --;
            else setIsLoading(false);

        });

    };

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    return {doFetch, isLoading};
}