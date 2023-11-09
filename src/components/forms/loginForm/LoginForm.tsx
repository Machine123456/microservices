import { ReactElement, useState } from "react";
import "./LoginForm.css";
import { useLogin } from "./LoginForm.hooks";
import CustomForm from "../customForm/CustomForm";
import { useLanguage } from "../../../hooks/useCustomContext";

type LoginValidations = {
  hasUsername: boolean,
  hasPassword: boolean
}

type LoginFormProps = {
  submitButton: ReactElement
  onChange?: (isValid: boolean) => any
  handleResult?: (sucess:boolean) => any
}

const LoginForm = ({ submitButton, onChange, handleResult }: LoginFormProps) => {

  const {textData} = useLanguage()
  const { feedback, isLoading, login } = useLogin((sucess) => handleResult?.(sucess));
  const [formValidations, setFormValidations] = useState<LoginValidations>({ hasUsername: false, hasPassword: false });

  const handleInput = (newVal: LoginValidations) => {
    setFormValidations(newVal);
    onChange?.(Object.values(newVal).every(Boolean));
  }

  const handleLogin = (formData: FormData) => {

    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    login(username, password);
  }

  const formInputs =
    (<>
      <input
        type="text"
        name="username"
        placeholder={textData.loginForm.form.usernameLabel}
        onChange={(e) => handleInput({ ...formValidations, hasUsername: e.target.value.length > 0 })}
      />
      <input
        type="password"
        name="password"
        placeholder={textData.loginForm.form.passwordLabel}
        onChange={(e) => handleInput({ ...formValidations, hasPassword: e.target.value.length > 0 })}
      />
    </>);

  return (
    <CustomForm 
      title={textData.loginForm.form.title}
      formInputs={formInputs} 
      submitButton={submitButton} 
      formStatus={{ 
        feedback, 
        isLoading, 
        submit:handleLogin
      }}/>

  );
};

export default LoginForm;
