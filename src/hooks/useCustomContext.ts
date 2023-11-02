import { Context, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { RegValidationsContext } from "../context/RegValidationsContext";

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