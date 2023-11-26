import { useRef, useState } from "react";
import { Service } from "../components/pageStructures/servicePage/ServicePage";
import { useCache } from "./useCustomContext";

export type ResponseContent = {
    json: any,
    text: string

    jsonError?: string,
    textError?: string
}
type DataResponse = ResponseContent & {
    status: number,

}

type handleFetchProps = {
    onError?: (error: string) => any,
    onData?: (data: ResponseContent) => any,

    service: Service
    //name: string //for debug
}

const getServiceUrl = (service: Service): string => {
    switch (service) {
        case "Authentication":
            return import.meta.env.VITE_AUTH_SERVICE;
        case "Product":
            return import.meta.env.VITE_PRODUCT_SERVICE;
    }
};

export type FetchProps = {
    endpoint: string;
    useCache?: boolean
    fetchParams?: RequestInit;
};

export function useFetch({ service, onError, onData }: handleFetchProps) {


    const { get: getCache, save: saveCache } = useCache();
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const abortedStack = useRef(0);


    const getDataResponse = async (data: Response): Promise<DataResponse> => {
        let res: DataResponse = {
            status: data.status,
            json: {},
            text: ""
        };

        try {
            const json = await data.clone().json();
            res.json = json;
        } catch (error) {
            res.jsonError = "Error parsing JSON";
            //console.log("Error json: "  + error);

        }

        try {
            const text = await data.clone().text();
            res.text = text;
        } catch (error) {
            res.textError = "Error getting text";
            //console.log("Error text: "  + error);

        }

        return res;
    };

    const doFetch = async ({ endpoint, fetchParams, useCache = false }: FetchProps) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setIsLoading(true);

        if (useCache) {
            const cachedData = getCache(endpoint);

            if (cachedData) {
                cachedData.error ? onError?.(cachedData.errorMsg ??= "Unknown Error") :
                    !!cachedData.data ? onData?.(cachedData.data) : onError?.("Unknown Cached Data");

                setIsLoading(false);
                return;
            }
        }

        await fetch(getServiceUrl(service) + endpoint, {
            ...fetchParams,
            headers: {
                ...fetchParams?.headers,
                // "Access-Control-Allow-Origin": "true",
            },
            signal: abortControllerRef.current.signal,
        })
            .then(getDataResponse)
            .then((data) => {
                if (data.status !== 200)
                    throw new Error("Error " + data.status + " \n" + data.text);

                onData?.(data);

                console.log("Set Cache: " + useCache);

                //if (useCache)
                saveCache(endpoint, { data, error: false });
            })
            .catch((e: Error) => {
                if (e.name === "AbortError") abortedStack.current++;
                onError?.(e.message);

                //if (useCache)
                saveCache(endpoint, { errorMsg: e.message, error: true });
            })
            .finally(async () => {
                if (abortedStack.current > 0) abortedStack.current--;
                else setIsLoading(false);
            });
    };

    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return { doFetch, isLoading };
}