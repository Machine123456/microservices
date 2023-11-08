import { forwardRef, useImperativeHandle } from "react";
import "./Slider.css";
import Frame from "./frame/Frame";
import { useSlider } from "./Slider.hooks";


export type SliderRef = {
    swipeRight(event: Event): void;
    swipeLeft(event: Event): void;
  }

const Slider = forwardRef<SliderRef>((_, ref) => {

    const {data, currentFrame, orderList, swipe, targetFrame} = useSlider();

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

   
    return (
        <div className="slider">
            <div className="display-wrapper" style={{ '--selected-display': currentFrame } as React.CSSProperties} >
                {
                    [...Array(data.numDisplays)].map((_, i) => {

                        var frameOrder = orderList.findIndex(e => e === (i + 1));
                        var frameId = i + 1;

                        return <Frame key={i} onSlide={swipe} isSelected={frameId === targetFrame} order={frameOrder} num={frameId} />
                    })
                }

            </div>
        </div>
    );

});

export default Slider;

