async function drawBars() {
// Data
const dataset= await d3.json('./nyc_weather_data.json');

// Dimension
const  dimension= {height: window.innerHeight*0.8,width: window.innerWidth*0.5,
    margin: {top:50,bottom:50,left:20,right:20}};
dimension.boundHeight= dimension.height - dimension.margin.top-dimension.margin.bottom;
dimension.boundWidth=dimension.width - dimension.margin.left - dimension.margin.right;
// Canvas
const wrapper=d3.select('#wrapper').append('svg')
.attr('height',dimension.height).attr('width',dimension.width);
const bounds= wrapper.append('g')
.style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

// Init static element
bounds.append('g').attr('class','bins');
bounds.append('line').attr('class','mean');
bounds.append('g').attr('class','x-axis')
    .append('text').attr('class','x-axis-label');

metrics=['humidity','windSpeed']
metric='humidity'
// Draw data
const drawHistogram = (metric) => {
    const xAccessor= d=> d[metric]
    const xScale=d3.scaleLinear().domain(d3.extent(dataset,xAccessor))
        .range([0,dimension.boundWidth]).nice()
    const binGenerator= d3.histogram().domain(xScale.domain())
        .value(xAccessor).thresholds(12);
    const bins=binGenerator(dataset);
    const yAccessor = (d) => d.length
    const yScale = d3.scaleLinear().domain([0,d3.max(bins,yAccessor)])
        .range([dimension.boundHeight,0]).nice();
    const binsGroup = d3.select('.bins').selectAll('g')
        .data(bins).enter().append('g')
    let barPadding=10;
    const barRect=binsGroup.append('rect')
        .attr('x',d=>xScale(d.x0)).attr('y',d=>yScale(yAccessor(d)))
        .attr('height',d=>dimension.boundHeight-yScale(yAccessor(d))).attr('width',d=>xScale(d.x1)-xScale(d.x0)-barPadding/2);
    const xAxisGenerator=d3.axisBottom().scale(xScale);
    const xAxis=d3.select('.x-axis').call(xAxisGenerator).style("transform",`translateY(${dimension.boundHeight}px)`);
    const xAxisLabel=xAxis.select('.x-axis-label').text(metric)
        .attr('x',dimension.boundWidth/2).attr('y',dimension.margin.bottom*0.8)
    const barText=binsGroup.append('text').text(d=>yAccessor(d))
        .attr('x',d=>(xScale(d.x1)+xScale(d.x0))/2).attr('y',d=>yScale(yAccessor(d))-10)
}
let selectedIndex=0
drawHistogram(metrics[selectedIndex])
const button=d3.select('body').append('button').text('Change Next Metric')
button.node().addEventListener('click',onClick);
function onClick(){
    selectedIndex=(selectedIndex+1) % metrics.length;
    drawHistogram(metrics[selectedIndex])   
};

};


drawBars()