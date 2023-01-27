import React, {useEffect} from 'react';
import * as d3 from "d3";

function LineChart(props) {

    // Dimensions of map
    const width = 400,
    height = 750;
    const margin = {top: 50, right: 25, bottom: 30, left: 25};
    
    
    // Dimensions of individual graphs
    const hWidth = 300 - margin.right - margin.left,
    hHeight = 200 - (margin.top+margin.bottom);

useEffect(() => {

  if(props.data.length === 0) return;

  let svg = d3.select("#lineGraph")
  .select("svg")

  if(svg.empty()) {
    genLineChart()
  }

  let scaleX = d3.scaleTime()
  .domain(d3.extent(props.data, d => d[0]))
  .range([margin.left,hWidth]);

  scaleX.ticks(d3.timeYear.every(5))

  let scaleY = d3.scaleLinear()
  .domain([0,d3.max(props.data, d => d[1])])
  .range([hHeight, margin.top])

  d3.select("#lineGraph")
    .select("#grLine")
    .datum(props.data)
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("d", d3.line()
    .x(d => scaleX(d[0]))
    .y(d => scaleY(d[1]))
    .curve(d3.curveBasis))
  
  d3.select("#lcTitle")
  .text((props.highlighted ?? "Crop Count") + " by Year");

}, [props.data])

// function ensureDataExists() {
//   return new Promise(function (resolve, reject) {
//       (function waitForData(){
//           if (props.data.length > 0) return resolve();
//           setTimeout(waitForData, 50);
//       })();
//   });
// }

function genLineChart() {

  let scaleX = d3.scaleTime()
  .domain(d3.extent(props.data, d => d[0]))
  .range([margin.left,hWidth]);

  scaleX.ticks(2)

  let scaleY = d3.scaleLinear()
  .domain([0,d3.max(props.data, d => d[1])])
  .range([hHeight, margin.top])

  
    var svg = d3.select("#lineGraph")
    .append("svg")
    .attr("viewBox", [0, 0, hWidth*1.25, hHeight*1.25])
    .attr("transform", "translate(" + (margin.left/2) + ",0)")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")


    svg.append("text")
    .attr("x", ((hWidth/2)-(margin.left+margin.right)))
    .attr("y", margin.top/2)
    .attr("font-weight", "light")
    .attr("id", "lcTitle")
    .text((props.highlighted ?? "Crop Count") + " by Year");


    // Append x-axis label
    svg.append("text")
      .attr("x", ((hWidth/2)-(margin.left/3)))
      .attr("y", hHeight+margin.bottom)
      .attr("font-weight", "light")
      .text("Year");

    svg.append("g")
        .call(d3.axisBottom(scaleX).tickFormat(d3.timeFormat("%Y")))
        .attr("transform", "translate(0," + hHeight + ")");
  
    svg.append("g")
        .attr("id", "lineYAxis")
        .call(d3.axisLeft(scaleY).ticks(3))
        .attr("transform", "translate(" + (margin.left) + ",0)")
  
    svg.append("path")
        .datum(props.data)
        .attr("fill", "none")
        .attr("id", "grLine")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
          .x(function(d) { return scaleX(d[0]) })
          .y(function(d) { return scaleY(d[1]) })
          .curve(d3.curveBasis)
          )
        

  
  }
  return (
    <div id="lineGraph">
    </div>
  )
}

export default LineChart; 