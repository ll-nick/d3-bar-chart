url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
const dataset = fetch(url).then(response => response.json())

width = 940
height = 600
padding = 60

const timeParser = d3.timeParse('%Y-%m-%d')
const toolTipDateFormat = d3.timeFormat('%Y Q%q');

dataset.then(dataset => {

    let dataPoints = dataset.data

    // Scales
    let xScale = d3.scaleTime()
        .domain(d3.extent(dataPoints, d => timeParser(d[0])))
        .range([padding, width - padding])

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(dataPoints, d => d[1])])
        .range([height - padding, padding])

    // HTML Elements
    const tooltip = d3.select('#chart-container')
        .append('div')
        .attr('id', 'tooltip')

    const svg = d3.select('#chart-container')
        .append('svg')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
    const svgWidth = svg.node().clientWidth;

    // Title
    svg.append('text')
        .attr('x', (width / 2))
        .attr('y', padding / 2)
        .attr('text-anchor', 'middle')
        .attr('id', 'title')
        .text('United States GDP');

    // Axes
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%Y'))
        .ticks(d3.timeYear.every(5))
        .tickSizeOuter(0)
    svg.append('g')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .attr('id', 'x-axis')
        .call(xAxis)

    let yAxis = d3.axisLeft(yScale)
        .tickSizeOuter(0)
    svg.append('g')
        .attr('transform', 'translate(' + padding + ', 0)')
        .attr('id', 'y-axis')
        .call(yAxis)
    svg.append('text')
        .attr('id', 'y-axis-label')
        .attr('transform', 'translate(' + (padding + 20) + ',' + height / 2 + ') rotate(-90)')
        .text('Gross Domestic Product')

    // Plot data
    const barWidth = (width - padding * 2) / dataPoints.length + 1;
    svg.selectAll('rect')
        .data(dataPoints)
        .enter()
        .append('rect')
        .attr('x', d => xScale(timeParser(d[0])))
        .attr('y', d => yScale(d[1]))
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('width', barWidth)
        .attr('height', d => height - padding - yScale(d[1]))
        .attr('class', 'bar')
        // Show tooltip on mouseover
        .on('mouseover', (event, d) => {
            tooltip
                .html(toolTipDateFormat(timeParser(d[0])) + '<br>$' + d[1] + ' Billion')
                .attr('data-date', d[0])
                .style('opacity', 0.9)
                .style('left', (event.x < svgWidth / 2 ? event.x + 20 : event.x - 180) + 'px')
        })
        .on('mouseout', function (e) {
            tooltip.style('opacity', 0);
        })

    // Move axes to foreground
    d3.select('#x-axis').raise()
    d3.select('#y-axis').raise()

})