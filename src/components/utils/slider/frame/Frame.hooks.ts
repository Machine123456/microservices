import { useEffect, useState } from "react";

type UseDragProps = {
    handleDragResult: (xDiff:number) => any
}


export function useDrag({handleDragResult}:UseDragProps){
    const [isDragging, setIsDragging] = useState(false);
    const [startDragX, setStartDragX] = useState(0);

    useEffect(() =>  {
        document.addEventListener("mouseup",dragStop);

        return () => {
            document.removeEventListener("mouseup",dragStop);
        }
    },[isDragging,startDragX]);

    const startDragging = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartDragX(e.pageX);
    }

    const dragStop = (e: MouseEvent) =>{

        if(!isDragging)
            return;

        setIsDragging(false);
        handleDragResult(startDragX - e.pageX);
        
        /*
        if (startDragX === e.pageX)
            return;

        (startDragX > e.pageX) ? onSlide(1) : onSlide(-1);
        */
    }

    return {isDragging,startDragging};
}