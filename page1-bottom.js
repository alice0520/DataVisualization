const FWith = 400, FHeight = 300;
const FLeftTopX = 100, FLeftTopY = 30;
const MARGIN = { LEFT: 50, RIGHT: 20, TOP: 20, BOTTOM: 100 };
const WIDTH = FWith - (MARGIN.LEFT + MARGIN.RIGHT);
const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM);
var clicked = false;
var years;
var color;
var BarChart_svg = d3.select("#bar_chart_global_view")
                .append("svg")
                .attr("width", 2000)
                .attr("height", 700);
var bar_chart_g = BarChart_svg.append("g")
                .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`);

var bar_chart_g1 = bar_chart_g.append("g")
                                .attr("transform", `translate(0, ${MARGIN.TOP})`);
var bar_chart_g1_text1= bar_chart_g.append("g").append("text");
var bar_chart_g1_text2= bar_chart_g.append("g").append("text");
var bar_chart_g1_bars = bar_chart_g1.append("g");
var bar_chart_g2 = bar_chart_g.append("g")
                                .attr("transform", `translate(0, ${MARGIN.TOP})`);
var bar_chart_g2_text1= bar_chart_g.append("g").append("text");
var bar_chart_g2_text2= bar_chart_g.append("g").append("text");
var bar_chart_g2_bars=bar_chart_g2.append("g").attr("transform", `translate(0, ${HEIGHT*2})`);

var bar_chart_g3 = bar_chart_g.append("g")
                                        .attr("transform", `translate(${WIDTH+MARGIN.LEFT*2.5}, ${MARGIN.TOP})`);
var bar_chart_g3_text1= bar_chart_g.append("g").append("text");
var bar_chart_g3_text2= bar_chart_g.append("g").append("text");
var bar_chart_g3_bars=bar_chart_g3.append("g");
var bg = bar_chart_g1.append("g");
var x;
var xAxisCall;
var y;
var yAxisCall;
var countries;
var xSubgroup;
var x_country;
var xAxisCall_2nd;
var y_country;
var yAxisCall_2nd;
var x_feature;
var xAxisCall_3rd;
var y_feature;
var yAxisCall_3rd;
var xSubgroup_feature;
var bar_chart_g1_x=bar_chart_g1.append("g")
                                .attr("transform", `translate(0, ${HEIGHT})`);
var bar_chart_g1_y = bar_chart_g1.append("g");
var bar_chart_g2_y=bar_chart_g2.append("g")
                                .attr("transform", `translate(0, ${HEIGHT*2})`);
var bar_chart_g2_x=bar_chart_g2.append("g").attr("transform", `translate(0, ${HEIGHT*3})`);
var selectedFeature="happiness_score";
var notSelected = false;
function changeFeature(){
    selectedFeature = document.getElementById("Features").value;
    console.log(selectedFeature);
    Update_Barchart();
}

function clickSortButton(){
    clicked = !clicked;
    Update_Barchart();
}

function Draw_Barchart(){
    const features = ["gdp_per_capita","family","health","freedom","generosity",
        "government_trust","dystopia_residual","social_support","cpi_score"];
    // d3.selectAll("#bar_chart_global_view g > *").remove();
    d3.csv("WorldHappiness_Corruption_2015_2020.csv",d3.autoType).then(data =>{
        console.log(data);
        
        data = data.filter(a => a.continent==continent_A || a.continent==continent_B );
        // X, Y ticks for the first bar chart
        years = new Set();
        data.forEach(element => {
            years.add(element.Year);
        });
        
        bar_chart_g1_text1
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("font-size", "15px")
                        .attr("text-anchor", "middle")
                        .text(selectedFeature);
        bar_chart_g1_text2
                        .attr("x", WIDTH/2)
                        .attr("y", HEIGHT+MARGIN.TOP*3)
                        .attr("font-size", "15px")
                        .attr("text-anchor", "middle")
                        .text("years");

        x = d3.scaleBand()
                    .domain(Array.from(years))
                    .range([0, WIDTH]);
        console.log(x.bandwidth(),WIDTH);
        xAxisCall = d3.axisBottom(x)
                            .ticks(5);
        bar_chart_g1_x.call(xAxisCall);
    
        y = d3.scaleLinear()
                    .domain(d3.extent(data, d=>d[selectedFeature]))
                    .range([HEIGHT, 0])
        // console.log(y.domain());                    
        yAxisCall = d3.axisLeft(y)
                            .ticks(5);
        
        // The first bar chart
        bar_chart_g1_y.call(yAxisCall);
    
        xSubgroup = d3.scaleBand()
                        .domain([continent_A,continent_B])
                        .range([0, x.bandwidth()]);
    
        color = d3.scaleOrdinal()
                    .domain(xSubgroup.domain())
                    .range([color_A,color_B]);

        var conti_year_avg = [];
        years.forEach(year=>{
            var contiA_data = data.filter(a => a.continent==continent_A&&a.Year==year);
            var contiB_data = data.filter(a => a.continent==continent_B&&a.Year==year);
            var sum=0,cnt=0;
            contiA_data.forEach(d=>{
                sum+=d[selectedFeature];
                cnt+=1;
            })
            var element = {};
            element["continent"]=continent_A;
            element["Year"]=year;
            element["avg"]=sum/cnt;
            conti_year_avg.push(element);

            sum=0;
            cnt=0;
            contiB_data.forEach(d=>{
                sum+=d[selectedFeature];
                cnt+=1;
            })
            element = {};
            element["continent"]=continent_B;
            element["Year"]=year;
            element["avg"]=sum/cnt;
            conti_year_avg.push(element);
        })
        
        // console.log(conti_year_avg);
        
        bar_chart_g1_bars.selectAll("rect")
                    .data(conti_year_avg)
                    .enter()
                    .append("rect")
                    .attr("x", d=>xSubgroup(d.continent)+x(d.Year)+ (d.continent==continent_A? xSubgroup.bandwidth()*1/3 : 0))
                    .attr("y", d=>y(d.avg))
                    .attr("width", xSubgroup.bandwidth()*2/3)
                    .attr("height", d=>HEIGHT-y(d.avg))
                    .style("fill", function(d) { return color(d.continent); })
                    .style('stroke','black');
        
    
        // X, Y ticks for the second bar chart
        
        bar_chart_g2_text1
                        .attr("x", 0)
                        .attr("y", HEIGHT*2)
                        .attr("font-size", "15px")
                        .attr("text-anchor", "middle")
                        .text(selectedFeature);
        bar_chart_g2_text2
                        .attr("x", WIDTH*2.25)
                        .attr("y", HEIGHT*3+MARGIN.TOP*5)
                        .attr("font-size", "15px")
                        .attr("text-anchor", "middle")
                        .text("countries");

        countries = new Set();
        data.forEach(element => {
            countries.add(element.Country);
        });
        // console.log(Array.from(countries));

        var country_data = [];

        countries.forEach(country=>{
            var oneCountryData = data.filter(a=>a.Country==country);
            var sum = 0;
            var country_avg = {};
            var continent;
            oneCountryData.forEach(d=>{
                sum+=d[selectedFeature];
                continent=d.continent;
            })
            country_avg["country"]=country;
            country_avg["avg"]=sum/6;
            country_avg["continent"]=continent;
            country_data.push(country_avg);
        })
        // console.log(country_data);
        if(clicked){
            country_data=country_data.sort(function(a, b) {
                return d3.descending(a.avg, b.avg);
            })
        }
        else{
            country_data=country_data.sort(function(a, b) {
                return d3.ascending(a.country, b.country);
            })
        }
        // console.log(country_data);
        x_country = d3.scaleBand()
                    .domain(country_data.map(function(d) {
                        return d.country;
                    }))
                    .range([0, WIDTH*4.5]);
        xAxisCall_2nd = d3.axisBottom(x_country)
                                .ticks(5);
        bar_chart_g2_x
                    .call(xAxisCall_2nd)
                    .selectAll("text")
                    .attr("text-anchor","end")
                    .attr("transform","rotate(-30)");
    
        y_country = d3.scaleLinear()
                    .domain(d3.extent(data, d=>d[selectedFeature]))
                    .range([HEIGHT, 0])
         
        yAxisCall_2nd = d3.axisLeft(y_country)
                                .ticks(5);
        
        bar_chart_g2_y.call(yAxisCall_2nd);

        
        bar_chart_g2_bars.selectAll("rect")
                        .data(country_data)
                        .enter()
                        .append("rect")
                        .attr("x", (d)=>x_country(d.country))
                        .attr("y", (d)=>y_country(d.avg))
                        .attr("width", x_country.bandwidth)
                        .attr("height", (d)=>HEIGHT-y_country(d.avg))
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');

        // X, Y ticks for the third bar chart
        // console.log(Array.from(countries));

        
        bar_chart_g3_text1
                        .attr("x", WIDTH+MARGIN.LEFT*2.5)
                        .attr("y", 0)
                        .attr("font-size", "15px")
                        .attr("text-anchor", "middle")
                        .text("normalized");
        bar_chart_g3_text2
                        .attr("x", WIDTH*3)
                        .attr("y", HEIGHT+MARGIN.TOP*4)
                        .attr("font-size", "15px")
                        .attr("text-anchor", "middle")
                        .text("features");

        x_feature = d3.scaleBand()
                            .domain(features)
                            .range([0, WIDTH*3]);
    
        xAxisCall_3rd = d3.axisBottom(x_feature)
                                .ticks(5);

        bar_chart_g3.append("g")
                    .attr("transform", `translate(0, ${HEIGHT})`)
                    .call(xAxisCall_3rd)
                    .selectAll("text")
                    .attr("text-anchor","middle");
    
        y_feature = d3.scaleLinear()
                    .domain([0,1])
                    .range([HEIGHT, 0])
         
        yAxisCall_3rd = d3.axisLeft(y_feature)
                                .ticks(5);
        bar_chart_g3.append("g")
                    .call(yAxisCall_3rd);

        xSubgroup_feature = d3.scaleBand()
                        .domain([continent_A,continent_B])
                        .range([0, x_feature.bandwidth()]);
        var feature_avg = [];
        features.forEach(feature=>{
            // console.log(feature);
            var contiA_data = data.filter(a => a.continent==continent_A);
            var contiB_data = data.filter(a => a.continent==continent_B);
            var sum=0,cnt=0,max=0;
            contiA_data.forEach(d=>{
                sum+=d[feature];
                cnt+=1;
                if(d[feature]>max) max=d[feature];
            })
            var element = {};
            element["continent"]=continent_A;
            element["feature"]=feature;
            element["avg"]=max==0? 0: (sum/cnt)/max;
            feature_avg.push(element);

            sum=0;
            cnt=0;
            max=0;
            contiB_data.forEach(d=>{
                sum+=d[feature];
                cnt+=1;
                if(d[feature]>max) max=d[feature];
            })
            element = {};
            element["continent"]=continent_B;
            element["avg"]=max==0? 0: (sum/cnt)/max;
            element["feature"]=feature;
            feature_avg.push(element);
        })
        
        bar_chart_g3_bars.selectAll("rect")
                        .data(feature_avg)
                        .enter()
                        .append("rect")
                        .attr("x", (d) => xSubgroup_feature(d.continent)+x_feature(d.feature)+(d.continent==continent_A? xSubgroup_feature.bandwidth()*1/3 : 0))
                        .attr("y", (d) => y_feature(d.avg))
                        .attr("width", xSubgroup_feature.bandwidth()*2/3)
                        .attr("height", (d) => HEIGHT-y_feature(d.avg))
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');

        
        var brush = d3.brushX()
                    .extent([[0, 0], [WIDTH, HEIGHT]])
                    .on("start", Brushed)
                    .on("brush", Brushed)
                    .on("end", EndBrushed);

        bg.call(brush);
        var min_year=2015,max_year=2020;
        function Brushed(){
            var extent = d3.event.selection;
            
            if(extent[0]!=extent[1]){
                min_year = x.domain()[Math.floor((extent[0] / x.step()))];
                max_year = x.domain()[Math.floor((extent[1] / x.step()))];
                if(max_year==undefined) max_year=2020;
                if(min_year==undefined) min_year=2015;
                // console.log(min_year,max_year);
            }
            else{
                // console.log(extent);
                min_year=2015;
                max_year=2020;
            }
        }

        function EndBrushed(){
            country_data = [];
            countries.forEach(country=>{
                var oneCountryData = data.filter(a=>a.Country==country&&a.Year<=max_year&&a.Year>=min_year);
                var sum = 0;
                var country_avg = {};
                var continent;
                // console.log(oneCountryData);
                oneCountryData.forEach(d=>{
                    sum+=d[selectedFeature];
                    continent=d.continent;
                })
                country_avg["country"]=country;
                country_avg["avg"]=sum/(max_year-min_year+1);
                country_avg["continent"]=continent;
                country_data.push(country_avg);
            })
            if(clicked){
                country_data=country_data.sort(function(a, b) {
                    return d3.descending(a.avg, b.avg);
                })
            }
            else{
                country_data=country_data.sort(function(a, b) {
                    return d3.ascending(a.country, b.country);
                })
            }
            // console.log(country_data);
            x_country = d3.scaleBand()
                            .domain(country_data.map(function(d) {
                                return d.country;
                            }))
                            .range([0, WIDTH*4.5]);
            xAxisCall_2nd = d3.axisBottom(x_country)
                                .ticks(5);
            bar_chart_g2_x.call(xAxisCall_2nd)
                        .selectAll("text")
                        .attr("text-anchor","end")
                        .attr("transform","rotate(-30)");
            bar_chart_g2_bars.selectAll("rect")
                        .data(country_data)
                        .transition()
                        .duration(500)
                        .attr("x", (d)=>x_country(d.country))
                        .attr("y", (d)=>y_country(d.avg))
                        .attr("width", x_country.bandwidth)
                        .attr("height", function(d){ return HEIGHT-y_country(d.avg)})
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');
            feature_avg = [];
            features.forEach(feature=>{
                // console.log(feature);
                var contiA_data = data.filter(a => a.continent==continent_A&&a.Year<=max_year&&a.Year>=min_year);
                var contiB_data = data.filter(a => a.continent==continent_B&&a.Year<=max_year&&a.Year>=min_year);
                var sum=0,cnt=0,max=0;
                contiA_data.forEach(d=>{
                    sum+=d[feature];
                    cnt+=1;
                    if(d[feature]>max) max=d[feature];
                })
                var element = {};
                element["continent"]=continent_A;
                element["feature"]=feature;
                element["avg"]=max==0? 0:(sum/cnt)/max;
                feature_avg.push(element);
    
                sum=0;
                cnt=0;
                max=0;
                contiB_data.forEach(d=>{
                    sum+=d[feature];
                    cnt+=1;
                    if(d[feature]>max) max=d[feature];
                })
                element = {};
                element["continent"]=continent_B;
                element["avg"]=max==0? 0:(sum/cnt)/max;
                element["feature"]=feature;
                feature_avg.push(element);
            })
            // console.log(feature_avg);
            bar_chart_g3_bars.selectAll("rect")
                        .data(feature_avg)
                        .transition()
                        .duration(500)
                        .attr("x", (d) => xSubgroup_feature(d.continent)+x_feature(d.feature)+(d.continent==continent_A? xSubgroup_feature.bandwidth()*1/3 : 0))
                        .attr("y", (d) => y_feature(d.avg))
                        .attr("width", xSubgroup_feature.bandwidth()*2/3)
                        .attr("height", (d) => HEIGHT-y_feature(d.avg))
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');
        }

    })
}

function Update_Barchart(){
    const features = ["gdp_per_capita","family","health","freedom","generosity",
        "government_trust","dystopia_residual","social_support","cpi_score"];
    // d3.selectAll("#bar_chart_global_view g > *").remove();
    d3.csv("WorldHappiness_Corruption_2015_2020.csv",d3.autoType).then(data =>{
        console.log(data);
        data = data.filter(a => a.continent==continent_A || a.continent==continent_B );
        // X, Y ticks for the first bar chart
        years = new Set();
        data.forEach(element => {
            years.add(element.Year);
        });
        
        bar_chart_g1_text1
        .transition().duration(500)
        .text(selectedFeature);
    
        y = d3.scaleLinear()
                    .domain(d3.extent(data, d=>d[selectedFeature]))
                    .range([HEIGHT, 0]);
        // // console.log(y.domain());                    
        yAxisCall = d3.axisLeft(y)
                        .ticks(5);
        // The first bar chart
        bar_chart_g1_y.transition().duration(500).call(yAxisCall);
    
        xSubgroup.domain([continent_A,continent_B])
                .range([0, x.bandwidth()]);
        color = d3.scaleOrdinal()
                    .domain(xSubgroup.domain())
                    .range([color_A,color_B]);

        var conti_year_avg = [];
        years.forEach(year=>{
            var contiA_data = data.filter(a => a.continent==continent_A&&a.Year==year);
            var contiB_data = data.filter(a => a.continent==continent_B&&a.Year==year);
            var sum=0,cnt=0;
            if(!notSelected){
                contiA_data.forEach(d=>{
                    sum+=d[selectedFeature];
                    cnt+=1;
                })
            }
            
            var element = {};
            element["continent"]=continent_A;
            element["Year"]=year;
            element["avg"]=cnt==0? y.domain()[0] : sum/cnt;
            conti_year_avg.push(element);

            sum=0;
            cnt=0;
            if(!notSelected){
                contiB_data.forEach(d=>{
                    sum+=d[selectedFeature];
                    cnt+=1;
                })
            }

            element = {};
            element["continent"]=continent_B;
            element["Year"]=year;
            element["avg"]=cnt==0? y.domain()[0] : sum/cnt;
            conti_year_avg.push(element);
        })
        
        console.log(conti_year_avg);
        
        bar_chart_g1_bars.selectAll("rect")
                    .data(conti_year_avg)
                    .transition()
                    .duration(500)
                    .attr("x", d=>xSubgroup(d.continent)+x(d.Year)+ (d.continent==continent_A? xSubgroup.bandwidth()*1/3 : 0))
                    .attr("y", d=>y(d.avg))
                    .attr("width", xSubgroup.bandwidth()*2/3)
                    .attr("height", d=>HEIGHT-y(d.avg))
                    .style("fill", function(d) { return color(d.continent); })
                    .style('stroke','black');
        
    
        // X, Y ticks for the second bar chart
        
        bar_chart_g2_text1.transition().duration(500).text(selectedFeature);

        countries = new Set();
        data.forEach(element => {
            countries.add(element.Country);
        });
        // console.log(Array.from(countries));

        var country_data = [];

        countries.forEach(country=>{
            var oneCountryData = data.filter(a=>a.Country==country);
            var sum = 0;
            var country_avg = {};
            var continent;
            if(!notSelected){
                oneCountryData.forEach(d=>{
                    sum+=d[selectedFeature];
                    continent=d.continent;
                })
            }
            country_avg["country"]=country;
            country_avg["avg"]=notSelected? y_country.domain()[0] : sum/6;
            country_avg["continent"]=continent;
            country_data.push(country_avg);
        })
        
        console.log(country_data);
        if(clicked){
            country_data=country_data.sort(function(a, b) {
                return d3.descending(a.avg, b.avg);
            })
        }
        else{
            country_data=country_data.sort(function(a, b) {
                return d3.ascending(a.country, b.country);
            })
        }
        // console.log(country_data);
        x_country = d3.scaleBand()
                    .domain(country_data.map(function(d) {
                        return d.country;
                    }))
                    .range([0, WIDTH*4.5]);
        xAxisCall_2nd = d3.axisBottom(x_country)
                        .ticks(5);
        bar_chart_g2_x.transition()
                    .duration(500)
                    .call(xAxisCall_2nd)
                    .selectAll("text")
                    .attr("text-anchor","end")
                    .attr("transform","rotate(-30)");
    
        y_country.domain(d3.extent(data, d=>d[selectedFeature]))
                .range([HEIGHT, 0])

        yAxisCall_2nd = d3.axisLeft(y_country)
                                .ticks(5);
        bar_chart_g2_y.transition()
                    .duration(500)
                    .call(yAxisCall_2nd);


        bar_chart_g2_bars.selectAll("rect")
                        .data(country_data)
                        .transition()
                        .duration(500)
                        .attr("x", (d)=>x_country(d.country))
                        .attr("y", (d)=>y_country(d.avg))
                        .attr("width", x_country.bandwidth())
                        .attr("height", (d)=>HEIGHT-y_country(d.avg))
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');

        xSubgroup_feature.domain([continent_A,continent_B])
                        .range([0, x_feature.bandwidth()]);
        var feature_avg = [];
        features.forEach(feature=>{
            // console.log(feature);
            var contiA_data = data.filter(a => a.continent==continent_A);
            var contiB_data = data.filter(a => a.continent==continent_B);
            var sum=0,cnt=0,max=0;
            if(!notSelected){
                contiA_data.forEach(d=>{
                    sum+=d[feature];
                    cnt+=1;
                    if(d[feature]>max) max=d[feature];
                })
            }
            var element = {};
            element["continent"]=continent_A;
            element["feature"]=feature;
            element["avg"]=max==0? 0: (sum/cnt)/max;
            feature_avg.push(element);

            sum=0;
            cnt=0;
            max=0;
            if(!notSelected){
                contiB_data.forEach(d=>{
                    sum+=d[feature];
                    cnt+=1;
                    if(d[feature]>max) max=d[feature];
                })
            }
            element = {};
            element["continent"]=continent_B;
            element["avg"]=max==0? 0: (sum/cnt)/max;
            element["feature"]=feature;
            feature_avg.push(element);
        })
        
        bar_chart_g3_bars.selectAll("rect")
                        .data(feature_avg)
                        .transition()
                        .duration(500)
                        .attr("x", (d) => xSubgroup_feature(d.continent)+x_feature(d.feature)+(d.continent==continent_A? xSubgroup_feature.bandwidth()*1/3 : 0))
                        .attr("y", (d) => y_feature(d.avg))
                        .attr("width", xSubgroup_feature.bandwidth()*2/3)
                        .attr("height", (d) => HEIGHT-y_feature(d.avg))
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');

        
        var brush = d3.brushX()
                    .extent([[0, 0], [WIDTH, HEIGHT]])
                    .on("start", Brushed)
                    .on("brush", Brushed)
                    .on("end", EndBrushed);

        bg.call(brush);
        var min_year=2015,max_year=2020;
        function Brushed(){
            var extent = d3.event.selection;
            
            if(extent[0]!=extent[1]){
                min_year = x.domain()[Math.floor((extent[0] / x.step()))];
                max_year = x.domain()[Math.floor((extent[1] / x.step()))];
                if(max_year==undefined) max_year=2020;
                if(min_year==undefined) min_year=2015;
                // console.log(min_year,max_year);
            }
            else{
                // console.log(extent);
                min_year=2015;
                max_year=2020;
            }
        }

        function EndBrushed(){
            country_data = [];
            countries.forEach(country=>{
                var oneCountryData = data.filter(a=>a.Country==country&&a.Year<=max_year&&a.Year>=min_year);
                var sum = 0;
                var country_avg = {};
                var continent;
                // console.log(oneCountryData);
                oneCountryData.forEach(d=>{
                    sum+=d[selectedFeature];
                    continent=d.continent;
                })
                country_avg["country"]=country;
                country_avg["avg"]=sum/(max_year-min_year+1);
                country_avg["continent"]=continent;
                country_data.push(country_avg);
            })
            if(clicked){
                country_data=country_data.sort(function(a, b) {
                    return d3.descending(a.avg, b.avg);
                })
            }
            else{
                country_data=country_data.sort(function(a, b) {
                    return d3.ascending(a.country, b.country);
                })
            }
            // console.log(country_data);
            x_country = d3.scaleBand()
                            .domain(country_data.map(function(d) {
                                return d.country;
                            }))
                            .range([0, WIDTH*4.5]);
            xAxisCall_2nd = d3.axisBottom(x_country)
                                .ticks(5);
            bar_chart_g2_x.call(xAxisCall_2nd)
                        .selectAll("text")
                        .attr("text-anchor","end")
                        .attr("transform","rotate(-30)");
            bar_chart_g2_bars.selectAll("rect")
                        .data(country_data)
                        .transition()
                        .duration(500)
                        .attr("x", (d)=>x_country(d.country))
                        .attr("y", (d)=>y_country(d.avg))
                        .attr("width", x_country.bandwidth)
                        .attr("height", function(d){ return HEIGHT-y_country(d.avg)})
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');
            feature_avg = [];
            features.forEach(feature=>{
                // console.log(feature);
                var contiA_data = data.filter(a => a.continent==continent_A&&a.Year<=max_year&&a.Year>=min_year);
                var contiB_data = data.filter(a => a.continent==continent_B&&a.Year<=max_year&&a.Year>=min_year);
                var sum=0,cnt=0,max=0;
                contiA_data.forEach(d=>{
                    sum+=d[feature];
                    cnt+=1;
                    if(d[feature]>max) max=d[feature];
                })
                var element = {};
                element["continent"]=continent_A;
                element["feature"]=feature;
                element["avg"]=max==0? 0:(sum/cnt)/max;
                feature_avg.push(element);
    
                sum=0;
                cnt=0;
                max=0;
                contiB_data.forEach(d=>{
                    sum+=d[feature];
                    cnt+=1;
                    if(d[feature]>max) max=d[feature];
                })
                element = {};
                element["continent"]=continent_B;
                element["avg"]=max==0? 0:(sum/cnt)/max;
                element["feature"]=feature;
                feature_avg.push(element);
            })
            // console.log(feature_avg);
            bar_chart_g3_bars.selectAll("rect")
                        .data(feature_avg)
                        .transition()
                        .duration(500)
                        .attr("x", (d) => xSubgroup_feature(d.continent)+x_feature(d.feature)+(d.continent==continent_A? xSubgroup_feature.bandwidth()*1/3 : 0))
                        .attr("y", (d) => y_feature(d.avg))
                        .attr("width", xSubgroup_feature.bandwidth()*2/3)
                        .attr("height", (d) => HEIGHT-y_feature(d.avg))
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');
        }

    })
}