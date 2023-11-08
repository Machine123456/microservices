import "./Frame.css";
import { useDrag } from "./Frame.hooks";

type FrameProps = {
    num: number
    isSelected: boolean
    onSlide: (side: -1 | 1) => any
    order: number
  }

export default function Frame({isSelected, onSlide, order,num}:FrameProps) {

    const onDragEnd = (diff:number) => {
        if (diff === 0)
            return;

        (diff > 1) ? onSlide(1) : onSlide(-1);
    }

    const {isDragging,startDragging} = useDrag({handleDragResult:onDragEnd});


    return (
        <div className={"display " + (isDragging ? "grabbing": "")} onMouseDown={startDragging}  style={{ order: order }}>
            <div className={"display__inner " + (isSelected ? "selected" : "")} > {num} </div>
        </div>
    );

};