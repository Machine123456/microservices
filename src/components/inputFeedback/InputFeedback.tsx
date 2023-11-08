import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "./InputFeedback.css";
import { useShake } from "./InputFeedback.hooks";
import Feedback from "../utils/feedback/Feedback";


type InputFeedbackProps = {
    type?: React.HTMLInputTypeAttribute,
    validate: (value: any) => string,
    onChange?: (value: string) => void,
    name: string,
    placeHolder: string
  }

  export type InputFeedbackRef = {
    isValid: boolean
    value: string
    toggleShake: () => void
  }


const InputFeedback = forwardRef<InputFeedbackRef,InputFeedbackProps>(({ type = "text",name,placeHolder, validate, onChange }, ref) => {

    const [value,setValue] = useState<any>("");
    const [feedback,setFeedback] = useState<any>("");

    const {shake, toggleShake} = useShake();

    useEffect(() => {
      setFeedback(validate(value));
    }, 
    [validate])

    useEffect(()=> {
        onChange?.(value);
    }, [value]);
    
    useImperativeHandle(ref, () => ({
        isValid,
        value: value,
        toggleShake
      }));
    
    const isValid = feedback === "" && value != "";

    const handleChange = (newValue:any) => {
        setValue(newValue);
        setFeedback(validate(newValue));
    }

    return (
        <div className={"field " + (isValid ? "" : "invalid")}>
            <input className={shake ? "shake": ""} type={type} name={name} placeholder={placeHolder} onChange={(e) => handleChange(e.target.value)}/>
            <Feedback str={feedback} />
        </div>
    );

});

export default InputFeedback;
