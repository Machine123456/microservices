import { useRef, useState } from "react";
import "./LoginForm.css";

export default function LoginForm() {

    const nameRef = useRef<HTMLInputElement | null>(null);
    const psdRef = useRef<HTMLInputElement | null>(null);
    const [feedback,setFeedback] = useState("");

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nameInput = nameRef.current; 
    const psdInput = psdRef.current; 

    if (!nameInput || !psdInput)
      return displayFeedback("Error querying loginForm: ref fields not valid");

    //const csrfToken = document.querySelector('input[name="_csrf"]').value;

    fetch("authenticationService/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: nameInput.value,
        email: nameInput.value,
        password: psdInput.value,
      }),
      headers: {
        "Content-Type": "application/json",
        // Add any other headers as needed, including the CSRF token if required
        // 'X-CSRF-TOKEN': csrfToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          displayFeedback("Login Successfully");
          window.location.href = "/index";
        } else 
          return response
            .text()
            .then((errorMessage) => displayFeedback("error " + response.status + " " + errorMessage));

        
      })
      .catch((error) => {
        displayFeedback("Error during login, check logs for more info");
        console.error("Error during login:", error);
      });

    function displayFeedback(message: string) {
      setFeedback(message);
    }
  }
  return (
    <form className="login-form"
       onSubmit={login}>
      {/* onsubmit="login(event)"> */}
      <h2>Login</h2>
      <input
        type="text"
        className="form-username"
        placeholder="Username"
        required
        ref={nameRef}
      />
      <input
        type="password"
        className="form-password"
        placeholder="Password"
        required
        ref= {psdRef}
      />
      {/*<!--  <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" /> --> */}
      <div className="form-feedback">{feedback}</div>
      <div className="form-link">
        <a href="/register">REGISTER</a>
        <button type="submit" className="login-btn">
          Login
        </button>
      </div>
    </form>
  );
}
