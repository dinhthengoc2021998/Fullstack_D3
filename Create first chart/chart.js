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
    const wrapper = d3.select("#wrapper") 
        .append("svg")
        .attr("width", dimensions.width) 
        .attr("height", dimensions.height)
    const bounds = wrapper.append("g") 
        .style("transform", `translate(${
            dimensions.margin.left
            }px, ${ dimensions.margin.top
            }px)`
        )
    const yScale = d3.scaleLinear() 
}
drawLineChart()