import { ReactElement, RefObject, useRef, useState } from "react";
import "./RegistrationForm.css";
import Feedback from "../feedback/Feedback";
import LoadingCircle from "../loadingCircle/LoadingCircle";
import { RegValidationsProvider } from "../../context/RegValidationsContext";
import InputFeedback, { InputFeedbackRef } from "../inputFeedback/InputFeedback";

type RegistrationFormProps = {
    submitButton: ReactElement;
    onChange: (isValid: boolean) => any
}

type PostBodyField = {
    name: string,
    type: React.HTMLInputTypeAttribute,
    ref: RefObject<InputFeedbackRef>
}

const Inner = ({ submitButton , onChange} : RegistrationFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    const postBodyFields: PostBodyField[] = [
        {
            name: "username", 
            type: "text",
            ref: useRef<InputFeedbackRef>(null)
        },
        {
            name: "email", 
            type: "text",
            ref: useRef<InputFeedbackRef>(null)
        },
        {
            name: "password", 
            type: "password",
            ref: useRef<InputFeedbackRef>(null)
        }
    ]
    
    const handleChange = (_: any) => {
        var isValid = postBodyFields.every((postField) => postField.ref.current ? postField.ref.current.value.length > 0 : false);
        onChange(isValid);
    }

    async function register(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        var hasInvalidInputs = false;
        var postBody = {};

        postBodyFields.forEach((postField) => {

            var field = postField.ref.current;
            if (!field)
                return; //continue;

            postBody = { ...postBody, [postField.name]: field.value };
            hasInvalidInputs = hasInvalidInputs || !field.isValid;

            if (!field.isValid)
                field.toggleShake();

        });

        if (hasInvalidInputs)
            return;

        setIsLoading(true);
        //const csrfToken = document.querySelector('input[name="_csrf"]').value;

        fetch(import.meta.env.VITE_AUTH_SERVER + '/auth/register', {
            method: 'POST',
            body: JSON.stringify(postBody)
            , headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': csrfToken,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setFeedback("Register Successfully");
                    //window.location.href = '/index';
                }
                else return response.text().then(errorMessage => setFeedback(errorMessage));
            })
            .catch(error => {
                setFeedback("Error during registration, check logs for more info");
                console.error('Error during register:', error);
            });

        setIsLoading(false);
    }


    return (
        <form onSubmit={register} className="reg-form">
            <h2>Create Account</h2>
            {
                postBodyFields.map((field, index) => {
                    return <InputFeedback key={index} ref={field.ref} name={field.name} type={field.type} onChange={handleChange} />;
                })
            }
            {/* <!--  <input type="hidden" th: name="${_csrf.parameterName}" th: value="${_csrf.token}" /> --> */}

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


const RegistrationForm = (props: RegistrationFormProps) => {
    return (
        <RegValidationsProvider >
            <Inner {...props} />
        </RegValidationsProvider>
    );
};

export default RegistrationForm;