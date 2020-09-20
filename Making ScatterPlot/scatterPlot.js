async function drawScatterPlot() {
// Access data
const dataset= await d3.json("./nyc_weather_data.json");
const yAccessor= d => d.dewPoint
const xAccessor= d => d.humidity
console.log([yAccessor(dataset[0]),xAccessor(dataset[0])])
//  Create Chart dimensions

dimensions = {
    width : window.innerWidth*0.9,height:400,
    margins: {top:50,bottom:50,left:30,right:30}
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

// Draw data
function drawDot(dataset,radius,color) {
    const dot = bounds.selectAll("circle").data(dataset)
    dot.enter().append("circle")
        .attr("r",radius).attr("cx",d => xScale(xAccessor(d))).attr("cy",d => yScale(yAccessor(d)))
        .attr("fill", color)
    }
drawDot(dataset.slice(0,20),3,"black")
setTimeout(() => {
    drawDot(dataset.slice(201,400),3, "cornflowerblue")
  }, 1000)

// Add Axis
const yAxis= bounds.append('g').call(d3.axisLeft(yScale))
const xAxis= bounds.append('g').call(d3.axisBottom(xScale)).style("transform",`translateY(${dimensions.boundsHeight}px)`)

}

drawScatterPlot()
