data_origin = d3.csv("WorldHappiness_Corruption_2015_2020.csv");
Asia_data = data_origin.then(data =>{
    return data.filter(function(d){return d.continent == "Asia"})
})
Europe_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "Europe"})
})
America_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "North America" || d.continent == "South America"})
})
Australia_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "Australia"})
})
Africa_data = data_origin.then(d=>{
    return d.filter(function(d){return d.continent == "Africa"})
})
const checkbox_width = 100
const checkbox_height = 100
const checkbox_svg = d3.select("#checkbox").append("svg")
                        .attr("width", checkbox_width)
                        .attr("height", checkbox_height);
var Asia_check = 0
var Europe_check = 0
var America_check = 0
var Australia_check = 0
var Africa_check = 0
d3.select("#Asia_checkbox").on("change",Checkbox_Asia);
d3.select("#Europe_checkbox").on("change",Checkbox_Europe);
d3.select("#America_checkbox").on("change",Checkbox_America);
d3.select("#Australia_checkbox").on("change",Checkbox_Australia);
d3.select("#Africa_checkbox").on("change",Checkbox_Africa);

function Checkbox_Asia(){
    if(d3.select("#Asia_checkbox").property("checked")){
        console.log("Asia")
        Asia_check = 1
    }
    else{
        Asia_check = 0
    }
}
function Checkbox_Europe(){
    if(d3.select("#Europe_checkbox").property("checked")){
        console.log("Europe")
        Europe_check = 1
    }
    else{
        Europe_check = 0
    }
}
function Checkbox_America(){
    if(d3.select("#America_checkbox").property("checked")){
        console.log("America")
        America_check = 1
    }
    else{
        America_check = 0
    }
}
function Checkbox_Australia(){
    if(d3.select("#Australia_checkbox").property("checked")){
        console.log("Australia")
        Australia_check = 1
    }
    else{
        Australia_check = 0
    }
}
function Checkbox_Africa(){
    if(d3.select("#Africa_checkbox").property("checked")){
        console.log("Africa")
        Africa_check = 1
    }
    else {
        Africa_check = 0
    }
}