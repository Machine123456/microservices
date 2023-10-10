var swiperStyle = null;
var swiper = null;

var currentDisplay = 1;

var nightColor = "black";
var dayColor = "#fff";

const numDisplays = 6;
const swipeDuration =  300;
const swipeTick = 5;

const centerDisplay = Math.ceil(numDisplays/2);

document.addEventListener('DOMContentLoaded', function () {

    const swiperPanel = document.querySelector('#panel3');

    setColors(false);

    swiperStyle = swiperPanel.style;

    const displayWrapper = swiperPanel.querySelector('.display-wrapper');

    if (swipeDuration <= 0) {
        console.error("Invalid Swipe Duration: " + swipeDuration);
        return;
    }

    if (swipeTick <= 0) {
        console.error("Invalid Swipe Tick: " + swipeTick);
        return;
    }


    for (let i = 1; i <= numDisplays; i++) {

        const display = document.createElement("div");
        display.classList.add("display");
        display.id = "d"+i;
        

        const display__inner = document.createElement("div");
        display__inner.classList.add("display__inner");
        display__inner.textContent = i;

        display.appendChild(display__inner);
        displayWrapper.appendChild(display);
    }


    reorder(currentDisplay);
    updateSelected(currentDisplay);
    swiperStyle.setProperty('--selected-display', centerDisplay);

});

function setColors(isDay) {

    var [mainColor, detailColor] = isDay ? [dayColor, nightColor] : [nightColor, dayColor];

    var rootStyle = document.querySelector(':root').style;

    rootStyle.setProperty('--main-color', mainColor);
    rootStyle.setProperty('--details-color', detailColor);

    
}

function reorder(centerOn){

    var startAt = convertToDNum(centerOn - (centerDisplay - 1));

    const displayWrapper = document.querySelector('#panel3 .display-wrapper');

    var orderList = getOrderList(numDisplays,startAt);

    for (let i = 0; i < numDisplays; i++) {
        var display = displayWrapper.querySelector("#d" + orderList[i]);
        display.style.setProperty('order', i + 1);
    }

    function getOrderList(length, start) {
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

function convertToDNum(num){
    var r = num % numDisplays;
    return (num < 0 || r === 0) ? numDisplays + r : r;
}


function swipeRight(event) {
    event.preventDefault();
    swipe(1);
}

function swipeLeft(event) {
    event.preventDefault();
    swipe(-1);
}

function updateSelected(targetId){
    const displayWrapper = document.querySelector('#panel3 .display-wrapper');

    const selected = displayWrapper.querySelector('.selected');
    if(selected)
        selected.classList.remove('selected');

    const target = displayWrapper.querySelector('#d' + targetId + " > .display__inner");
    if(target)
        target.classList.add('selected');
}

function swipe(num) {

    if (!swiperStyle)
        return;

    if (swiper != null) {
            return;
            /*clearInterval(swiper);
            swiper = null;*/
    }

    var targetDisplay = currentDisplay + num;
    //targetDisplay = Math.min(Math.max(parseInt(targetDisplay + num), 1), numDisplays);

    if (targetDisplay == currentDisplay)
        return;
    
    updateSelected(convertToDNum(targetDisplay));
    //console.log("targetDisplay: " + targetDisplay + " currentDisplay: " + currentDisplay);

    //console.log("get selected: " + selected);
    //var dotDelay = (targetDisplay - currentDisplay) * swipeTick / swipeDuration;
    var dotDelay = (num * swipeTick) / swipeDuration;

    //console.log("dotDelay: " + dotDelay);
    var startDisplay = currentDisplay;

    swiper = setInterval(function () {

        /*if(Math.abs(currentDisplay - Math.floor(currentDisplay)) < (swipeTick / 1000)) {
            reorder(Math.floor(currentDisplay));
            swiperStyle.setProperty('--selected-display', centerDisplay);
        }*/

        if (Math.abs(targetDisplay - currentDisplay) - Math.abs(dotDelay) < (swipeTick / 1000)) {
            currentDisplay = targetDisplay;
            reorder(currentDisplay);
            
            swiperStyle.setProperty('--selected-display', centerDisplay);
            
            console.log("end swip:  " + swiper);
           
            clearInterval(swiper);
            swiper = null;

            return;
        }

        currentDisplay += dotDelay;

        swiperStyle.setProperty('--selected-display', centerDisplay + currentDisplay - startDisplay);
    }, swipeTick);

    console.log("start swiper:" + swiper); //prints the number

}

