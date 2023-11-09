import { useRef } from "react";
import "./Panel3.css";
import Slider, { SliderRef } from "../../../../utils/slider/Slider";

export default function Panel3() {

    const slider = useRef<SliderRef>(null);

    function swipeLeft() {
        slider?.current?.swipeLeft(new Event('swipe'));
    }

    function swipeRight() {
        slider?.current?.swipeRight(new Event('swipe'));
    }


    return (
        <div id="panel3">
            <button onClick={swipeLeft}>&lt;</button>
            <Slider ref={slider} />
            <button onClick={swipeRight}>&gt;</button>
        </div>
    );
}