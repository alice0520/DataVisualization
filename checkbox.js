data_origin = d3.csv("WorldHappiness_Corruption_2015_2020.csv");
data_map = d3.json("world-map.json")
// global view map
const map_global_view_width = 800
const map_global_view_height = 500
const svg_map = d3.select("#map_global_view")
                    .append("svg")
                    .attr("width", map_global_view_width)
                    .attr("height", map_global_view_height)
const map_checkbox_g = svg_map.append("g")                    
    .attr("transform", `translate(${0}, ${80})`);
var projection;
var geoGenerator;
draw_map_global()


function draw_map_global(){
    data_map.then(countries => { 
        projection = d3.geoMercator()
                        .fitExtent([[0,0], [width_map,height_map]], countries);
        geoGenerator = d3.geoPath()
                        .projection(projection);
        map_checkbox_g.selectAll('path')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('stroke', 'black')
                .attr('fill', 'white')
                .attr('class', function(d) {return d.properties.continent})
                .attr('d', geoGenerator);
        map_checkbox_g.selectAll('.Asia')
                .attr('fill', 'red');
        map_checkbox_g.selectAll('.Africa')
                .attr('fill', 'purple');
    })
}

// checkbox
Asia_data = data_origin.then(d =>{
    return d.filter(function(d){return d.continent == "Asia"})
})
Europe_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "Europe"})
})
America_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "America"})
})
Australia_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "Australia"})
})
Africa_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "Africa"})
})
const checkbox_width = 100
const checkbox_height = 150
const checkbox = d3.select("#checkbox")
var Asia_check = 1
var Europe_check = 0
var America_check = 0
var Australia_check = 0
var Africa_check = 1
var cnt_check = 2
continent_A = "Asia"
continent_B = "Africa"
color_A = "red"
color_B = "purple"
d3.select("#Asia_checkbox").on("change",Checkbox_Asia);
d3.select("#Europe_checkbox").on("change",Checkbox_Europe);
d3.select("#America_checkbox").on("change",Checkbox_America);
d3.select("#Australia_checkbox").on("change",Checkbox_Australia);
d3.select("#Africa_checkbox").on("change",Checkbox_Africa);

Update_GlobalView_Map();
Select_Two_Continent();
Draw_Barchart();

function Checkbox_Asia(){
    if(d3.select("#Asia_checkbox").property("checked")){
        Asia_check = 1
        cnt_check += 1
    }
    else{
        Asia_check = 0
        cnt_check -= 1
    }
    Update_GlobalView_Map()
    Select_Two_Continent()
    Update_Barchart()
}
function Checkbox_Europe(){
    if(d3.select("#Europe_checkbox").property("checked")){
        Europe_check = 1
        cnt_check += 1
    }
    else{
        Europe_check = 0
        cnt_check -= 1
    }
    Update_GlobalView_Map()
    Select_Two_Continent()
    Update_Barchart()
}
function Checkbox_America(){
    if(d3.select("#America_checkbox").property("checked")){
        America_check = 1
        cnt_check += 1
    }
    else{
        America_check = 0
        cnt_check -= 1
    }
    Update_GlobalView_Map()
    Select_Two_Continent()
    Update_Barchart()
}
function Checkbox_Australia(){
    if(d3.select("#Australia_checkbox").property("checked")){
        Australia_check = 1
        cnt_check += 1
    }
    else{
        Australia_check = 0
        cnt_check -= 1
    }
    Update_GlobalView_Map()
    Select_Two_Continent()
    Update_Barchart()
}
function Checkbox_Africa(){
    if(d3.select("#Africa_checkbox").property("checked")){
        Africa_check = 1
        cnt_check += 1
    }
    else {
        Africa_check = 0
        cnt_check -= 1
    }
    Update_GlobalView_Map()
    Select_Two_Continent()
    Update_Barchart()
}
// assign continent to variable continent_A, continent_B
function Select_Two_Continent() {
    var flag = 0
    if(cnt_check == 2){
        if(Asia_check) {
            if(flag) {
                continent_B = "Asia"
                color_B = "red"
            }
            else {
                continent_A = "Asia"
                color_A = "red"
                flag = 1
            }
        }
        if(Europe_check) {
            if(flag) {
                continent_B = "Europe"
                color_B = "blue"
            }
            else {
                continent_A = "Europe"
                color_A = "blue"
                flag = 1
            }
        }
        if(America_check) {
            if(flag) {
                continent_B = "America"
                color_B = "yellow"
            }
            else {
                continent_A = "America"
                color_A = "yellow"
                flag = 1
            }
        }
        if(Australia_check) {
            if(flag) {
                continent_B = "Australia"
                color_B = "green"
            }
            else {
                continent_A = "Australia"
                color_A = "green"
                flag = 1
            }
        }
        if(Africa_check) {
            if(flag) {
                continent_B = "Africa"
                color_B = "purple"
            }
            else {
                continent_A = "Africa"
                color_A = "purple"
                flag = 1
            }
        }
        notSelected = false;
    }
    else{
        notSelected = true;
        // continent_A = null
        // continent_B = null
    }
}

function Reset_Default() {
    cnt_check = 2;
    Asia_check = 1
    Africa_check = 1
    America_check = 0
    Europe_check = 0
    Australia_check = 0
    document.getElementById("Asia_checkbox").checked = true;
    document.getElementById("Europe_checkbox").checked = false;
    document.getElementById("America_checkbox").checked = false;
    document.getElementById("Australia_checkbox").checked = false;
    document.getElementById("Africa_checkbox").checked = true;
    Update_GlobalView_Map();
    Select_Two_Continent();
    Update_Barchart();
}

function Update_GlobalView_Map(){
    if(cnt_check == 0) {
        map_checkbox_g.selectAll('path')
                .attr('fill', 'white');
    }
    else if(cnt_check == 1) {
        map_checkbox_g.selectAll('path')
                .attr('fill', 'white');
        if(Asia_check) {
            map_checkbox_g.selectAll(".Asia")
                .attr('fill', 'red');
        }
        if(Europe_check){
            map_checkbox_g.selectAll(".Europe")
                .attr('fill', 'blue');
        }
        if(America_check) {
            map_checkbox_g.selectAll(".America")
                .attr('fill', 'yellow');
            map_checkbox_g.selectAll(".America")
                .attr('fill', 'yellow');
        }
        if(Australia_check){
            map_checkbox_g.selectAll(".Australia")
                .attr('fill', 'green');
        }
        if(Africa_check) {
            map_checkbox_g.selectAll(".Africa")
                .attr('fill', 'purple');
        }
    }
    else if(cnt_check == 2){
        map_checkbox_g.selectAll('path')
                .attr('fill', 'white');
        if(Asia_check) {
            map_checkbox_g.selectAll(".Asia")
                .attr('fill', 'red');
        }
        if(Europe_check){
            map_checkbox_g.selectAll(".Europe")
                .attr('fill', 'blue');
        }
        if(America_check) {
            map_checkbox_g.selectAll(".America")
                .attr('fill', 'yellow');
            map_checkbox_g.selectAll(".America")
                .attr('fill', 'yellow');
        }
        if(Australia_check){
            map_checkbox_g.selectAll(".Australia")
                .attr('fill', 'green');
        }
        if(Africa_check) {
            map_checkbox_g.selectAll(".Africa")
                .attr('fill', 'purple');
        }
    }
    else if(cnt_check > 2){
        alert("Please select two continent only.");
        Reset_Default();
    }
}


