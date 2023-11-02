import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./Slider.css";
import Frame from "./frame/Frame";


type SliderData = {
    numDisplays: number
    centerDisplay: number
    startOrderList: number[]
    startTargetDisplay: number
    swipeDuration: number
    swipeTick: number
}

export type SliderRef = {
    swipeRight(event: Event): void;
    swipeLeft(event: Event): void;
  }

const Slider = forwardRef<SliderRef>((_, ref) => {

    const data: SliderData = {
        numDisplays: 6,
        centerDisplay: Math.ceil(3), //Math.ceil(numDisplays / 2)
        startOrderList: [5, 6, 1, 2, 3, 4], //[...Array(numDisplays+1).keys()].slice(1)
        startTargetDisplay: 1,
        swipeDuration: 600,
        swipeTick: 10
    }

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const [targetDisplay, setTargetDisplay] = useState<number>(data.startTargetDisplay);
    const [orderList, setOrderList] = useState<number[]>(data.startOrderList);
    const [currentSlider, setSlider] = useState<number | null>(null);

    useEffect(() => {

        console.log("target: " + targetDisplay + " currentSlider: " + currentSlider);

        if (!wrapperRef || !wrapperRef.current) {
            console.error("Invalid Swip initialization: No wrapper ref found.");
            return;
        }

        if (targetDisplay > data.numDisplays || targetDisplay <= 0) {
            console.error("Invalid Swipe starter display: " + targetDisplay);
            return;
        }

        //reorder(targetDisplay);
        setDisplay(data.centerDisplay);

    }, [currentSlider]);

    useImperativeHandle(ref, () => ({
        swipeRight: (event:Event) => {
          event.preventDefault();
          swipe(1);
        },
        swipeLeft: (event:Event) => {
          event.preventDefault();
          swipe(-1);
        },
      }));


    function setDisplay(display: number) {

        wrapperRef && wrapperRef.current && wrapperRef.current.style.setProperty('--selected-display', display.toString());
    }

    function swipe(num: -1 | 1) {

        if (currentSlider)
            return;

        var target = convertToDNum(targetDisplay + num);
        setTargetDisplay(target);

        var dotDelay = (num * data.swipeTick) / data.swipeDuration;
        var path = 0;

        var slider = setInterval(function () {
            console.log("dot");
            if (1 - Math.abs(path) < (data.swipeTick / 1000)) {

                reorder(target);
                setDisplay(data.centerDisplay);

                clearInterval(slider);
                setSlider(null);

                return;
            }

            path += dotDelay;
            setDisplay(data.centerDisplay + path);
        }, data.swipeTick);

        setSlider(slider);
    }

    function reorder(flag: number) {

        var startAt = convertToDNum(flag - (data.centerDisplay - 1));
        setOrderList(getOrderList(data.numDisplays, startAt));

        function getOrderList(length: number, start: number) {
            if (length < 1 || start < 1 || start > length) {
                console.error(length + " " + start);
                return [];
            }

            var result = []

            for (let i = start; i < start + length; i++) {
                result.push(i <= length ? i : i - length);
            }

            return result
        }
    }

    function convertToDNum(num: number) {
        var r = num % data.numDisplays;
        return (num < 0 || r === 0) ? data.numDisplays + r : r;
    }


    return (
        <div className="slider">
            <div className="display-wrapper" ref={wrapperRef}>
                {
                    [...Array(data.numDisplays)].map((_, i) => {

                        var frameOrder = orderList.findIndex(e => e === (i + 1));
                        var frameId = i + 1;

                        return <Frame key={i} onSlide={swipe} isSelected={frameId === targetDisplay} order={frameOrder} num={frameId} />
                    })
                }

            </div>
        </div>
    );

});

export default Slider;

