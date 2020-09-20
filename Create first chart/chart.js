async function drawLineChart() {
    const dataset = await d3.json("./nyc_weather_data.json")
    const yAccessor = d => d.temperatureMax
    const dateParser = d3.timeParse("%Y-%m-%d") 
    const xAccessor = d => dateParser(d.date)
        
    let dimensions = {
        width: window.innerWidth * 0.9, 
        height: 400,
        margin: {
            top: 15,
            right: 15,
            bottom: 40,
            left: 60,
        }, }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    const wrapper = d3.select("#wrapper") 
        .append("svg")
            .attr("width",dimensions.width)
            .attr("height",dimensions.height);
    const bounds=wrapper.append('g')
            .style("transform",`translate(
                ${dimensions.margin.left}px,
                ${dimensions.margin.top}px)`)
    // yScale
    const yScale=d3.scaleLinear()
            .domain(d3.extent(dataset,yAccessor))
            .range([dimensions.boundedHeight,0])
    const [yDomainMin,yDomainMax]=[yScale(32),yScale(13)]
    // Append rect
    const rect=bounds.append('rect')
            .attr('x',0)
            .attr('width',dimensions.boundedWidth)
            .attr('y',yDomainMin)
            .attr('height',yDomainMax-yDomainMin)
            .attr('stroke',"black")
            .attr('fill', '#e0f3f3');
    
    // xScale
    const xScale=d3.scaleTime()
                .domain(d3.extent(dataset,xAccessor))
                .range([0, dimensions.boundedWidth])
    // line Generators
    const lineGenerator=d3.line()
                .x(d => xScale(xAccessor(d)))
                .y(d => yScale(yAccessor(d)))
    const line=bounds.append('path')
                .attr('d',lineGenerator(dataset))
                .attr("fill", "none") 
                .attr("stroke", "#af9358") 
                .attr("stroke-width", 2)
    // Add y-axis
    const yAxis=bounds.append('g').call(d3.axisLeft(yScale))
    const xAxis=bounds.append('g').call(d3.axisBottom(xScale))
                                    .style("transform",`translateY(${dimensions.boundedHeight}px)`)
}
drawLineChart()