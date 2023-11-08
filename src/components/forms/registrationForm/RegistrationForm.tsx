import "./RegistrationForm.css";

import { ReactElement } from "react";
import { useFieldsValidation, usePostBodyFields, useRegistration } from "./RegistrationForm.hooks";
import HoverInfo from "../../utils/hoverInfo/HoverInfo";
import InputFeedback from "../../inputFeedback/InputFeedback";
import { RegValidationsProvider } from "../../../context/RegValidationsContext";
import CustomForm from "../customForm/CustomForm";
import { useLanguage } from "../../../hooks/useCustomContext";
import LanguageSelector from "../../utils/enumSelector/languageSelector/LanguageSelector";

type RegistrationFormProps = {
    submitButton: ReactElement;
    onChange: (isValid: boolean) => any
}

const Inner = ({ submitButton, onChange }: RegistrationFormProps) => {

    const { everyFieldWithContent, postBodyFields, validateFields } = usePostBodyFields();
    const { register, isLoading: isLoadingRegister, feedback } = useRegistration();
    const { getFieldValidationFunction, hasError: hasErrorOnLoadingValidationFields, isLoading: isLoadingFieldsValidations } = useFieldsValidation();

    const { textData } = useLanguage();

    const handleChange = (fieldName: string, newValue: string) => {
        var isValid = everyFieldWithContent();
        onChange(isValid);
    }

    async function hadleRegEvent() {

        const { isValid, postBody } = validateFields();

        if (!isValid)
            return;

        register(postBody);
    }


    const formInputs = (
        <>
            {
                postBodyFields.map((field, index) => {
                    return <InputFeedback key={index} ref={field.ref} name={field.name} placeHolder={field.placeHolder} validate={getFieldValidationFunction(field.name)} type={field.type} onChange={(newValue) => handleChange(field.name, newValue)} />;
                })
            }

            <div className="formInfo">
                {isLoadingFieldsValidations ? <HoverInfo message={textData.registrationForm.feedback.infoFetchingRequirements} displayChar="?" /> :
                    hasErrorOnLoadingValidationFields && <HoverInfo message={textData.registrationForm.feedback.infoRequirementsFetchFail} displayChar="!" />}
            </div>
        </>);


    return (
        <>

            <CustomForm
                title={textData.registrationForm.form.title}
                formInputs={formInputs}
                submitButton={submitButton}
                formStatus={{ feedback, isLoading: isLoadingRegister, submit: hadleRegEvent }} />

            <div style={{ width: "90%",margin:".6em"}}>
                <LanguageSelector />
            </div>
          
        </>
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