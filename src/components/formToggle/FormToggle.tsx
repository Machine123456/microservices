import { useState } from "react";
import "./FormToggle.css";
import RegistrationForm from "../registrationForm/RegistrationForm";
import LoginForm from "../loginForm/LoginForm";
import { capitalizeFirstLetter } from "../../utils/Funcs";


enum FormType { 
    Login = "login", 
    Registration = "registration"
}


export default function FormToggle() {

    const [toggleForm, setToggleForm] = useState(0);
    const [enableBtn, setEnableBtn] = useState(false);

    const formTypes: FormType[] = Object.values(FormType);

    const currentForm = formTypes[toggleForm];

    const nextToggle = (prev: number) => { return (prev === formTypes.length - 1) ? 0 : prev + 1 };
    const nextForm = formTypes[nextToggle(toggleForm)];

    const toggle = () => {
        setToggleForm(nextToggle);
        setEnableBtn(false);
    }

    const FormLink = 
        (<div className="form-link" >
            
            <button disabled={!enableBtn} type="submit" className="submit-btn">
                {capitalizeFirstLetter(currentForm.toString().toLowerCase())}
            </button>
            <a onClick={toggle}>{nextForm.toString().toUpperCase()}</a>
           
        </div >);
    
    const onValidate = (valid : boolean) => setEnableBtn(valid);


    switch (currentForm) {
        case FormType.Login:
            return <LoginForm submitButton={FormLink} onChange={onValidate}/>
        case FormType.Registration:
            return  <RegistrationForm  submitButton={FormLink} onChange={onValidate}/>
        default:
            return FormLink;
    }

}