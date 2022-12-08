d3.csv("WorldHappiness_Corruption_2015_2020.csv",d3.autoType).then(data =>{
    // console.log(Asia_data);

    const FWith = 600, FHeight = 500;
    const FLeftTopX = 100, FLeftTopY = 100;
    const MARGIN = { LEFT: 100, RIGHT: 20, TOP: 20, BOTTOM: 100 }
    const WIDTH = FWith - (MARGIN.LEFT + MARGIN.RIGHT)
    const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM)
    continent_A = "Europe"; // blue for A
    continent_B = "Africa"; // red for B
    data = data.filter(a => a.continent==continent_A || a.continent==continent_B );

    const svg = d3.select("#chart-area")
                    .append("svg")
                    .attr("width", 2000)
                    .attr("height", 2000);
    const bar_chart_g1 = svg.append("g")
                            .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`);;

    // X, Y ticks for the first bar chart
    years = ['2015','2016','2017','2018','2019','2020'];
    const x = d3.scaleBand()
                .domain(years)
                .range([0, WIDTH])

    const xAxisCall = d3.axisBottom(x)
                        .ticks(5);
    bar_chart_g1.append("g")
                .attr("transform", `translate(0, ${HEIGHT})`)
                .call(xAxisCall)

    const y = d3.scaleLinear()
                .domain(d3.extent(data, d=>d.happiness_score))
                .range([HEIGHT, 0])
                console.log(y.domain());           
    const yAxisCall = d3.axisLeft(y)
                        .ticks(5);
    
    // The first bar chart
    bar_chart_g1.append("g").call(yAxisCall);

    var xSubgroup = d3.scaleBand()
                    .domain([continent_A,continent_B])
                    .range([0, x.bandwidth()]);

    var color = d3.scaleOrdinal()
                .domain(xSubgroup.domain())
                .range(['#377eb8','#e41a1c']);

    bar_chart_g1.append("g")
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function(d) { return xSubgroup(d.continent)+x(d.Year)+ (d.continent==continent_A? xSubgroup.bandwidth()*1/3 : 0); })
                .attr("y", function(d) { return y(d.happiness_score); })
                .attr("width", xSubgroup.bandwidth()*2/3)
                .attr("height", function(d) { return HEIGHT - y(d.happiness_score); })
                .attr("fill", function(d) { return color(d.continent); });

    // X, Y ticks for the second bar chart
    years = ['2015','2016','2017','2018','2019','2020'];
    const x_2nd = d3.scaleBand()
                .domain(years)
                .range([0, WIDTH])

    const xAxisCall_2nd = d3.axisBottom(x)
                            .ticks(5);
    bar_chart_g1.append("g")
                .attr("transform", `translate(${WIDTH+MARGIN.LEFT}, ${HEIGHT})`)
                .call(xAxisCall)

    const y_2nd = d3.scaleLinear()
                .domain(d3.extent(data, d=>d.happiness_score))
                .range([HEIGHT, 0])
                console.log(y.domain());           
    const yAxisCall_2nd = d3.axisLeft(y)
                        .ticks(5);
})