import { useEffect, useState } from "react";
import "./Frame.css";

type FrameProps = {
    num: number
    isSelected: boolean
    onSlide: (side: -1 | 1) => any
    order: number
  }

export default function Frame({isSelected, onSlide, order,num}:FrameProps) {

    const [isDragging, setIsDragging] = useState(false);
    const [startDragX, setStartDragX] = useState(0);

    useEffect(() =>  {
        document.addEventListener("mouseup",dragStop);

        return () => {
            document.removeEventListener("mouseup",dragStop);
        }
    },[isDragging,startDragX]);

    const dragStart = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartDragX(e.pageX);
    }

    const dragStop = (e: MouseEvent) =>{

        if(!isDragging)
            return;

        setIsDragging(false);
        
        if (startDragX === e.pageX)
            return;

        (startDragX > e.pageX) ? onSlide(1) : onSlide(-1);
    }

    return (
        <div className={"display " + (isDragging ? "grabbing": "")} onMouseDown={dragStart}  style={{ order: order }}>
            <div className={"display__inner " + (isSelected ? "selected" : "")} > {num} </div>
        </div>
    );

};