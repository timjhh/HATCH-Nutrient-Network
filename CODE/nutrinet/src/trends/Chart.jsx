import React, {useEffect} from 'react';
import * as d3 from "d3";
import { LinearProgress } from '@mui/material';

function Chart(props) {

    // Dimensions of chart
    const margin = {top: 50, right: 25, bottom: 30, left: 50};    
    const width = 500 - margin.right - margin.left,
    height = 300 - (margin.top+margin.bottom);

useEffect(() => {

  if(props.data.length === 0) return;

  var data = d3.group(props.lineData, d => d.key)
  
  let svg = d3.select("#lineGraph")
  .select("svg")

  if(svg.empty()) {
    genLineChart()
  }

  const t = svg.transition()
  .duration(750)

  let scaleX = d3.scaleTime()
  .domain(d3.extent(props.data.sort((a,b) => a.Year-b.Year), d => new Date(d.Year)))
  .range([margin.left,width]);

  let scaleY = d3.scaleLinear()
  //.domain([0,d3.max(props.lineData, d => d3.max(d, e => e.Value))])
  .domain([0, d3.max(props.lineData, d => d.Value)])
  .range([height, margin.top])

  svg
  .select("#lineYAxis")
  .transition(t)
  .call(d3.axisLeft(scaleY).ticks(4, ".2")) 

  d3.select("#lines")
    .selectAll("path")
    .data(data)
  //   .join(
  //     enter => enter.append("path")
  //     .attr("opacity", 0)
  //     .transition(t)
  //     .attr("opacity", 0.8),
  //     update => update
  //     .attr("fill", d => d.Color)
  //     .attr("y", 0)
  //   .call(update => update.transition(t)
  //     .attr("y", d => scaleY(d.Value)),
  // exit => exit
  //   .call(exit => exit.transition(t)
  //     .attr("y", 0)
  //     .remove()))
  //   )
    .join("path")
    .attr("fill", "none")
    .attr("id", "grLine")
    .attr("stroke", d => d[1][0].Color)
    .attr("stroke-width", 4)
    .attr("d", d => d3.line()
      .x(d => scaleX(new Date(d.Year)))
      .y(d => scaleY(+d.Value))
      (d[1])
      //.curve(d3.curveBasis)
      )
  
}, [props.lineData])




function genLineChart() {


  var lns = props.lineData
  
  var data = d3.group(props.lineData, d => d.key)

  let scaleX = d3.scaleTime()
  .domain(d3.extent(props.data.sort((a,b) => a.Year-b.Year), d => new Date(d.Year)))
  .range([margin.left,width]);

  let scaleY = d3.scaleLinear()
  //.domain([0,d3.max(props.lineData, d => d3.max(d, e => e.Value))])
  .domain([0, d3.max(props.lineData, d => d.Value)])
  .range([height, margin.top])

  
    var svg = d3.select("#lineGraph")
    .append("svg")
    .attr("viewBox", [0, 0, (width+margin.left+margin.right), (height+margin.bottom)])
    .attr("transform", "translate(" + (margin.left/2) + ",0)")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

    svg.append("text")
    .attr("x", ((width/2)-(margin.left+margin.right)))
    .attr("y", margin.top/2)
    .attr("font-weight", "light")
    .attr("id", "lcTitle")

    // Append x-axis label
    svg.append("text")
      .attr("x", ((width/2)-(margin.left/3)))
      .attr("y", height+margin.bottom)
      .attr("font-weight", "light")
      .text("Year");

    svg.append("g")
        .call(d3.axisBottom(scaleX).tickFormat(d3.timeFormat("%Y")))
        .attr("id", "lineXAxis")
        .attr("transform", "translate(0," + height + ")");
  
    svg.append("g")
        .call(d3.axisLeft(scaleY).ticks(4, ".2"))
        .attr("id", "lineYAxis")
        .attr("transform", "translate(" + (margin.left) + ",0)")
  
    var lines = svg.append("g")
    .attr("id", "lines")

    lines.selectAll("path")
        .data(data)
        .join("path")
        .attr("fill", "none")
        .attr("class", "grLine")
        .attr("stroke", d => d[1][0].Color)
        .attr("stroke-width", 4)
        .attr("d", d => d3.line()
          .x(function(d) { return scaleX(new Date(d.Year)) })
          .y(function(d) { return scaleY(d.Value) })
          (d[1])
         // .curve(d3.curveBasis)
          )
        

  
  }
  return (
    <div id="lineGraph">
      {!props.loaded &&
        <LinearProgress/>
      }
    </div>
  )
}

export default Chart;