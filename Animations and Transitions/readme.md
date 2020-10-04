### Access data
    d3.json()
### Dimension => Canvas
    dimension={height,width,margin}
    svg= d3.select('div').append('svg').attr(width,height)
    bound= svg.append('g').attr("transform",`translate()`)
### Init static element
    .append('group_element').attr('class')
### Draw data
    scale = d3.scaleLinear().domain().range().nice()
    binGenerators = d3.histogram().domain().value().thresholds()
    exitTransition= d3.transition()
    updateTransition = exitTransition.transition()
    binsGroup= .selectAll('bin').data(binGenerators)
    oldBinsGroup=binsGroup.exit().selectAll('rect').transition(exitTransition).remove()
    newBinsGroup=binsGroup.enter().append('rect')
    binsGroup=newBinsGroup.merge().select('rect').transition(updateTransition)

### Add eventlistener 'onclick'

### Accessibility: 
    .attr('role','figure')
    .attr("aria-label", "histogram bars")
    .attr('tabindex',"0"
    .selectAll('text).attr('role','presentation')
    .append('title').text()
