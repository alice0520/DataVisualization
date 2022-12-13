const width = 1300;
const height = 110;

// const svg = d3.select("#chart-area").append("svg")
//             .attr("width", width)
//             .attr("height", height);

let select = document.querySelector("div #view");
select.addEventListener("change", selectFun);

function selectFun() {
    const switchValue = select.options[select.selectedIndex].value;
    // console.log(switchValue)
    if(switchValue == "global") {
        document.getElementById("local-view").style = "display:none";
        document.getElementById("continent").style = "display:none";
        document.getElementById("global-view").style = "display:show";
        document.getElementById("map_checkbox_piechart").style = "display:show";
        document.getElementById("bar_chart_global_view").style = "display:show";
    }
    if(switchValue == "local") {
        document.getElementById("global-view").style = "display:none";
        document.getElementById("map_checkbox_piechart").style = "display:none";
        document.getElementById("bar_chart_global_view").style = "display:none";
        document.getElementById("local-view").style = "display:show";
        document.getElementById("continent").style = "display:show";
        loadLocalView();
    }
}