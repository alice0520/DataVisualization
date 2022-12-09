const local_width = 1300;
const local_height = 710;

const local_svg = d3.select("#local-view").append("svg")
            .attr("width", local_width)
            .attr("height", local_height);

var continent = "Global";

//// Map
data_map = d3.json("world-map.json");
draw_map();

data = d3.csv("WorldHappiness_Corruption_2015_2020.csv");
getData(data);

// 來源：https://www.kaggle.com/datasets/paultimothymooney/latitude-and-longitude-for-every-country-and-state
loc_data = d3.csv("world_country_loc.csv");

var year = 2015;
var is_click = false;
var continent = "Golbal";

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

function changeContinent(){
    continent = document.getElementById("continent").value;
    changeMapCircleColor();
}

function draw_map(){
    data_map.then(geoData => {
        var width = 700;
        var height = 350;
    
        moveX = 0;
        moveY = 80;
    
        const gMap = local_svg.append("g")
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
                if(continent == this.className.baseVal || (continent == "America" && (this.className.baseVal == "North America" || this.className.baseVal == "South America"))){
                    is_click = true;
                }
                else{
                    is_click = false;
                }
                if(is_click == true){
                    continent = "Global";
                }
                else{
                    continent = this.className.baseVal;
                    if(continent == "North America" || continent == "South America"){
                        continent = "America";
                    }
                }
                console.log(continent);
                document.getElementById("continent").value = continent;
                changeMapCircleColor();
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
                            .attr("fill", "pink")
                            .attr("stroke", "black")
                            .attr("r", function(d) {
                                return d.happiness_score;
                            })
                            .on("click", function(){
                                //choose continent
                                //call Qin's function
                                if(continent == this.className.baseVal){
                                    is_click = true;
                                }
                                else{
                                    is_click = false;
                                }
                                if(is_click == true){
                                    continent = "Global";
                                }
                                else{
                                    continent = this.className.baseVal;
                                }
                                console.log(continent);
                                document.getElementById("continent").value = continent;
                                changeMapCircleColor();
                            });

                    var tip = d3.tip()
                            .attr("class", "d3-tip")
                            .html(d=>("Country: " + d.Country
                                    + "<br><br>Happiness Score: " + d.happiness_score 
                                    + "<br>GDP Per Capita: " + d.gdp_per_capita 
                                    + "<br>Family: " + d.family 
                                    + "<br>Health: " + d.health 
                                    + "<br>Freedom: " + d.freedom 
                                    + "<br>Generosity: " + d.generosity 
                                    + "<br>Government Trust: " + d.government_trust 
                                    + "<br>Dystopia Residual: " + d.dystopia_residual 
                                    + "<br>Social Support: " + d.social_support 
                                    + "<br>CPI Score: " + d.cpi_score));
                    
                    circle.call(tip);
            
                    circle.on("mouseover", tip.show)
                        .on("mouseout", tip.hide);
            });
        });
    });
}

function changeMapCircleColor(){
    d3.selectAll("circle").style("fill", function(d){
        console.log(d.continent)
        if(d.continent == continent){
            if(continent == "Asia"){
                return "red";
            }
            else if(continent == "Europe"){
                return "blue";
            }
            else if(continent == "America"){
                return "yellow";
            }
            else if(continent == "Australia"){
                return "green";
            }
            else if(continent == "Africa"){
                return "purple";
            }
        }
        else{
            return "pink";
        }
    })

    d3.selectAll("circle").style("opacity", function(d){
        console.log(d.continent)
        if(d.continent == continent){
            return "0.9";
        }
        else{
            if(continent == "Global"){
                return "1.0";
            }
            return "0.5";
        }
    })
}
