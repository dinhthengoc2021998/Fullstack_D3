const metrics = [ "windSpeed", "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
];
async function drawBarChart(metric) {
//  Access Data
dataset= await d3.json('./nyc_weather_data.json');
const metricAccessor= d=>d[metric]

// dimension
dimension={
    height: window.innerWidth*0.2,width: window.innerWidth*0.4,
    margin:{top:50,bottom:50,left:20,right:20}
}
dimension.boundedHeight=dimension.height-dimension.margin.top-dimension.margin.bottom;
dimension.boundedWidth=dimension.width - dimension.margin.left-dimension.margin.right;
// create Canvas
const wrapper = d3.select('#wrapper').append('svg')
.attr('width',dimension.width).attr('height',dimension.height);

const bounded = wrapper.append('g')
.style('transform', `translate(${dimension.margin.left}px,${dimension.margin.top}px)`)
.attr("tabindex", "0").attr("role", "list") .attr("aria-label", "histogram bars");

// Accessibility
wrapper.attr("role", "figure") .attr("tabindex", "0");
wrapper.append("title").text(`Histogram looking at the distribution of ${metric} in 2016`);
wrapper.selectAll("text") .attr("role", "presentation") .attr("aria-hidden", "true");

// Create Scale
const xScale=d3.scaleLinear().domain(d3.extent(dataset,metricAccessor)).range([0,dimension.boundedWidth]).nice()

// Create Bins
const binGenerator= d3.histogram().domain(xScale.domain()).value(metricAccessor).thresholds(20);
const bins=binGenerator(dataset);
const yAccessor=d=>d.length;
const yScale=d3.scaleLinear().domain([0,d3.max(bins,yAccessor)]).range([dimension.boundedHeight,0]);
// Draw data
const barGroups=bounded.selectAll('g').data(bins).enter().append('g')
.attr("tabindex", "0")
.attr("role", "listitem") .attr("aria-label", d => `There were ${
      yAccessor(d)
} days between ${ d.x0.toString().slice(0, 4)
} and ${ d.x1.toString().slice(0, 4)
} humidity levels.`);
const barPadding=2;
const barRect=barGroups.append('rect')
.attr('x',d=>xScale(d.x0)).attr('y',d=>yScale(yAccessor(d)))
.attr('width',d=> xScale(d.x1)-xScale(d.x0)-barPadding/2).attr('height',d=> dimension.boundedHeight-yScale(yAccessor(d)))
.attr('fill','cornflowerblue');

// Data Label
const barValue=barGroups.append('g').append('text').text(yAccessor)
.attr('x',d=>(xScale(d.x0)+xScale(d.x1))/2).attr('y',d=>yScale(yAccessor(d))-10)
.attr('font-size','10px').attr('text-anchor','middle');

// Mean Line
const mean=d3.mean(dataset,metricAccessor);
const meanLine= bounded.append('line')
.attr('x1',xScale(mean)).attr('y1',dimension.boundedHeight)
.attr('x2',xScale(mean)).attr('y2',-20)
.attr('stroke-width','5px').attr('stroke','maroon');

const meanLineLabel=bounded.append('text')
.text(`mean Line of ${metric}`)
.attr('x',xScale(mean)+10).attr('y',-20).attr('font-size','20px')


// Add xAxis
const xAxisGenerator= d3.axisBottom().scale(xScale)
const xAxis=bounded.append('g').call(xAxisGenerator).style("transform",`translateY(${dimension.boundedHeight}px)`);
const xAxisLabel=bounded.append('text').text(`${metric}`)
.attr("x",xScale(mean)).attr('y',dimension.height-dimension.margin.bottom-10)
.attr('font-size','20px').attr('text-anchor','middle')
.style('text-transform','capitalize');


}
metrics.forEach(d=>drawBarChart(d));