import { useState } from "react";
import { useLanguage, useUser } from "../../../hooks/useCustomContext";
import { useFetch } from "../../../hooks/useFetch";

export function useLogin(handleResult: (sucess: boolean) => any) {

  const { textData } = useLanguage()

  const { doFetch, isLoading } = useFetch({
    service: "Authentication",
    onError: (error) => {
      setFeedBackStatus(false, textData.loginForm.feedback.onFail + " " + error);
      //setFeedback("Error during login, check logs for more info");
      console.error("Error during login:", error);
    },
    onData: ({text}) => {
        setFeedBackStatus(true, textData.loginForm.feedback.onSuccess);
        updateToken(text);
    }
  });
  const [feedback, setFeedback] = useState("");

  const setFeedBackStatus = (result: boolean, text: string) => {
    handleResult(result);
    setFeedback(text);
  }

  let { updateToken } = useUser();

  async function login(username: string | undefined, password: string | undefined) {
    //const csrfToken = document.querySelector('input[name="_csrf"]').value;

    doFetch({
      endpoint: "request/login",
      fetchParams: {
        method: "POST",
        body: JSON.stringify({
          username: username,
          email: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          // 'X-CSRF-TOKEN': csrfToken,
        },
      }
    });
  }

  return { isLoading, feedback, login }
}