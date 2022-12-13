var Asia_features = ["gdp_per_capita", "health", "cpi_score"]
var Europe_features = ["gdp_per_capita", "cpi_score", "freedom"]
var America_features = ["generosity", "government_trust", "cpi_score"]
var Australia_features = ["health", "government_trust", "generosity"]
var Africa_features = ["gdp_per_capita", "dystopia_residual", "health"]
var all_features = ["gdp_per_capita", "health", "cpi_score"]

const MARGIN_s = { LEFT: 50, RIGHT: 50, TOP: 40, BOTTOM: 50 }
const BORDER_s = 150
const WIDTH_s = 1800+BORDER_s*3 - MARGIN_s.LEFT - MARGIN_s.RIGHT
const HEIGHT_s = 450 - MARGIN_s.TOP - MARGIN_s.BOTTOM
const width_s = 500 - MARGIN_s.LEFT - MARGIN_s.RIGHT
const height_s = 400 - MARGIN_s.TOP - MARGIN_s.BOTTOM

const svg_scatter = d3.select("#scatter_plot")
            .append("svg")
            .attr('width', WIDTH_s + MARGIN_s.LEFT + MARGIN_s.RIGHT)
            .attr('height', HEIGHT_s + MARGIN_s.TOP + MARGIN_s.BOTTOM)
const g_scatter1 = svg_scatter.append("g")
            .attr("transform", "translate(" + (MARGIN_s.LEFT) + "," + MARGIN_s.TOP +")");

const g_scatter2 = svg_scatter.append("g")
            .attr("transform", "translate(" + (MARGIN_s.LEFT+width_s+BORDER_s) + "," + MARGIN_s.TOP +")");
const g_scatter3 = svg_scatter.append("g")
            .attr("transform", "translate(" + (MARGIN_s.LEFT+width_s*2+2*BORDER_s) + "," + MARGIN_s.TOP +")");

var g_scatter = [g_scatter1, g_scatter2, g_scatter3]

var features = all_features

var xScale1 = d3.scaleLinear()
var yScale1 = d3.scaleLinear()
var xScale2 = d3.scaleLinear()
var yScale2 = d3.scaleLinear()
var xScale3 = d3.scaleLinear()
var yScale3 = d3.scaleLinear()
var xScale = [xScale1, xScale2, xScale3]
var yScale = [yScale1, yScale2, yScale3]

var g_x1 = g_scatter1.append("g")
var g_y1 = g_scatter1.append("g")
var g_xtext1 = g_scatter1.append("text") 
var g_ytext1 = g_scatter1.append("text")
var g_line1 = g_scatter1.append("line")
var g_line_all1 = g_scatter1.append("line")
var dotsG1 = g_scatter1.append('g')

var g_x2 = g_scatter2.append("g")
var g_y2 = g_scatter2.append("g")
var g_xtext2 = g_scatter2.append("text") 
var g_ytext2 = g_scatter2.append("text")
var g_line2 = g_scatter2.append("line")
var g_line_all2 = g_scatter2.append("line")
var dotsG2 = g_scatter2.append('g')

var g_x3 = g_scatter3.append("g")
var g_y3 = g_scatter3.append("g")
var g_xtext3 = g_scatter3.append("text") 
var g_ytext3 = g_scatter3.append("text")
var g_line3 = g_scatter3.append("line")
var g_line_all3 = g_scatter3.append("line")
var dotsG3 = g_scatter3.append('g')

var g_x = [g_x1, g_x2, g_x3]
var g_y = [g_y1, g_y2, g_y3]
var g_xtext = [g_xtext1, g_xtext2, g_xtext3]
var g_ytext = [g_ytext1, g_ytext2, g_ytext3]
var g_line = [g_line1, g_line2, g_line3]
var g_line_all = [g_line_all1, g_line_all2, g_line_all3]
var dotsG = [dotsG1, dotsG2, dotsG3]

d3.csv("/WorldHappiness.csv").then(data =>{
    data.forEach(d => {
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
    })
    tmpdata = data
    for (i = 0; i < 3; ++i){
        xScale[i].domain(d3.extent(data, d=>Number(d.happiness_score)))
                 .range([0, width_s]);
        yScale[i].domain(d3.extent(data, d=>Number(d[features[i]])))
                 .range([height_s, 0]);
                    
        g_x[i]
            .attr("transform", "translate(0," + height_s + ")")
            .call(d3.axisBottom(xScale[i]));
        g_y[i]
            .call(d3.axisLeft(yScale[i]));
        g_xtext[i]
            .attr("transform", "translate(" + (width_s-180) + " ," + (height_s+40) + ")")
            .text("Happiness score")
            .style("font-size", "25px")
            .style("font-weight", "bold")
            .style("font-family", "Times, Times New Roman, Georgia, serif");
        g_ytext[i]
            .attr("y", MARGIN_s.TOP-60)
            .attr("x", -20 )
            .text(features[i])
            .style("font-size", "25px")
            .style("font-weight", "bold")
            .style("font-family", "Times, Times New Roman, Georgia, serif");
        
        var lg = calcLinear(data, "happiness_score", features[i], d3.min(data, function(d){ return d.happiness_score}), d3.max(data, function(d){ return d.happiness_score}));
        g_line_all[i]
            .attr("class", "regression")
            .attr("x1", xScale[i](lg.ptA.x))
            .attr("y1", yScale[i](lg.ptA.y))
            .attr("x2", xScale[i](lg.ptB.x))
            .attr("y2", yScale[i](lg.ptB.y))
            .style("stroke-width", 3)
            .style("stroke-dasharray", '4,4')
            .style("stroke", "grey");
            
        var lg = calcLinear(tmpdata, "happiness_score", features[i], d3.min(data, function(d){ return d.happiness_score}), d3.max(data, function(d){ return d.happiness_score}));
        g_line[i]
            .attr("class", "regression")
            .attr("x1", xScale[i](lg.ptA.x))
            .attr("y1", yScale[i](lg.ptA.y))
            .attr("x2", xScale[i](lg.ptB.x))
            .attr("y2", yScale[i](lg.ptB.y))
            .style("stroke-width", 3)
            .style("stroke", "black");            

        // Add dots
        dots = dotsG[i].selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale[i](d.happiness_score); } )
            .attr("cy", function (d) { return yScale[i](d[features[i]]); } )
            .attr("r", 3)
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
            .style("stroke-width", 0.8)
            .style("stroke", "black");
            
        tip = d3.tip().attr('class', 'd3-tip')
        .html(d=>
        `<div class="tip">
            <span> country: ${d.Country}</span>
            <span> year: ${d.Year}</span>
        </div>`);
        dots.on('mouseover',tip.show)
        dots.on('mouseout', tip.hide)
        dotsG[i].call(tip)
    }
})


function Update_scatter(name){
    // d3.select("#scatter_plot").selectAll("circle").remove();
    features = []
    if(name == "Global"){
        features = all_features
    }
    else if(name == "Asia"){
        features = Asia_features
    }
    else if(name == "Europe"){
        features = Europe_features
    }
    else if(name == "Australia"){
        features = Australia_features
    }
    else if(name =="Africa"){
        features = Africa_features
    }
    else{
        features = America_features
    }
    d3.csv("/WorldHappiness.csv").then(data =>{
        data.forEach(d => {
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
        })
        if(name == "Global"){
            tmpdata = data
        }
        else if (name == "America"){
            tmpdata = data.filter(d => (d.continent == "South America" || d.continent == "North America"))
        }
        else{
            tmpdata = data.filter(d => d.continent == name)
        }
        for (i = 0; i < 3; ++i){
            yScale[i]
                .domain(d3.extent(data, d=>Number(d[features[i]]))) 
                
            g_y[i]
                .transition().duration(500)
                .call(d3.axisLeft(yScale[i]));
                
            g_ytext[i]
                .transition().duration(500)
                .text(features[i])

            var newlg = calcLinear(data, "happiness_score", features[i], d3.min(data, function(d){ return d.happiness_score}), d3.max(data, function(d){ return d.happiness_score}));
            g_line_all[i]
                .transition().duration(500)
                .attr("x1", xScale[i](newlg.ptA.x))
                .attr("y1", yScale[i](newlg.ptA.y))
                .attr("x2", xScale[i](newlg.ptB.x))
                .attr("y2", yScale[i](newlg.ptB.y))
                
            var newlg = calcLinear(tmpdata, "happiness_score", features[i], d3.min(data, function(d){ return d.happiness_score}), d3.max(data, function(d){ return d.happiness_score}));
            g_line[i]
                .transition().duration(500)
                .attr("x1", xScale[i](newlg.ptA.x))
                .attr("y1", yScale[i](newlg.ptA.y))
                .attr("x2", xScale[i](newlg.ptB.x))
                .attr("y2", yScale[i](newlg.ptB.y))

            dotsG[i].selectAll("circle")
                .transition().duration(600)
                .attr("cx", function (d) { return xScale[i](d.happiness_score); } )
                .attr("cy", function (d) { return yScale[i](d[features[i]]); } )
                .attr("r", 3)
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
                .attr('opacity', function(d){
                    if(name == "Global"){
                        return 0.7;
                    }
                    else if(d.continent == name){
                        return 0.8;
                    }
                    else if(name == "America" && (d.continent == "South America" || d.continent == "North America")){
                        return 0.8;
                    }
                    else{
                        return 0.1;
                    }
                })
                .style("stroke-width", 1)
                .style("stroke", "black");

            tip = d3.tip().attr('class', 'd3-tip')
            .html(d=>
            `<div class="tip">
                <span> country: ${d.Country}</span>
                <span> year: ${d.Year}</span>
            </div>`);
            dots.on('mouseover',tip.show)
            dots.on('mouseout', tip.hide)
            dotsG[i].call(tip)
        }
    });
}


function calcLinear(data, x, y, minX, maxX){
    var n = data.length;

    // Get just the points
    var pts = [];
    data.forEach(function(d){
      var obj = {};
      obj.x = d[x];
      obj.y = d[y];
      obj.mult = obj.x*obj.y;
      pts.push(obj);
    });
    // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
    // Let b equal the sum of all x-values times the sum of all y-values
    // Let c equal n times the sum of all squared x-values
    // Let d equal the squared sum of all x-values
    var sum = 0;
    var xSum = 0;
    var ySum = 0;
    var sumSq = 0;
    pts.forEach(function(pt){
      sum = sum + pt.mult;
      xSum = xSum + pt.x;
      ySum = ySum + pt.y;
      sumSq = sumSq + (pt.x * pt.x);
    });
    
    var a = sum * n;
    var b = xSum * ySum;
    var c = sumSq * n;
    var d = xSum * xSum;

    // slope = m = (a - b) / (c - d)
    var m = (a - b) / (c - d);

    /////////////
    //INTERCEPT//
    /////////////

    // Let e equal the sum of all y-values
    var e = ySum;

    // Let f equal the slope times the sum of all x-values
    var f = m * xSum;

    // Plug the values you have calculated for e and f into the following equation for the y-intercept
    // y-intercept = b = (e - f) / n
    var b = (e - f) / n;
    
    return {
      ptA : {
        x: minX,
        y: m * minX + b
      },
      ptB : {
        y: m * maxX + b,        //maxY
        x: maxX     //(maxY - b) / m
      }
    }
}

