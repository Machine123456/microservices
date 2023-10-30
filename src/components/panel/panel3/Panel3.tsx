import { useRef } from "react";
import Slider, { SliderMethods } from "../../slider/Slider";
import "./Panel3.css";

export default function Panel3() {

    const slider = useRef<SliderMethods>(null);

    function swipeLeft() {
        slider.current && slider.current.swipeLeft(new Event('swipe'));
    }

    function swipeRight() {
        slider.current && slider.current.swipeRight(new Event('swipe'));
    }


    return (
        <div id="panel3">
            <button onClick={swipeLeft}>&lt;</button>
            <Slider ref={slider} />
            <button onClick={swipeRight}>&gt;</button>
        </div>
    );
}