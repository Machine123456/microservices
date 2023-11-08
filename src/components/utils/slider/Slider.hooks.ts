import { useEffect, useState } from "react"

export function useSlider() {

    type SliderData = {
        numDisplays: number
        centerFrame: number
        startOrderList: number[]
        startTargetFrame: number
        swipeDuration: number
        swipeTick: number
    }

    const data: SliderData = {
        numDisplays: 6,
        centerFrame: Math.ceil(3), //Math.ceil(numDisplays / 2)
        startOrderList: [5, 6, 1, 2, 3, 4], //[...Array(numDisplays+1).keys()].slice(1)
        startTargetFrame: 1,
        swipeDuration: 400,
        swipeTick: 10
    }

    const [targetFrame, setTargetFrame] = useState<number>(data.startTargetFrame);
    const [currentAnim, setAnim] = useState<number | null>(null);

    const [orderList, setOrderList] = useState<number[]>(data.startOrderList);
    const [currentFrame, setCurrentFrame] = useState(data.centerFrame);

    useEffect(() => {

        if (targetFrame > data.numDisplays || targetFrame <= 0) {
            console.error("Invalid Swipe starter display: " + targetFrame);
            return;
        }

        //reorder(targetFrame);
        setCurrentFrame(data.centerFrame);

    }, []);

    function reorder(flag: number) {

        var startAt = convertToDNum(flag - (data.centerFrame - 1));
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

    function swipe(num: -1 | 1) {

        if (currentAnim)
            return;

        var target = convertToDNum(targetFrame + num);
        setTargetFrame(target);

        var dotDelay = (num * data.swipeTick) / data.swipeDuration;
        var path = 0;

        var anim = setInterval(function () {
            console.log("dot");
            if (1 - Math.abs(path) < (data.swipeTick / 1000)) {

                reorder(target);
                setCurrentFrame(data.centerFrame);

                clearInterval(anim);
                setAnim(null);

                return;
            }

            path += dotDelay;
            setCurrentFrame(data.centerFrame + path);
        }, data.swipeTick);

        setAnim(anim);
    }

    return {data , swipe, currentFrame, targetFrame, orderList}

}