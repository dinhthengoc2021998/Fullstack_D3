async function drawBars() {
// data
const dataset= await d3.json('./nyc_weather_data.json');
// Dimension
dimension={height:window.innerHeight*0.5,width: window.innerWidth*0.5,
margin:{top:50,bottom:50,left:20,right:20}};
dimension.boundHeight=dimension.height-dimension.margin.top-dimension.margin.bottom;
dimension.boundWidth=dimension.width-dimension.margin.left-dimension.margin.right;
// Canvas
const wrapper=d3.select('#wrapper').append('svg').attr('height',dimension.height).attr('width',dimension.width);
const bound=wrapper.append('g').attr('class','bound').style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);
// Init element
bound.append('g').attr('class','bins')
bound.append('g').attr('class','x_axis')
bound.append('line').attr('class','mean_line')
bound.append('text').attr('class','mean_line_label')
// Draw Histogram
barPadding=5;
const drawHistogram= (metric)=>{
// Scale
const xAccessor=d=>d[metric]
const xScale=d3.scaleLinear().domain(d3.extent(dataset,xAccessor)).range([0,dimension.boundWidth]).nice();
// Bins
const binsGenerator=d3.histogram().domain(xScale.domain()).value(xAccessor).thresholds(12);
const bins=binsGenerator(dataset)
const yAccessor=d=>d.length
const yScale=d3.scaleLinear().domain(d3.extent(bins,yAccessor)).range([dimension.boundHeight,0]).nice();
// Update data
let binsGroup=d3.select('.bins').selectAll('.bin').data(bins);
const exitTransition=d3.transition().duration(1000);
const updateTransition=exitTransition.transition().duration(1000);

const binsGroupExit=binsGroup.exit();
binsGroupExit.selectAll('rect').style('fill','green').transition(exitTransition).attr('y',dimension.boundHeight).attr('height',0);
binsGroupExit.selectAll('text').transition(exitTransition).attr('y',dimension.boundHeight);
binsGroupExit.transition(exitTransition).remove();

const binsGroupUpdate=binsGroup.enter().append('g').attr('class','bin');
binsGroupUpdate.append('rect').style('fill','red').attr('x',d=>xScale(d.x0)).attr('y',dimension.boundHeight).attr('height',0).attr('width',d=>(xScale(d.x1)-xScale(d.x0)-barPadding/2))
binsGroupUpdate.append('text').text(yAccessor).attr('x',d=>(xScale(d.x0)+xScale(d.x1))/2).attr('y',dimension.boundHeight);

binsGroup=binsGroupUpdate.merge(binsGroup);

// Draw Histogram
const barRect=binsGroup.select('rect').transition(updateTransition).attr('x',d=>xScale(d.x0)).attr('y',d=>yScale(yAccessor(d))).attr('height',d=> dimension.boundHeight-yScale(yAccessor(d))).attr('width',d=>(xScale(d.x1)-xScale(d.x0)-barPadding/2)).style('fill','cornflowerblue');
// BarValue
const barValue=binsGroup.select('text').transition(updateTransition).text(yAccessor).attr('x',d=>(xScale(d.x0)+xScale(d.x1))/2).attr('y',d=>yScale(yAccessor(d))-10);
// Axis
const xAxisGenerator=d3.axisBottom().scale(xScale);
const xAxis=d3.select('.x_axis').call(xAxisGenerator).style('transform',`translateY(${dimension.boundHeight}px)`)
const xAxisLabel=xAxis.select('text').text(`${metric}`).attr('x',dimension.boundWidth/2).style('transform',`translateY(${dimension.margin.bottom-20}px)`).style('text-transform','capitalize')
// Mean Line
const mean=d3.mean(dataset,xAccessor)
const meanLine=d3.select('.mean_line').attr('x1',xScale(mean)).attr('y1',dimension.boundHeight).attr('x2',xScale(mean)).attr('y2',0).attr('stroke-width','4px')
const meanLineLabel=d3.select('.mean_line_label').text(`mean of ${metric}`).attr('x',xScale(mean)*1.4).attr('y',0).style('text-transform','capitalize')


}
const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
];
let selectedIndex=0
const button=d3.select('body').append('button').text('change metric').style('text-transform','capitalize')
button.node().addEventListener('click',onclick)
drawHistogram(metrics[selectedIndex])
function onclick(){
    selectedIndex=(selectedIndex+1)%(metrics.length)
    drawHistogram(metrics[selectedIndex])
}
}
drawBars();