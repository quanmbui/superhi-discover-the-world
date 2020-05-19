// Two places to run our data visualization
// 1. On page load
// 2. On any change of any select box
// All of them will run the same code

const svg = d3.select('svg')

svg
  .attr('viewBox', "0 0 960 720")

// Here are the things we want to setup:
// Axes, text elements
const axisXGroup = svg
	.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0, 620)")

const axisYGroup = svg
	.append("g")
	.attr("class", "y-axis")
	.attr("transform", "translate(100, 0)")

const axisXText = svg
	.append("text")
	.attr("class", "x-axis")
	.attr("transform", "translate(480, 670)")
	.text("x axis")

const axisYText = svg
	.append("text")
	.attr("class", "y-axis")
	.attr("transform", "translate(30, 360) rotate(-90)")
	.text("y axis")
	

// Create a function that runs for any update
const placeCities = function() {
  // Here is the place we update things
  let inputX = document.querySelector('select[name=valueX]')
  let inputY = document.querySelector('select[name=valueY]')

  let valueX = inputX.value
  let valueY = inputY.value
  
  let textX = inputX.options[inputX.selectedIndex].innerHTML
  let textY = inputY.options[inputY.selectedIndex].innerHTML

  axisXText.text(textX)
  axisYText.text(textY)

  // max value from the data
  let maxValueX = d3.max(data, (d, i) => {
    return d[valueX]
  })
  let maxValueY = d3.max(data, (d, i) => {
    return d[valueY]
  })
  let maxValueR = d3.max(data, (d, i) => {
    return d.population
  })

  const scaleX = d3
    .scaleLinear()
    .domain([0, maxValueX])
    .range([100, 860])

  const scaleY = d3
    .scaleLinear()
    .domain([0, maxValueY])
    .range([620, 100])

  const scaleR = d3.scaleSqrt()
  	.domain([0, maxValueR])
  	.range([0, 30])
  
  const axisX = d3.axisBottom(scaleX)
  	.tickSizeInner(-520)
  	.tickSizeOuter(0)
  	.tickPadding(10)
  	.ticks(10, "$,f")
  
  const axisY = d3.axisLeft(scaleY)
  	.tickSizeInner(-760)
  	.tickSizeOuter(0)
  	.tickPadding(10)
  	.ticks(10, "$,f")

  axisXGroup.call(axisX)
  axisYGroup.call(axisY)
  
  const cities = svg
    .selectAll('g.city')
    .data(data, (d, i) => { return d.city })
    .enter()
    .append('g')
    .attr('class', 'city')
    .attr('transform', (d, i) => {
      const x = scaleX(d[valueX])
      const y = scaleY(d[valueY])
      return `translate(${x},${y})`
    })

  cities
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
  	.attr("r", 0)
  	.transition()
  	.duration(500 )
    .attr("r", (d, i) => { return scaleR(d.population) }) // only happens on page load
  
  cities
  	.append("rect")
  	.attr("x", -60)
  	.attr("y", (d, i) => { return -1 * scaleR(d.population) -35 })
  	.attr("width", 120)
  	.attr("height", 30)
  
  cities
  	.append("text")
  	.attr("x", 0)
  	.attr("y", (d, i) => { return -1 * scaleR(d.population) -15 })
  	.text((d, i) => { return d.city })

 	// Groups that have already been added, move them around
  svg
    .selectAll('g.city')
  	.transition()
  	.duration(500)
    .attr('transform', (d, i) => {
    const x = scaleX(d[valueX])
    const y = scaleY(d[valueY])
    return `translate(${x},${y})`
  })
  
  svg
  	.selectAll("g.city")
  	.on("mouseover", function () {
    	d3.select(this).raise()
  })
  
}

// 1. On page load
placeCities()

// Select ALL of the select boxes
const selectTags = document.querySelectorAll('select')

selectTags.forEach(selectTag => {
  selectTag.addEventListener('change', function() {
    placeCities()
  })
})
