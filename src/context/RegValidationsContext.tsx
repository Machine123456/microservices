import { createContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { FieldValidations } from "../utils/models";

type RegValidationsContextValues = {
  fieldsValidations: FieldValidations[];
  hasError: boolean;
  isLoading: boolean;
};

type RegValidationProviderProps = {
  children: React.ReactNode;
};

const defaultContext: RegValidationsContextValues = {
  fieldsValidations: [],
  hasError: false,
  isLoading: false,
};

export const RegValidationsContext =
  createContext<RegValidationsContextValues>(defaultContext);

export const RegValidationsProvider = ({
  children,
}: RegValidationProviderProps) => {
  const [fieldsValidations, setFieldsValidations] = useState<
    FieldValidations[]
  >(defaultContext.fieldsValidations);
  const [hasError, setHasError] = useState<boolean>(defaultContext.hasError);

  const { doFetch, isLoading } = useFetch({
    service: "Authentication",
    onError: (error) => {
      console.error("Error fetching inputs validations:", error);
      setFieldsValidations(defaultContext.fieldsValidations);
      setHasError(true);
    },
    onData: ({json}) => {
      try {
        const fieldsRecords = json as Record<string,Record<string, string>>;
        
        const fieldsVals: FieldValidations[] = 
        Object.entries(fieldsRecords).map(([fieldName, fieldValidations]) => {
          return {
            fieldName,
            validations: Object.entries(fieldValidations)
              .map(([regexString, errorMsg]) => { return {regexString,errorMsg} })
          };
        });

        //console.log("Inputs validations loaded ");
        setFieldsValidations(fieldsVals);
        setHasError(false);

      } catch (error) {
        console.error("Error parsing inputs validations:", error);
        setFieldsValidations(defaultContext.fieldsValidations);
        setHasError(true);
      }
    },
  });

  useEffect(() => {
    doFetch({
      useCache: true,
      endpoint: "request/getUserRequirements",
      fetchParams: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
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
