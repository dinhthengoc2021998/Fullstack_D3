async function drawBarChart() {
// Access Data
dataset = await d3.json('./nyc_weather_data.json');
const metricAccessor= d=>d.humidity;
const yAccessor=d=>d.length
// Dimension
dimensions= {
    height:600,width:window.innerWidth*0.9,
    margins:{top:50,bottom:50,left:15,right:15}
};
dimensions.boundedWidth=dimensions.width - dimensions.margins.left - dimensions.margins.right;
dimensions.boundedHeight=dimensions.height-dimensions.margins.top-dimensions.margins.bottom;
// Create canvas
const wrapper = d3.select('#wrapper');
const bounds = wrapper.append('svg')
    .attr('width',dimensions.width).attr('height',dimensions.height);
// Create Scale
const xScale= d3.scaleLinear()
    .domain(d3.extent(dataset,metricAccessor)).range([0,dimensions.boundedWidth]).nice();
// create bin
const binGenerator=d3.histogram()
    .domain(xScale.domain()).value(metricAccessor).thresholds(12);
const bins=binGenerator(dataset);

const yScale= d3.scaleLinear()
    .domain([0,d3.max(bins,yAccessor)]).range([dimensions.boundedHeight,0]).nice();
// Draw data
const binGroups= bounds.selectAll('g')
    .data(bins).enter().append('g');
const barPadding=1;
const barRect=binGroups.append('rect')
    .attr('x',d=>xScale(d.x0)-barPadding).attr('y',d=>yScale(yAccessor(d)))
    .attr('width',d=>xScale(d.x1)-xScale(d.x0)-barPadding).attr('height',d=>dimensions.boundedHeight-yScale(yAccessor(d)))
    .attr('fill','cornflowerblue');
// Add Bar value
const barValue=binGroups.append('text')
    .attr('x',d=>(xScale(d.x1)+xScale(d.x0))/2).attr('y',d=>yScale(yAccessor(d))-10)
    .attr('fill','black').attr('text-anchor','middle')
    .text(d=>yAccessor(d)).attr('font-size','1.4em')
// Add xAxis
const xAxisGenerator=d3.axisBottom().scale(xScale)
const xAxis=bounds.append('g').call(xAxisGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight}px)`);
// Add xAxisLabel
const xAxisLabel=bounds.append('text')
    .text('Humidity')
    .attr('font-size', '2em').attr('text-anchor','middle')
    .attr('x',dimensions.boundedWidth/2).attr('y',dimensions.height-dimensions.margins.bottom)
// Add meanLine
const mean=d3.mean(dataset,metricAccessor);
const meanLine=bounds.append('g').append('line')
    .attr('x1',xScale(mean)+barPadding).attr('y1',-15)
    .attr('x2',xScale(mean)+barPadding).attr('y2',dimensions.boundedHeight)
    .attr('stroke','maroon').attr('fill', 'red').attr('stroke-width','5px');
// Add meanLine Label
const meanLineLabel= bounds.append('text')
    .attr('x',xScale(mean)+dimensions.margins.left).attr('y',15)
    .attr('font-size','1.4em').style('stroke','maroon').attr('fill','red').style('text-anchor', 'outside')
    .text('mean line')
}
drawBarChart()