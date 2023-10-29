import "./Panel3.css";

export default function Panel3() {

    function swipeLeft() {
        
    }

    function swipeRight() {
        
    }



    return (
        <div id="panel3">
            <button onClick={swipeLeft}>&lt;</button>
            <div className="middle-panel">
                <div className="display-wrapper">
                    {/* <div className="display">1</div> */} 
                </div>
            </div>
            <button onClick={swipeRight}>&gt;</button>
        </div>
    );
}