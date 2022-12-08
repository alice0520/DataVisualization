const width = 1300;
const height = 710;

const svg = d3.select("#local-view").append("svg")
            .attr("width", width)
            .attr("height", height);

var continent = "Global";

//// Map
data_map = d3.json("world-map.json");
draw_map();

data = d3.csv("WorldHappiness_Corruption_2015_2020.csv");
getData(data);

loc_data = d3.csv("world_country_loc.csv");

year = 2015;

function getData(data){
    data.then(d => {
        d.forEach(d => {
            d.Year = Number(d.Year);
            d.cpi_score = Number(d.cpi_score);
            d.dystopia_residual = Number(d.dystopia_residual);
            d.family = Number(d.family);
            d.freedom = Number(d.freedom);
            d.gdp_per_capita = Number(d.gdp_per_capita);
            d.generosity = Number(d.generosity);
            d.government_trust = Number(d.government_trust);
            d.happiness_score = Number(d.happiness_score);
            d.health = Number(d.health);
            d.social_support = Number(d.social_support);
        });
    });   
}

function getDataByYear(year){
    data_by_year = data.then(d =>{
        return d.filter(function(d){return d.Year == year});
    });
    return data_by_year;
}

function draw_map(){
    data_map.then(geoData => {
        var width = 700;
        var height = 350;
    
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
            .attr("class", function(d) {return d.properties.continent})
            .attr("width", width)
            .attr("height", height)
            .attr("stroke", "black")
            .attr("fill", "white")
            .attr("d", geoGenerator);

        d3.selectAll("path")
            .on("click", function(){
                //choose continent
                //call Qin's function
                continent = this.className.baseVal;
                console.log(continent);
            });

        data_by_year = getDataByYear(year);

        loc_data.then(loc_d => {
            country = Object.values(loc_d).map(item => item.country);
            latitude = Object.values(loc_d).map(item => item.latitude);
            longitude = Object.values(loc_d).map(item => item.longitude);

            data_by_year.then(d => {
                circle = gMap.selectAll("circle")
                .data(d)
                .enter()
                .append("circle")
                .attr("class", function(d) {return d.continent})
                .attr("transform", function(d) {
                    var idx = country.findIndex(element => element == d.Country);
                    var position = projection([longitude[idx], latitude[idx]]);
                    return "translate (" + position[0] + "," + position[1] + ")";
                })
                .attr("fill", "red")
                .attr("stroke", "black")
                .attr("opacity", 0.8)
                .attr("r", function(d) {
                    return d.happiness_score;
                })
                .on("click", function(){
                    //choose continent
                    //call Qin's function
                    continent = this.className.baseVal;
                    console.log(continent);
                });
            });
        });

        
    });
}
