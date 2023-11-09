import { ButtonHTMLAttributes } from "react";
import { capitalizeFirstLetter } from "../../../../utils/Funcs";
import "./CustomBtn.css";

type ClickBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    text?: string
}

type CloseBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
   
}

export const ClickBtn1 = (props: ClickBtnProps) => {

    const {text, ...btnProps} = props;
    return (
        <button {...btnProps} className="submit-btn1" >
            {capitalizeFirstLetter(text?.toLowerCase())}
        </button>
    );
}

export const ClickBtn2 =(props: ClickBtnProps) => {

    const {text, ...btnProps} = props;
    return (
        <button {...btnProps} className="click-btn2" >
            {text?.toUpperCase()}
        </button>
    );
}

export const ClickBtn3 =(props: ClickBtnProps) => {

    const {text, ...btnProps} = props;
    return (
        <button {...btnProps} className="click-btn3" >
            {capitalizeFirstLetter(text?.toLowerCase())}
        </button>
    );
}

export const CloseBtn1 = (props: CloseBtnProps) => {

    const {...btnProps} = props;
    return (
        <button {...btnProps} className="close-btn1"/>
    );
}
