

url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
const dataset = fetch(url).then(response => response.json())

width = 900
height = 600
padding = 60


dataset.then(dataset => {

    let dataPoints = dataset.data
    dataPoints = dataPoints.map(dataPoint => {
        return [d3.timeParse('%Y-%m-%d')(dataPoint[0]), dataPoint[1]]
    })

    let xScale = d3.scaleTime()
        .domain(d3.extent(dataPoints, d => d[0]))
        .range([padding, width - padding])

    let yScale = d3.scaleLinear()
        .domain(d3.extent(dataPoints, d => d[1]))
        .range([height - padding, padding])

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%Y'))
        .ticks(d3.timeYear.every(5))

    let yAxis = d3.axisLeft(yScale)

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append('g')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .call(xAxis)

    svg.append('g')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis)

    svg.selectAll("rect")
        .data(dataPoints)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1]))
        .attr("width", 1)
        .attr("height", d => height - padding - yScale(d[1]))

})