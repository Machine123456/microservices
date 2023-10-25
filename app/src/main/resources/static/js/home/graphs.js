const data = [
    {x: "authentication", value: 39},
    {x: "product", value: 52},
    {x: "portal", value: 43},
    {x: "games", value: 60},
    {x: "other", value: 50}
  ];


  function initGraphs(displayPanel){
    if (!displayPanel) {
        console.error("Invalid graphs initialization: " + displayPanel);
        return;
    }

    var spiderGraph = displayPanel.querySelector(".spider-graph");
    spiderGraph.style.setProperty('clip-path', "polygon( " + createPolygon(data.length,1) + " )");
    
  }

function createPolygon(sides, scale) {

    scale = Math.max(0, Math.min(scale, 1));
    const step = (2*Math.PI) / sides;
    let clipPath = '50% 0%';

    for (let i = 1; i < sides; i++) {
        var angle = (step * i) - (Math.PI/2);
        const x = scale * 50 * ( Math.cos(angle) + 1);
        const y = scale * 50 * ( Math.sin(angle) + 1);
        clipPath += `, ${x}% ${y}%`;
    }

    console.log(clipPath);
    return clipPath;
}