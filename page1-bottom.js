const FWith = 400, FHeight = 300;
const FLeftTopX = 100, FLeftTopY = 30;
const MARGIN = { LEFT: 50, RIGHT: 20, TOP: 0, BOTTOM: 100 }
const WIDTH = FWith - (MARGIN.LEFT + MARGIN.RIGHT)
const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM)

const BarChart_svg = d3.select("#bar_chart_global_view")
                .append("svg")
                .attr("width", 2000)
                .attr("height", 2000);
const bar_chart_g = BarChart_svg.append("g")
                .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`);
var selectedFeature="happiness_score";
function changeFeature(){
    selectedFeature = document.getElementById("features").value;
    console.log(selectedFeature);
    Update_Barchart();
}
function Update_Barchart(){
    d3.selectAll("#bar_chart_global_view g > *").remove();
    d3.csv("WorldHappiness_Corruption_2015_2020.csv",d3.autoType).then(data =>{
        console.log(data);
        var color;
        data = data.filter(a => a.continent==continent_A || a.continent==continent_B );
        // X, Y ticks for the first bar chart
        var years = new Set();
        data.forEach(element => {
            years.add(element.Year);
        });
        const x = d3.scaleBand()
                    .domain(Array.from(years))
                    .range([0, WIDTH]);
    
        const xAxisCall = d3.axisBottom(x)
                            .ticks(5);
        bar_chart_g.append("g")
                    .attr("transform", `translate(0, ${HEIGHT})`)
                    .call(xAxisCall)
    
        const y = d3.scaleLinear()
                    .domain(d3.extent(data, d=>d[selectedFeature]))
                    .range([HEIGHT, 0])
        // console.log(y.domain());                    
        const yAxisCall = d3.axisLeft(y)
                            .ticks(5);
        
        // The first bar chart
        bar_chart_g.append("g").call(yAxisCall);
    
        var xSubgroup = d3.scaleBand()
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
        const bar_chart_g1 = bar_chart_g.append("g");
        bar_chart_g1.selectAll("rect")
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
        var countries = new Set();
        data.forEach(element => {
            countries.add(element.Country);
        });
        // console.log(Array.from(countries));
        const x_country = d3.scaleBand()
                    .domain(Array.from(countries))
                    .range([0, WIDTH*4.5]);

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
        const xAxisCall_2nd = d3.axisBottom(x_country)
                                .ticks(5);
        const bar_chart_g2 = bar_chart_g.append("g");
        bar_chart_g2.append("g")
                    .attr("transform", `translate(0, ${HEIGHT*3})`)
                    .call(xAxisCall_2nd)
                    .selectAll("text")
                    .attr("text-anchor","end")
                    .attr("transform","rotate(-30)");
    
        const y_country = d3.scaleLinear()
                    .domain(d3.extent(data, d=>d[selectedFeature]))
                    .range([HEIGHT, 0])
         
        const yAxisCall_2nd = d3.axisLeft(y_country)
                                .ticks(5);
        bar_chart_g2.append("g")
                    .attr("transform", `translate(0, ${HEIGHT*2})`)
                    .call(yAxisCall_2nd);

        const bar_chart_g2_bars=bar_chart_g2.append("g").attr("transform", `translate(0, ${HEIGHT*2})`);
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

        const features = ["gdp_per_capita","family","health","freedom","generosity",
        "government_trust","dystopia_residual","social_support","cpi_score"];

        // console.log(Array.from(countries));
        const x_feature = d3.scaleBand()
                            .domain(features)
                            .range([0, WIDTH*3]);
    
        const xAxisCall_3rd = d3.axisBottom(x_feature)
                                .ticks(5);
        const bar_chart_g3 = bar_chart_g.append("g")
                                        .attr("transform", `translate(${WIDTH+MARGIN.LEFT}, 0)`);
        bar_chart_g3.append("g")
                    .attr("transform", `translate(0, ${HEIGHT})`)
                    .call(xAxisCall_3rd)
                    .selectAll("text")
                    .attr("text-anchor","end")
                    .attr("transform","rotate(-30)");
    
        const y_feature = d3.scaleLinear()
                    .domain([0,1])
                    .range([HEIGHT, 0])
         
        const yAxisCall_3rd = d3.axisLeft(y_feature)
                                .ticks(5);
        bar_chart_g3.append("g")
                    .call(yAxisCall_3rd);

        var xSubgroup_feature = d3.scaleBand()
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
        const bar_chart_g3_bars=bar_chart_g3.append("g");
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

        const bg = bar_chart_g1.append("g");
        var bursh = d3.brushX()
                    .extent([[0, 0], [WIDTH, HEIGHT]])
                    .on("start", Brushed)
                    .on("brush", Brushed)
                    .on("end", EndBrushed);

        bg.call(bursh);
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
            bar_chart_g2_bars.selectAll("rect")
                        .data(country_data)
                        .transition()
                        .duration(1000)
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
                        .duration(1000)
                        .attr("x", (d) => xSubgroup_feature(d.continent)+x_feature(d.feature)+(d.continent==continent_A? xSubgroup_feature.bandwidth()*1/3 : 0))
                        .attr("y", (d) => y_feature(d.avg))
                        .attr("width", xSubgroup_feature.bandwidth()*2/3)
                        .attr("height", (d) => HEIGHT-y_feature(d.avg))
                        .style("fill", function(d) { return color(d.continent); })
                        .style('stroke','black');
        }

    })
}