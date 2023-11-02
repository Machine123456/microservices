import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { capitalizeFirstLetter } from "../../utils/Funcs";
import Feedback from "../feedback/Feedback";
import "./InputFeedback.css";
import { useRegValidations } from "../../hooks/useCustomContext";


type InputFeedbackProps = {
    type?: React.HTMLInputTypeAttribute,
    name: string,
    onChange?: (state: InputState) => void,
  }

  export type InputFeedbackRef = {
    isValid: boolean
    value: string
    toggleShake: () => void
  }

  type InputState = {
    value: string
    feedback: string
  }

const InputFeedback = forwardRef<InputFeedbackRef,InputFeedbackProps>(({ type = "text", name, onChange }, ref) => {

    const {fieldsValidations,isLoading: isValidationsLoading} = useRegValidations();
    const [inputState,setInputState] = useState<InputState>({value:"",feedback:""});
    const [shake, setShake] = useState(false);

    useEffect(()=> {
        onChange?.(inputState);
    }, [inputState]);
    
    useImperativeHandle(ref, () => ({
        isValid,
        value: inputState.value,
        toggleShake
      }));

    const toggleShake = () => {
        
        setShake(false);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setShake(true);
            });
        });
    }

    const isValid = inputState.feedback === "";
    
    const validateField = (value:any): string => {
       
        if(isValidationsLoading || value.toString() == "")
            return "";

        var finalValidationMsg = "";

        fieldsValidations.forEach(({fieldName,validations}) => {  
            if(fieldName === name) {
                validations.forEach(({regexString,errorMsg}) => {
                    var regex = new RegExp(regexString);
                    if (!regex.test(value.toString()))
                        finalValidationMsg += errorMsg + "\n"  
                });
                return;
            }
        });

        return finalValidationMsg;
        
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        var feedbackMsg = validateField(e.target.value);

        setInputState(
            {
                value: e.target.value,
                feedback: feedbackMsg
            }
        );
    }


    return (
        <div className={"field " + (isValid ? "" : "invalid")}>
            <input className={shake ? "shake": ""} type={type} name={name} placeholder={capitalizeFirstLetter(name)} onChange={handleChange}/>
            <Feedback str={inputState.feedback} />
        </div>
    );

});

export default InputFeedback;
