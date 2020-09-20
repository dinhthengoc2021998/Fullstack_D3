1. Access data
Look at the data structure and declare how to access the values we’ll need
2. Create chart dimensions
Declare the physical (i.e. pixels) chart parameters
3. Draw canvas
Render the chart area and bounds element
4. Create scales
Create scales for every data-to-physical attribute in our chart
5. Draw data
Render your data elements: DATA JOINS (.data(__data__: {__enter__,__group__,__exit__}) => .merge(dot))
6. Draw peripherals
Render your axes, labels, and legends
7. Set up interactions
Initialize event listeners and create interaction behavior - we’ll get to this step in Chapter 5
