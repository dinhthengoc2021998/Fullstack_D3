async function drawScatterPlot() {
// Access data
const dataset= await d3.json("./nyc_weather_data.json");
const yAccessor= d => d.dewPoint
const xAccessor= d => d.humidity
const colorAccessor = d => d.cloudCover
//  Create Chart dimensions

dimensions = {
    width : window.innerWidth*0.9,height:400,
    margins: {top:50,bottom:50,left:50,right:30}
}
const wrapper = d3.select("#wrapper").append("svg")
        .attr("height",dimensions.height)
        .attr("width",dimensions.width);

dimensions.boundsWidth=dimensions.width-dimensions.margins.left-dimensions.margins.right;
dimensions.boundsHeight=dimensions.height-dimensions.margins.top -dimensions.margins.bottom;

// Draw canvas
const bounds = wrapper.append('g')
    .style("transform", `translate(
            ${dimensions.margins.left}px,
            ${dimensions.margins.top}px)`)

// Create Scale
const yScale=d3.scaleLinear()
        .domain(d3.extent(dataset,yAccessor))
        .range([dimensions.boundsHeight,0]).nice()
    
const xScale=d3.scaleLinear()
        .domain(d3.extent(dataset,xAccessor))
        .range([0,dimensions.boundsWidth]).nice()

const colorScale=d3.scaleLinear()
        .domain(d3.extent(dataset,colorAccessor))
        .range(["skyblue","darkslategrey"])

// Draw data
function drawDot(dataset,radius,color) {
    const dot = bounds.selectAll("circle").data(dataset)
    dot.enter().append("circle")
        .attr("r",radius).attr("cx",d => xScale(xAccessor(d))).attr("cy",d => yScale(yAccessor(d)))
        .attr("fill", color)
    }
drawDot(dataset.slice(0,20),3,"black")
setTimeout(() => {
    drawDot(dataset.slice(20,400),3, d => colorScale(colorAccessor(d)))
  }, 1000)

// Add Axis
const yAxis= bounds.append('g').call(d3.axisLeft(yScale))
const xAxis= bounds.append('g').call(d3.axisBottom(xScale)).style("transform",`translateY(${dimensions.boundsHeight}px)`)
const yAxisLabel= yAxis.append("text")
    .attr("x",-dimensions.boundsHeight/2)
    .attr("y",-dimensions.margins.left+10)
    .attr("fill",'black')
    .style("font-size","1.4em")
    .text("Dew Point")
    .style("transform", "rotate(-90deg)") 
    .style("text-anchor", "middle")
const xAxisLabel = xAxis.append("text")
    .attr("x",dimensions.boundsWidth/2)
    .attr("y",dimensions.margins.bottom)
    .attr("fill","black")
    .attr("font-size","1.4em")
    .html("Relative humidity")
    .style("transform", "rotate(0deg)") 
    .style("text-anchor","middle")
}

drawScatterPlot()
