import { Context, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { RegValidationsContext } from "../context/RegValidationsContext";
import { LanguageContext } from "../context/LanguageContext";
import { CacheContext } from "../context/CacheContext";

export const checkContext = <T>(context:Context<T>) => {
    const contextObj = useContext(context);
    if (contextObj === undefined) {
        throw new Error("Context " + context.displayName + " must be used within a Provider");
    }
    return contextObj;
}

export const useTheme = () =>  checkContext(ThemeContext);
export const useUser = () => checkContext(UserContext);
export const useRegValidations = () => checkContext(RegValidationsContext);
export const useRegValidation = (fieldName:string) => { 
    const validations = useRegValidations(); 
    return {isLoading: validations.isLoading, hasError: validations.hasError, fieldValidations: validations.fieldsValidations.find(p => p.fieldName === fieldName)?.validations};
}
export const useLanguage = () => checkContext(LanguageContext); 
export const useCache = () => checkContext(CacheContext);


/* 
import { {contextName}Context } from "react";

type {contextName}ContextValues = {
    
};

type {contextName}ProviderProps = {
  children: React.ReactNode;
  // add any custom props, but don't have to specify `children`
};

const defaultContext: {contextName}ContextValues = {

};

export const {contextName}Context = createContext<{contextName}ContextValues>(defaultContext);

export const {contextName}Provider = ({ children }: {contextName}ProviderProps) => {
  

  const contextValues: {contextName}ContextValues = {

  };

  return (
    <{contextName}Context.Provider value={contextValues}>
      {children}
    </{contextName}Context.Provider>
  );
};


*/

 