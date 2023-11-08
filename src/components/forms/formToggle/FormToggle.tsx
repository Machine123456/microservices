import "./FormToggle.css";
import RegistrationForm from "../registrationForm/RegistrationForm";
import LoginForm from "../loginForm/LoginForm";
import { capitalizeFirstLetter } from "../../../utils/Funcs";
import { FormType, useToggle } from "./FormToggle.hooks";
import { useState } from "react";
import { useLanguage } from "../../../hooks/useCustomContext";

export default function FormToggle() {

const [enableBtn, setEnableBtn] = useState(false);
   const { currentForm, nextForm, toggle} = useToggle();
   const { textData } = useLanguage();

   const onToggle = () => {
    setEnableBtn(false);
    toggle();
   }

   const getFormBtnText = (form: FormType) :string => {
    switch (form) {
        case FormType.Login:
            return textData.loginForm.form.submitBtnText;
        case FormType.Registration:
            return textData.registrationForm.form.submitBtnText;
    }
   }

    const FormLink =
        (<div className="form-link" >
            <button disabled={!enableBtn} type="submit" className="submit-btn">
                {capitalizeFirstLetter(getFormBtnText(currentForm).toLowerCase())}
            </button>
            <a onClick={onToggle}>{getFormBtnText(nextForm).toUpperCase()}</a>

        </div >);

    switch (currentForm) {
        case FormType.Login:
            return <LoginForm submitButton={FormLink} onChange={setEnableBtn} />
        case FormType.Registration:
            return <RegistrationForm submitButton={FormLink} onChange={setEnableBtn} />
        default:
            return FormLink;
    }

}