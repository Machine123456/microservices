import { ReactElement, forwardRef, useImperativeHandle, useState } from "react";
import "./LoginForm.css";
import Feedback from "../feedback/Feedback";
import LoadingCircle from "../loadingCircle/LoadingCircle";
import { useUser } from "../../hooks/useCustomContext";

type LoginValidations = {
  hasUsername: boolean,
  hasPassword: boolean
}

type LoginFormProps = {
  submitButton: ReactElement
  onChange?: (isValid:boolean) => any
}

const LoginForm = ({ submitButton, onChange }: LoginFormProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formValidations, setFormValidations] = useState<LoginValidations>({ hasUsername: false, hasPassword: false });

  let { updateToken } = useUser();

  const handleInput = (newVal:LoginValidations) => {
      setFormValidations(newVal);
      onChange?.(Object.values(newVal).every(Boolean));
  }
  

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    //const csrfToken = document.querySelector('input[name="_csrf"]').value;

    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_AUTH_SERVER + "/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          email: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed, including the CSRF token if required
          // 'X-CSRF-TOKEN': csrfToken,
        }
      });

      if (response.status === 200) {
        setFeedback("Login Successfully");
        const token = await response.text();
        //console.log(token);
        updateToken(token);
        //window.location.href = "/index";
      } else {
        const errorMessage = await response.text();
        setFeedback("error " + response.status + " " + errorMessage);
      }

    } catch (error) {
      setFeedback("Error during login, check logs for more info");
      console.error("Error during login:", error);
    }

    setIsLoading(false);

  }

  return (
    <form className="login-form"
      onSubmit={login}>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={(e) => handleInput({ ...formValidations, hasUsername: e.target.value.length > 0 })}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) => handleInput({ ...formValidations, hasPassword: e.target.value.length > 0 })}
      />
      {/*<!--  <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" /> --> */}

      {isLoading ?
        <LoadingCircle /> :
        <>
          <Feedback str={feedback} />
          {submitButton}
        </>
      }

    </form>
  );
};

export default LoginForm;
