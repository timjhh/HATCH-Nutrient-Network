import React, {useEffect, useState} from 'react';
import * as d3module from "d3";
import { LinearProgress } from '@mui/material';
import d3tip from 'd3-tip'
const d3 = {
  ...d3module,
  tip: d3tip
}

function Chart(props) {

    // Dimensions of chart
    const margin = {top: 10, right: 0, bottom: 30, left: 40};    
    const width = 500 - margin.right - margin.left,
    height = 250 - (margin.top+margin.bottom);

    const [chartLoaded, setChartLoaded] = useState(false)

    const STROKE_WIDTH = 3

useEffect(() => {
  genLineChart()
  setChartLoaded(true)
}, [])


useEffect(() => {

  if(chartLoaded) {
    updateLineChart()
  }
  
}, [props.lineData, props.scaleType, props.loaded])

function updateLineChart() {
  var data = d3.group(props.lineData, d => d.key)
  
  let svg = d3.select("#lineGraph")
  .select("svg")

  const t = svg.transition()
  .duration(750)

  let scaleX = d3.scaleTime()
  .domain(d3.extent(props.data, d => new Date(d.Year)))
  .range([margin.left,width]);

  let scaleY = props.scaleType === "Linear" ? d3.scaleLinear() : d3.scaleSymlog()

  scaleY.domain([0, d3.max(props.lineData, d => d.Value)])
  .range([height, margin.top])

  svg
  .select("#lineYAxis")
  .transition(t)
  .call(d3.axisLeft(scaleY).ticks(4, ".3")) 
  
  svg.select("#lineXAxis")
  .call(d3.axisBottom(scaleX).tickFormat(d3.timeFormat("%Y")))
  
  
  var tip = d3.tip()
  .attr("id", "d3Tip")
  .attr('class', 'd3-tip')
  .html(function(event,d) {
    return d[0]
  })
  .style("left", d => d + "px")     
  .style("top", d => (d*4) + "px");

  const g = d3.select("#lines")
    .selectAll("path")
    .data(data)
    .join(
      enter => enter.append("path")
        .attr("opacity", 0)
        .transition()
        .duration(500)
        .attr("opacity", 0.8)
        .attr("d", d => d3.line()
        .x(d => scaleX(new Date(d.Year)))
        .y(d => scaleY(+d.Value))
        (d[1])
        ),
      update => update
        .call(update => update.transition()
        .duration(500)
        .attr("d", d => d3.line()
        .x(d => scaleX(new Date(d.Year)))
        .y(d => scaleY(+d.Value))
        (d[1])
        ),
      exit => exit
        .call(exit => exit.transition()
        .duration(500)
        .attr("opacity", 0)
        .remove()))
    )
    .attr("fill", "none")
    .attr("id", (d,idx) => "grLine"+idx)
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .attr("stroke", d => d[1][0].Color)
    .attr("stroke-width", STROKE_WIDTH)
    // .attr("d", d => d3.line()
    //   .x(d => scaleX(new Date(d.Year)))
    //   .y(d => scaleY(+d.Value))
    //   (d[1])
    //   )
      g.call(tip);

}

function genLineChart() {
  
  var data = d3.group(props.lineData, d => d.displayLabel)

  let scaleX = d3.scaleTime()
  .domain(d3.extent(props.data, d => new Date(d.Year)))
  .range([margin.left,width]);

  scaleX.ticks(d3.timeYear.every(5));

  let scaleY = props.scaleType === "Linear" ? d3.scaleLinear() : d3.scaleSymlog()

  scaleY.domain([0, d3.max(props.lineData, d => d.Value)])
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


    var tip = d3.tip()
    .attr("id", "d3Tip")
    .attr('class', 'd3-tip')
    .html(function(event,d) { 
      return d[0] 
    })
    .style("left", d => d + "px")     
    .style("top", d => (d*4) + "px");

    const g = lines.selectAll("path")
        .data(data)
        .join("path")
        .attr("fill", "none")
        .attr("class", "grLine")
        .attr("stroke", d => d[1][0].Color)
        .attr("stroke-width", STROKE_WIDTH)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .attr("d", d => d3.line()
          .x(function(d) { return scaleX(new Date(d.Year)) })
          .y(function(d) { return scaleY(d.Value) })
          (d[1])
         // .curve(d3.curveBasis)
          )
        
    g.call(tip)
  
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