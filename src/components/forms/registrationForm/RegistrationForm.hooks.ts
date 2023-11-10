import { RefObject, useRef, useState } from "react";
import { useLanguage, useRegValidations } from "../../../hooks/useCustomContext";
import { InputFeedbackRef } from "../../inputFeedback/InputFeedback";
import { useFetch } from "../../../hooks/useFetch";




export function useRegistration(handleResult: (sucess:boolean) => any) {

    const [feedback, setFeedback] = useState("");

    const setFeedbackStatus = (hasError:boolean, text:string) => {
        setFeedback(text);
        handleResult(!hasError);
    }
    const {textData} = useLanguage()
    const { doFetch, isLoading } = useFetch({
        service: "Authentication",
        onError: (error) => {
            console.error('Error during registration:', error);
            setFeedbackStatus(true,textData.registrationForm.feedback.onServerFail);
            //setFeedback("Error during registration, check logs for more info");
        },
        onData: (data) => {
            data.text()
            .then(res =>
                data.status === 200 ?  
                setFeedbackStatus(false,textData.registrationForm.feedback.onSuccess + " " + res) : 
                setFeedbackStatus(true,textData.registrationForm.feedback.onFail + res)
                //setFeedback(data.status === 200 ?"User registered successfully with token: " + res : res)
            );
        }
    });


    async function register(postBody: {}) {

        if (!postBody || Object.keys(postBody).length === 0) {
            setFeedbackStatus(true,textData.registrationForm.feedback.bodyNotFound);
            //setFeedback("No post body found");
            return;
        };

        doFetch({
            endpoint:'register',
            fetchParams: {
                method: "POST",
                body: JSON.stringify(postBody)
                , headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-TOKEN': csrfToken,
                }
            }

        });
    }

    return { register, isLoading, feedback };
}

export function useFieldsValidation() {

    const { fieldsValidations, isLoading, hasError } = useRegValidations();

    const getFieldValidationFunction = (valFieldName: string): (value: any) => string => {

        if (isLoading || hasError)
            return (_) => "";

        return (value) => {

            if (value === "") return "";
            var finalValidationMsg = "";
            fieldsValidations?.forEach(({ fieldName, validations }) => {
                if (valFieldName === fieldName) {
                    validations?.forEach(({ regexString, errorMsg }) => {
                        var regex = new RegExp(regexString);
                        if (!regex.test(value.toString()))
                            finalValidationMsg += errorMsg + "\n"
                    });
                    return;
                }
            });

            return finalValidationMsg;
        };

    }

    return { getFieldValidationFunction, isLoading, hasError };

}

export function usePostBodyFields() {
    const {textData} = useLanguage()

    type PostBodyField = {
        name: string,
        placeHolder: string,
        type: React.HTMLInputTypeAttribute,
        ref: RefObject<InputFeedbackRef>
    }

    const postBodyFields: PostBodyField[] = [
        {
            name: "username",
            placeHolder: textData.registrationForm.form.usernameLabel,
            type: "text",
            ref: useRef<InputFeedbackRef>(null)
        },
        {
            name: "email",
            placeHolder: textData.registrationForm.form.emailLabel,
            type: "text",
            ref: useRef<InputFeedbackRef>(null)
        },
        {
            name: "password",
            placeHolder: textData.registrationForm.form.passwordLabel,
            type: "password",
            ref: useRef<InputFeedbackRef>(null)
        }
    ]

    const everyFieldWithContent = () =>
        !postBodyFields.some((postField) => postField.ref.current?.value.length === 0);


    const validateFields = (): {
        isValid: boolean,
        postBody: {}
    } => {
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

        return { isValid: !hasInvalidInputs, postBody };

    }

    return { postBodyFields, everyFieldWithContent, validateFields }

}