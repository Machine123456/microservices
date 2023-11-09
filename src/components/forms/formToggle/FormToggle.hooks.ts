import { useState } from "react";

export enum FormType {
    Login = "login",
    Registration = "registration",
}

export function useToggle(startFormType?: FormType){

    const formList: FormType[] = Object.values(FormType);
    const [currentFormIndex, setCurrentFormIndex] = useState(startFormType ? formList.findIndex((type) => type === startFormType) : 0 );

    const nextFormIndex = (currentFormIndex === formList.length - 1) ? 0 : currentFormIndex + 1;

    const nextForm = formList[nextFormIndex];
    const currentForm = formList[currentFormIndex]

    const toggle = () => {
        setCurrentFormIndex(nextFormIndex);
    }

    return {toggle, currentForm, nextForm};
    
}