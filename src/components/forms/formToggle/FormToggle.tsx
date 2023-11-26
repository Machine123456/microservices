import "./FormToggle.css";
import RegistrationForm from "../registrationForm/RegistrationForm";
import LoginForm from "../loginForm/LoginForm";
import { FormType, useToggle } from "./FormToggle.hooks";
import { useState } from "react";
import { useLanguage } from "../../../hooks/useCustomContext";
import { TextBtn1, TextBtn2 } from "../../utils/buttons/customBtn/CustomBtn";

type FormToggleProps = {
  startForm: FormType;
  onSucess?: () => any;
};

export default function FormToggle({ startForm, onSucess }: FormToggleProps) {
  const [enableBtn, setEnableBtn] = useState(false);
  const { currentForm, nextForm, toggle } = useToggle(startForm);
  const { textData } = useLanguage();

  const onToggle = () => {
    setEnableBtn(false);
    toggle();
  };

  const getFormBtnText = (form: FormType): string => {
    switch (form) {
      case FormType.Login:
        return textData.loginForm.form.submitBtnText;
      case FormType.Registration:
        return textData.registrationForm.form.submitBtnText;
    }
  };

  const handleResult = (sucess: boolean) => sucess && onSucess?.();

  const FormLink = (
    <div className="form-link">
      <TextBtn1 disabled={!enableBtn} type="submit" text={getFormBtnText(currentForm)} />
      <TextBtn2 onClick={onToggle} text={getFormBtnText(nextForm)} />
    </div>
  );

  switch (currentForm) {
    case FormType.Login:
      return (
        <LoginForm
          submitButton={FormLink}
          onChange={setEnableBtn}
          handleResult={handleResult}
        />
      );
    case FormType.Registration:
      return (
        <RegistrationForm
          submitButton={FormLink}
          onChange={setEnableBtn}
          handleResult={handleResult}
        />
      );
    default:
      return FormLink;
  }
}
