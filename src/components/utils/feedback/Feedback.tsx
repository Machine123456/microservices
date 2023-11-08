import "./Feedback.css";

type FeedbackProps = {
    str: string
}

export default function Feedback({str}: FeedbackProps) {
    return (
        <div className="feedback">{str}</div>
    );

}