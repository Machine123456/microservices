import { useState } from "react";
import { useLanguage, useUser } from "../../../hooks/useCustomContext";
import { useFetch } from "../../../hooks/useFetch";

export function useLogin(handleResult: (sucess:boolean) => any) {

  const {textData} = useLanguage()
  
  const { doFetch, isLoading } = useFetch({
    service: "Authentication",
    onError: (error) => {
      setFeedBackStatus(true,textData.loginForm.feedback.onServerFail);
      //setFeedback("Error during login, check logs for more info");
      console.error("Error during login:", error);
    },
    onData: (data) => {
      data.text().then((text) => {
        if (data.status === 200) {
          setFeedBackStatus(false,textData.loginForm.feedback.onSuccess);
          //setFeedback("Login Successfully");
          updateToken(text);
        } else {
          setFeedBackStatus(true,textData.loginForm.feedback.onFail + " " + data.status + ": " + text);
          //setFeedback("error " + data.status + ": " + text);
        }

      });
    }
  });
  const [feedback, setFeedback] = useState("");

  const setFeedBackStatus = (hasError: boolean, text:string) => {
    handleResult(!hasError);
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