import { createContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

type FieldsValidations = {
    fieldName: string,
    validations: {
        regexString: string,
        errorMsg: string
    }[]
}[];

type RegValidationsContextValues = {
    fieldsValidations: FieldsValidations
    hasError: boolean
    isLoading: boolean
}

type RegValidationProviderProps = {
    children: React.ReactNode;
}

const defaultContext: RegValidationsContextValues = {
    fieldsValidations: [],
    hasError: false,
    isLoading: false,
};


export const RegValidationsContext = createContext<RegValidationsContextValues>(defaultContext);

export const RegValidationsProvider = ({ children }: RegValidationProviderProps) => {

    const [fieldsValidations, setFieldsValidations] = useState<FieldsValidations>(defaultContext.fieldsValidations);
    const [hasError, setHasError] = useState<boolean>(defaultContext.hasError);

    const { doFetch, isLoading } = useFetch({
        name: "validations",
        onError: (error) => {
            console.error("Error fetching inputs validations: ", error);
            setFieldsValidations(defaultContext.fieldsValidations);
            setHasError(true);
        },
        onData: (data) => {
            try {
                data.json().then((userRequirements) => { // userRequirements is a Map<String,Map<String,String>>
                
                    if (!userRequirements)
                        throw new Error("Invalid userRequirements json data");

                    const requirementsRecord = (userRequirements as Record<string, Record<string, string>>);

                    var fieldsVals: FieldsValidations =
                        Object.entries(requirementsRecord).map(([fieldName, requirementsMap]) => ({
                            fieldName,
                            validations: Object.entries(requirementsMap).map(([regexString, errorMsg]) => ({
                                regexString,
                                errorMsg,
                            })),
                        }));

                    console.log("Inputs validations loaded ");
                    
                    setFieldsValidations(fieldsVals);
                    setHasError(false);
                });
            }
            catch (error) {
                console.error("Error parsing inputs validations: ", error);
                setFieldsValidations(defaultContext.fieldsValidations);
                setHasError(true);
            }
        }
    });

    useEffect(() => {
        doFetch({
            url: import.meta.env.VITE_AUTH_SERVER + '/auth/getUserRequirements',
            fetchParams: {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        });
    }, []);


    const contextValues: RegValidationsContextValues = {
        fieldsValidations,
        hasError,
        isLoading,
      };

    return (
        <RegValidationsContext.Provider value={contextValues}>
            {children}
        </RegValidationsContext.Provider>
    );
};

