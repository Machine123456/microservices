import "./HoverInfo.css";

type HoverInfoProps = {
    displayChar: "!" | "?"
    message: string
}

export default function HoverInfo({ displayChar, message }: HoverInfoProps) {
    return (
        <>
            <div className="info">
                <div className="label"><p>{displayChar}</p></div>
                <span className="message">{message}</span>
            </div>
            
        </>
    );

}