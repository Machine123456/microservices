import { ReactElement } from "react";
import "./CustomForm.css";
import LoadingCircle from "../../utils/loadingCircle/LoadingCircle";
import Feedback from "../../utils/feedback/Feedback";

type CustomFormProps = {
    title: string,
    formInputs: ReactElement,
    submitButton: ReactElement,
    onChange?: (isValid: boolean) => any,
    formStatus: {
        feedback:string,
        isLoading:boolean,
        submit: (formData:FormData) => any
    }
}

export default function CustomForm({ title, formInputs,submitButton, formStatus }: CustomFormProps) {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formStatus.submit(formData);
    }
   

    return (
        <form className="form-body"
            onSubmit={handleSubmit}>
             <h2>{title}</h2>
            {formInputs}
            {formStatus.isLoading ?
                <LoadingCircle /> :
                <>
                    <Feedback str={formStatus.feedback} />
                    {submitButton}
                </>
            }

        </form>
    );

}