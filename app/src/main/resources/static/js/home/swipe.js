var displayWrapper = null ,swiper = null;
var numDisplays = 0, centerDisplay = 0 ,currentDisplay = 1, swipeDuration = 300, swipeTick = 5;
var isDragStart = false, startDragX = 0;

function initSwipe(displayWrapper, numDisplays, swipeDuration, swipeTick, initDisplay) {

    if (!displayWrapper) {
        console.error("Invalid Swip initialization: " + displayWrapper);
        return;
    }

    if (numDisplays < 1) {
        console.error("Invalid Swipe display number: " + numDisplays);
        return;
    }

    if (initDisplay > numDisplays || initDisplay <= 0) {
        console.error("Invalid Swipe starter display: " + initDisplay);
        return;
    }

    if (swipeDuration <= 0) {
        console.error("Invalid Swipe Duration: " + swipeDuration);
        return;
    }

    if (swipeTick <= 0) {
        console.error("Invalid Swipe Tick: " + swipeTick);
        return;
    }


    currentDisplay = initDisplay;
    this.swipeTick = swipeTick;
    this.swipeDuration = swipeDuration;

    this.displayWrapper = displayWrapper;
    this.numDisplays = numDisplays;
    centerDisplay = Math.ceil(numDisplays / 2);

    reorder(currentDisplay);
    updateSelected(currentDisplay);
    displayWrapper.style.setProperty('--selected-display', centerDisplay);

    [...displayWrapper.getElementsByClassName("display")].forEach(display => {
        display.addEventListener("mousedown",dragStart);
    });

    document.addEventListener("mouseup",dragStop);
}

const dragStart = (e) => {
   isDragStart = true;
   startDragX = e.pageX;
   
   e.target.closest(".display").classList.add("grabbing");
   
}

const dragStop = (e) => {

    if(isDragStart) {
        isDragStart = false;
        displayWrapper.querySelector(".grabbing").classList.remove("grabbing");

        if(startDragX === e.pageX ) 
            return;
        
        (startDragX > e.pageX) ? swipeRight(e) : swipeLeft(e);
    }
}


function reorder(centerOn) {

    var startAt = convertToDNum(centerOn - (centerDisplay - 1));
    var orderList = getOrderList(numDisplays, startAt);

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

function convertToDNum(num) {
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

function updateSelected(targetId) {

    const selected = displayWrapper.querySelector('.selected');
    if (selected)
        selected.classList.remove('selected');

    const target = displayWrapper.querySelector('#d' + targetId + " > .display__inner");
    if (target)
        target.classList.add('selected');
}

function swipe(num) {

    if (!displayWrapper)
        return;

    if (swiper != null)
        return;

    var targetDisplay = currentDisplay + num;

    if (targetDisplay == currentDisplay)
        return;

    updateSelected(convertToDNum(targetDisplay));
    var dotDelay = (num * swipeTick) / swipeDuration;
    var startDisplay = currentDisplay;

    swiper = setInterval(function () {
        if (Math.abs(targetDisplay - currentDisplay) - Math.abs(dotDelay) < (swipeTick / 1000)) {

            currentDisplay = targetDisplay;
            reorder(currentDisplay);
            displayWrapper.style.setProperty('--selected-display', centerDisplay);

            clearInterval(swiper);
            swiper = null;
            return;
        }

        currentDisplay += dotDelay;

        displayWrapper.style.setProperty('--selected-display', centerDisplay + currentDisplay - startDisplay);
    }, swipeTick);

}

