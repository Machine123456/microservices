var nightColor = "black";
var dayColor = "#fff";

function setColors(isDay) {

    var [mainColor, detailColor] = isDay ? [dayColor, nightColor] : [nightColor, dayColor];

    var rootStyle = document.querySelector(':root').style;

    rootStyle.setProperty('--main-color', mainColor);
    rootStyle.setProperty('--details-color', detailColor);

}