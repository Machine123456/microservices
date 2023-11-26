import { ButtonHTMLAttributes } from "react";
import "./CustomBtn.css";
import { capitalizeFirstLetter } from "../../../../utils/funcs";




export const SimpleBtn1 = ( { ...btnProps }: ButtonHTMLAttributes<HTMLButtonElement>) => {

    return (
        <button {...btnProps} className="simple-btn1" />
    );
}


type TextBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    text?: string
}


export const TextBtn1 = (props: TextBtnProps) => {

    const { text, ...btnProps } = props;
    return (
        <button {...btnProps} className="text-btn1" >
            {capitalizeFirstLetter(text?.toLowerCase())}
        </button>
    );
}

export const TextBtn2 = ({ text, ...btnProps }: TextBtnProps) => {

    return (
        <button {...btnProps} className="text-btn2" >
            {text?.toUpperCase()}
        </button>
    );
}

export const TextBtn3 = ({ text, ...btnProps }: TextBtnProps) => {

    return (
        <button {...btnProps} className="text-btn3" >
            {capitalizeFirstLetter(text?.toLowerCase())}
        </button>
    );
}

type ImgBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    imgSrc: string
}

export const ImgBtn1 = ({imgSrc, ...btnProps }: ImgBtnProps) => {

    return (
        <button {...btnProps} className="img-btn1">
            <img className="icon" src={imgSrc}/>
        </button>
    );
}
