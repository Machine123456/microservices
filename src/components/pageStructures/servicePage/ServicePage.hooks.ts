import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../hooks/useCustomContext";
import { FetchProps, useFetch } from "../../../hooks/useFetch";
import { Service } from "./ServicePage";
import { removeLastChar } from "../../../utils/funcs";

type UseDataFetchProps = {
    service: Service
    dataName: string
    dataParams?: Map<string, string>
}


export function useDataFetch<T>({ service, dataName, dataParams }: UseDataFetchProps) {

    type FetchType = "Fetch" | "Update" | "Delete" | "Refresh"


    const fetchTypeRef = useRef<FetchType>("Fetch");
    const [data, setData] = useState<T>();
    const { token } = useUser();
    const { doFetch, isLoading } = useFetch({
        service,
        onData: ({ json }) => {
            try {
                switch (fetchTypeRef.current) {
                    case "Refresh":
                    case "Update":
                    case "Fetch": {
                        const dataRes = json as T;
                        setData(dataRes);
                        return;
                    }
                    case "Delete": {
                        setData(undefined);
                        return;
                    }
                }
            }
            catch (error) {
                console.error("Error parsing", fetchTypeRef.current, dataName, error);
                setData(undefined);
            }
        },
        onError: (error) => {
            console.error("Error fetching", fetchTypeRef.current, dataName, error);
            setData(undefined);
        },
    });

    const getEndPoint = () => {
        let endpoint = "/" + dataName;

        if (dataParams) {
            endpoint += "?"
            dataParams.forEach((name, value) => endpoint += name + "=" + value + "&");
            endpoint = removeLastChar(endpoint) ?? endpoint;
        }
        return endpoint;
    }

    const fetchData = (fetchType: FetchType, fetchProps: FetchProps) => {
        fetchTypeRef.current = fetchType;
        doFetch({
            ...fetchProps,
            fetchParams: {
                ...fetchProps.fetchParams,
                headers: {
                    ...fetchProps.fetchParams?.headers,
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            },
        });
    }

    const refreshData = () => fetchData("Refresh", {
        endpoint: getEndPoint(),
        useCache: false
    });

    const updateData = (body: {}) => fetchData("Update", {
        endpoint: getEndPoint(),
        useCache: false,
        fetchParams: {
            method: "PUT",
            body: JSON.stringify(body)
        }
    });

    const deleteData = () =>
        fetchData("Delete", {
            endpoint: getEndPoint(),
            useCache: false,
            fetchParams: {
                method: "DELETE",
            }
        });


    useEffect(() =>
        fetchData("Fetch", {
            endpoint: getEndPoint(),
            useCache: true
        })
        , [token, dataName, dataParams]);

    return { data, isLoading, refreshData, updateData, deleteData };
}