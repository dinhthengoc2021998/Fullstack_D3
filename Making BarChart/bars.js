const metrics = [ "windSpeed", "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
];
async function drawBarChart(metric){
// Data
dataset= await d3.json('./nyc_weather_data.json');

// Access Data
const metricAccessor= d => d[metric];
const yAccessor=d=>d.length
// Dimension
dimension= {
    height: 600,width:window.innerWidth*0.8,
    margin: {top:50,bottom:50,left:20,right:20}
};
dimension.boundedHeight=dimension.height-dimension.margin.top-dimension.margin.bottom;
dimension.boundeWidth=dimension.width-dimension.margin.left-dimension.margin.right;


// Create Scale
const xScale= d3.scaleLinear().domain(d3.extent(dataset,metricAccessor))
.range([0,dimension.boundeWidth]).nice()

// Create canvas
const wrapper=d3.select("#wrapper").append('svg')
.attr('height',dimension.height).attr('width',dimension.width);
const bounded=wrapper.append('g')
.style("transform",`translate(${dimension.margin.left}px,${dimension.margin.right}px)`)

// Create binGroups
const binGenerator= d3.histogram().
domain(xScale.domain()).value(metricAccessor).thresholds(12);
const binGroups=binGenerator(dataset)
const yScale=d3.scaleLinear().domain([0,d3.max(binGroups,yAccessor)])
.range([dimension.boundedHeight,0]).nice()
// barRect
const barGroups=bounded.selectAll('g')
.data(binGroups).enter().append('g')
const barPadding=1;
const barRect=barGroups.append('rect')
.attr('x',d=>xScale(d.x0)).attr('y',d=>yScale(yAccessor(d)))
.attr('height',d=>dimension.boundedHeight-yScale(yAccessor(d)))
.attr('width',d=>d3.max([0,(xScale(d.x1)-xScale(d.x0)-barPadding)]))
.attr('fill','cornflowerblue');

// MeanLine
const mean=d3.mean(dataset,metricAccessor);
const meanLine=bounded.append('line')
.attr('x1',xScale(mean)).attr('y1',dimension.boundedHeight)
.attr('x2',xScale(mean)).attr('y2',0)
.attr('stroke-width','4px').attr('fill','red').attr('stroke','maroon')

const meanLineLabel=bounded.append('text')
.attr('x',xScale(mean)+10).attr('y',0)
.attr('font-size','20px')
.text(`meanLine-${metric}`).style('text-transform','capitalize');

// Bar value
const barValue=barGroups.filter('g').append('text')
.text(yAccessor)
.attr('x',d=>(xScale(d.x1)+xScale(d.x0))/2).attr('y',d=>yScale(yAccessor(d)+2))
.attr('text-anchor','middle').attr('font-size','15px');

// xAxis
const xAxisGenerator=d3.axisBottom().scale(xScale)
const xAxis=bounded.append('g').call(xAxisGenerator).style("transform",`translateY(${dimension.boundedHeight}px)`)

}

metrics.forEach(drawBarChart);