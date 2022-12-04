const width = 1300;
const height = 710;

const svg = d3.select("#chart-area").append("svg")
            .attr("width", width)
            .attr("height", height);

//// Map
var teams = {};
d3.json("global_map.json").then(geoData => {
    var width = 600;
    var height = 400;

    moveX = 0;
    moveY = 80;

    const gMap = svg.append("g")
                    .attr("transform", `translate(${moveX}, ${moveY})`);

    var projection = d3.geoMercator()
                        .fitExtent([[0,0], [width, height]], geoData);

    var geoGenerator = d3.geoPath()
                        .projection(projection);

    gMap.append("g")
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("d", geoGenerator);
});
