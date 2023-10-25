const num = 6;

document.addEventListener('DOMContentLoaded', function () {

    const panel3 = document.querySelector('#panel3');
    const panel2 = document.querySelector('#panel2');

    const swiper = panel3.querySelector('.display-wrapper');
    const graph = panel2.querySelector('#frame1');

    for (let i = 1; i <= num; i++) {

        const display = document.createElement("div");
        display.classList.add("display");
        display.id = "d" + i;


        const display__inner = document.createElement("div");
        display__inner.classList.add("display__inner");
        display__inner.textContent = i;

        display.appendChild(display__inner);
        swiper.appendChild(display);
    }

    setColors(false);
    initSwipe(swiper, num, 300, 5, 1);
    initGraphs(graph);

});
