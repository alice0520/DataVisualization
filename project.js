var Asia_features = ["gdp_per_capita", "health", "cpi_score"]
var Europe_features = ["gdp_per_capita", "cpi_score", "freedom"]
var America_features = ["generosity", "government_trust", "cpi_score"]
var Australia_features = ["health", "government_trust", "generosity"]
var Africa_features = ["gdp_per_capita", "dystopia_residual", "health"]
var all_features = ["gdp_per_capita", "health", "cpi_score"]

const MARGIN_s = { LEFT: 50, RIGHT: 50, TOP: 50, BOTTOM: 50 }
const WIDTH_s = 1500 - MARGIN_s.LEFT - MARGIN_s.RIGHT
const HEIGHT_s = 500 - MARGIN_s.TOP - MARGIN_s.BOTTOM
const width_s = 500 - MARGIN_s.LEFT - MARGIN_s.RIGHT
const height_s = 500 - MARGIN_s.TOP - MARGIN_s.BOTTOM

const svg_scatter = d3.select("#scatter_plot")
            .append("svg")
            .attr('width', WIDTH_s + MARGIN_s.LEFT + MARGIN_s.RIGHT)
            .attr('height', HEIGHT_s + MARGIN_s.TOP + MARGIN_s.BOTTOM)
const g_scatter1 = svg_scatter.append("g")
            .attr("transform", "translate(" + (MARGIN_s.LEFT) + "," + MARGIN_s.TOP +")");

const g_scatter2 = svg_scatter.append("g")
            .attr("transform", "translate(" + (MARGIN_s.LEFT+width_s+80) + "," + MARGIN_s.TOP +")");
const g_scatter3 = svg_scatter.append("g")
            .attr("transform", "translate(" + (MARGIN_s.LEFT+width_s*2+160) + "," + MARGIN_s.TOP +")");
g_scatter = [g_scatter1, g_scatter2, g_scatter3]    //, g_scatter2, g_scatter3           
        
function Scatter_plot(name, year){
    d3.selectAll("#scatter_plot g *").remove();
    // svg_scatter.remove()
    if(name == "Global"){}
    else if(name == "Asia"){
        all_features = Asia_features
    }
    else if(name == "Europe"){
        all_features = Europe_features
    }
    else if(name == "Australia"){
        all_features = Australia_features
    }
    else if(name =="Africa"){
        all_features = Africa_features
    }
    else{
        all_features = America_features
    }

    d3.csv("/WorldHappiness.csv").then(data =>{
        if(name == "Global"){
            data = data.filter(d => d.Year == year)
        }
        else if(name == "America"){
            data = data.filter(d => d.continent == "South America" || d.continent == "North America")
        }
        else{
            data = data.filter(d => d.continent == name && d.Year == year)
        }
        
        for (i = 0; i < 3; ++i){
            var xScale = d3.scaleLinear()
                        .domain(d3.extent(data, d=>Number(d.happiness_score)))
                        .range([0, width_s]);
            var yScale = d3.scaleLinear()
                        .domain(d3.extent(data, d=>Number(d[all_features[i]])))
                        .range([height_s, 0]);
                        
            g_scatter[i].append("g")
                .attr("transform", "translate(0," + HEIGHT_s + ")")
                .call(d3.axisBottom(xScale));
            g_scatter[i].append("g")
                .call(d3.axisLeft(yScale));
            g_scatter[i].append("text")             
                .attr("transform",
                        "translate(" + (width_s-180) + " ," + 
                                    (height_s+40) + ")")
                .text("Happiness score")
                .style("font-size", "25px")
                .style("font-weight", "bold")
                .style("font-family", "Times, Times New Roman, Georgia, serif");
            g_scatter[i].append("text")     
                .attr("y", MARGIN_s.TOP-60)
                .attr("x", -20 )
                .text(all_features[i])
                .style("font-size", "25px")
                .style("font-weight", "bold")
                .style("font-family", "Times, Times New Roman, Georgia, serif");
              
                
            // Add dots
            var dotsG = g_scatter[i].append('g')
            var dots = dotsG.selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.happiness_score); } )
                    .attr("cy", function (d) { return yScale(d[all_features[i]]); } )
                    .attr("r", 3 )
                    .style("fill", function(d){
                        if(d.continent == "Asia"){
                            return "red";
                        }
                        else if(d.continent == "Europe"){
                            return "blue";
                        }
                        else if(d.continent == "Australia"){
                            return "green";
                        }
                        else if(d.continent == "Africa"){
                            return "purple";
                        }
                        else{
                            return "yellow";
                        }
                    })
                    .attr('opacity', 0.7)
                    .style("stroke-width", 1)
                    .style("stroke", "black");
                
            tip = d3.tip().attr('class', 'd3-tip')
            .html(d=>
            `<div class="tip">
                <span> ${d.Country}</span>
            </div>`);
            dots.on('mouseover',tip.show)
            dots.on('mouseout', tip.hide)
            dotsG.call(tip)
        }
    });
    
}
 
// console.log(data_origin)
// console.log(Asia)
Scatter_plot("Asia", 2019)
