import { ButtonHTMLAttributes } from "react";

type TemplateBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode,
    className: string
}

export default function TemplateBtn(props: TemplateBtnProps) {

    const {children, className, ...btnProps} = {...props};

    return (
        <button className={className} {...btnProps}>
            {children}
        </button>
    );
}