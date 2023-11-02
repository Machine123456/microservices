import { createContext, useEffect, useRef, useState } from "react";

type FieldValidations = {
    fieldName: string,
    validations: {
        regexString: string,
        errorMsg: string
    }[]
}

type RegValidationsContextValues = {
    fieldsValidations: FieldValidations[]
    isLoading: boolean;
}

type RegValidationProviderProps = {
    children: React.ReactNode;
}

const defaultContext: RegValidationsContextValues = {
    fieldsValidations: [],
    isLoading: true
};


export const RegValidationsContext = createContext<RegValidationsContextValues>(defaultContext);

export const RegValidationsProvider = ({ children }: RegValidationProviderProps) => {

    const [fieldsValidations, setFieldsValidations] = useState<FieldValidations[]>(defaultContext.fieldsValidations);
    const [isLoading, setIsLoading] = useState<boolean>(defaultContext.isLoading);

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        const validationsData: FieldValidations[] = await fetch(
            import.meta.env.VITE_AUTH_SERVER + '/auth/getUserRequirements',
            {
                signal: abortControllerRef.current?.signal,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.json())
            .then((userRequirements) => { // userRequirements is a Map<String,Map<String,String>>

                if (!userRequirements)
                    return defaultContext.fieldsValidations;

                const requirementsRecord = (userRequirements as Record<string, Record<string, string>>)

                var fieldsVals: FieldValidations[] = Object.entries(requirementsRecord).map(
                    ([fieldName, requirementsMap]) => ({
                        fieldName,
                        validations: Object.entries(requirementsMap).map(([regexString, errorMsg]) => ({
                            regexString,
                            errorMsg,
                        })),
                    })
                );
                console.log("Inputs validations loaded ");
                return fieldsVals;

            })
            .catch((error) => {

                console.error("Error adding feedback reactions: ", error);
                return defaultContext.fieldsValidations;
            });

        //await (new Promise(resolve => setTimeout(resolve,3000)));

        setFieldsValidations(validationsData);
        setIsLoading(false);
    }

    const contextValues: RegValidationsContextValues = {
        fieldsValidations,
        isLoading,
    };

    return (
        <RegValidationsContext.Provider value={contextValues}>
            {children}
        </RegValidationsContext.Provider>
    );
};

