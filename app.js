//Width and height and svg parameters
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 40
};

//Width and height chart group parameters 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Graph canvas creation
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Svg group appending
var chartGroup = svg.append("g")
  .classed('chart', true) 
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function calls and passes the csv data
var dataFile="data.csv"
d3.csv(dataFile).then(successHandle, errorHandle);

// Error handling function to append data and SVG objects, retrieval error display in the console

function errorHandle(error) {
    throw err;
  }

// Function takes in argument statesData
function successHandle(stateHealthData) { //d
// Argument data retrieval function
stateHealthData.map(function (data) { //d
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });
// X-axis Linear Scale function creation
//function xScale(stateHealthData){
var xLinearScale = d3.scaleLinear()
.domain([30,d3.max(stateHealthData, d => d.age)])
//.domain([30,d3.min(stateHealthData, d => d.age)])
.range([0, width])
//return xLinearScale;
//}
// Y-axis Linear Scale function creation
var yLinearScale = d3.scaleLinear()
.domain([0,d3.max(stateHealthData, d => d.income)])
.range([height, 0])
//return yLinearScale;

// Create bottom-left-axis function
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append bottom-left-axes to the chartGroup
chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);
chartGroup.append("g")
.call(leftAxis);

 // Circles scatters creation
     chartGroup.selectAll("circle")
    .data(stateHealthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "15")
    .attr("opacity", ".75")
    .classed("stateCircle", true);
//Axis Labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("x", 0 - (svgHeight / 2))
.attr("y", 0 - margin.left)
.attr("dy", "1em")
.attr("class", "aText")
.text("Income")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 35})`)
.attr("class", "aText")
.text("Age");


// Append state text to circles
var circlesGroup =chartGroup.append("g").selectAll("text")
 .data(stateHealthData)
 .enter()
 .append("text")
 .text(function (d) {
     return d.abbr;
 })
 .attr("dx", d => xLinearScale(d.age))
 .attr("dy", d => yLinearScale(d.income))
 .attr("class","stateText")
 .style("text-anchor", "middle")
  .text(d=>(d.abbr));

//toolTip Initialization
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Age: ${d.age}<br>Income: ${d.income} `);
    });
//Chart toolTip call
  chartGroup.call(toolTip);

//Event listener creation
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
//On-mouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    })
}
