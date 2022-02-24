import React, { useEffect, useState } from 'react';

import * as d3 from "d3";

import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Histogram from './Histogram.jsx';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { margin } from '@mui/system';
import { nice } from 'd3';


function MapGraphs(props) {

// Dimensions of map
const width = 400,
height = 800;
const margin = {top: 50, right: 50, bottom: 30, left: 50};

const itemWidth = 10; // Width of each individual rectangle for histogram
const scR = 3; // Radius of each scatterplot circle

// Dimensions of individual graphs
const hMargin = {top: 50, right: 20, bottom: 30, left: 30},
hWidth = 300 - hMargin.right - hMargin.left,
hHeight = 200 - (hMargin.top+hMargin.bottom);


// 3x3 Bivariate Colors
// const props.colors1d = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];
// const props.colors2d = [
// ["#e8e8e8", "#ace4e4", "#5ac8c8"], 
// ["#dfb0d6", "#a5add3", "#5698b9"], 
// ["#be64ac", "#8c62aa", "#3b4994"]
// ];

// 4x4 Bivariate Colors
// const props.colors1d = ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8", "#dabdd4", "#bdbdd4", "#8ebdd4", "#5abdc8", "#cc92c1", "#bd92c1", "#8e92c1", "#5a92c1", "#be64ac", "#bd64ac", "#8e64ac", "#5a64ac"];
// const props.colors2d = [
//   ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8"], 
//   ["#dabdd4", "#bdbdd4", "#8ebdd4", "#5abdc8"],
//   ["#cc92c1", "#bd92c1", "#8e92c1", "#5a92c1"],
//   ["#be64ac", "#bd64ac", "#8e64ac", "#5a64ac"]
// ]

// const props.colors1d = ["#e8e8e8", "#c8e1e1", "#a6d9d9", "#81d1d1", "#5ac8c8", "#dec8d9", "#c8c8d9", "#a6c8d9", "#81c8d1", "#5ac8c8", "#d3a7cb", "#c8a7cb", "#a6a7cb", "#81a7cb", "#5aa7c8", "#c986bc", "#c886bc", "#a686bc", "#8186bc", "#5a86bc", "#be64ac", "#be64ac", "#a664ac", "#8164ac", "#5a64ac"];
// const props.colors2d = [
//   ["#e8e8e8", "#c8e1e1", "#a6d9d9", "#81d1d1", "#5ac8c8"],
//   ["#dec8d9", "#c8c8d9", "#a6c8d9", "#81c8d1", "#5ac8c8"], 
//   ["#d3a7cb", "#c8a7cb", "#a6a7cb", "#81a7cb", "#5aa7c8"],
//   ["#c986bc", "#c886bc", "#a686bc", "#8186bc", "#5a86bc"],
//   ["#be64ac", "#be64ac", "#a664ac", "#8164ac", "#5a64ac"]
// ];

// Length of one side of the square legend
const legendSize = 30;


const forceUpdate = useForceUpdate();

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function multiplyColors(c1, c2) {
  
  let rgb1 = d3.color(c1);
  let rgb2 = d3.color(c2);

  let r = Math.floor((rgb1['r'] * rgb2['r']) / 255);
  let g = Math.floor((rgb1['g'] * rgb2['g']) / 255);
  let b = Math.floor((rgb1['b'] * rgb2['b']) / 255);


  return rgbToHex(r,g,b);

}
function rgbToHex(r, g, b) {
  const componentToHex = c => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}



useEffect(() => {



//   fetch('./DATA_INPUTS/Spatial_data_inputs/world.geo.json').then(response => {

//           return response.json();
  
//         }).then(data => {

//           // let q1 = d3.quantile(props.current, .80, d => d.avg1);
         

//           let q1 = d3.quantile(props.current, .80, d => d[props.variable1]);
//           let secondClr = (d) => d3.interpolateCividis( d/q1 );

//           let clr = multiplyColors(d3.interpolateBlues(0.01), d3.interpolateBlues(0.7));


//           let projection = d3.geoMercator();

//           let path = d3.geoPath()
//             .projection(projection);
       
            
          const svg = d3.select("#mapGraphs")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .on("change", {forceUpdate})
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

//           // 75th q1 of data, to remove extraneous value
//           //q1 = d3.quantile(props.current, .80, d => d[2])
//           q1 = d3.quantile(props.current, .80, d => d[props.variable1]);

//           let magmaClr = (d) => d3.interpolateMagma( d/q1 );


        const g = svg.append("g");
        //.selectAll("path");
        // .data(data.features)
        // .enter()
        // .append("path")
        // .style("stroke-width", 0.5)
        // .style("stroke", "white")
        // .attr("d", d => path(d))
        // .attr("fill", d => d.color);



        //   const g = svg.append("g")
        //   .selectAll("path")
        //   .data(data.features)
        //   .enter()
        //   .append("path")
        //   .style("stroke-width", 0.5)
        //   .style("stroke", "white")
        //   .attr("d", d => path(d))
        //   .attr("fill", d => d.color);
       
       
          // Drawing the legend bar
          const legend = g.append("g")
          .attr("class", "legend")
          .attr("font-weight", "bold")
          .attr("width", 300)
          .attr("height", 200)
          .style('position', 'absolute')
          //.style('top', '85%')
          .style('right', '0')
          .attr("transform", "translate(" + ((margin.left+margin.right)+70) + "," + (margin.top*2) + ")")
          //.attr("transform", "rotate(135)");

          legend.selectAll("rect")
          .data(props.colors1d)
          .enter()
          .append("rect")
          .attr("width", legendSize)
          .attr("height", legendSize)
          .attr("x", (d,idx) => legendSize*(idx%(props.colors2d.length))-85)
          .attr("y", (d,idx) => legendSize*(parseInt(idx/(props.colors2d.length)))-50)
          .attr("fill", d => d)
          .on("click", (event,d) => {
            props.setHighlight(d);
          })
          .attr("transform", "rotate(-135)");
          
          // Low -> High label
          legend.append("text")
          .attr("x", 10)
          .attr("y", props.colors2d.length*legendSize+10)
          .attr("class", "label")
          .attr("font-weight", "lighter")
          //.attr("transform", "rotate(45)")
          .text("Low");

          legend.append("text")
          .attr("x", ((props.colors2d.length*legendSize)))
          .attr("y", ((props.colors2d.length*legendSize)/2)-20)
          .attr("class", "label")
          .attr("font-weight", "lighter")
          //.attr("transform", "rotate(45)")
          .text("High");

          legend.append("text")
          .attr("x", -((props.colors2d.length*legendSize))+15)
          .attr("y", ((props.colors2d.length*legendSize)/2)-20)
          .attr("class", "label")
          .attr("font-weight", "lighter")
          //.attr("transform", "rotate(45)")
          .text("High");
          

          // Variable 1 label
          legend.append("text")
          .attr("x", -20)
          .attr("y", 90)
          .attr("class", "v1label")
          .attr("transform", "rotate(45)")
          .text(props.variable1);


          // Variable 2 label
          legend.append("text")
          .attr("x", -45)
          .attr("y", 120)
          .attr("class", "v2label")
          .attr("transform", "rotate(-45)")
          .text("Variable 2");


          // Generate histogram base once
          genHistogram();

          genScatterPlot();




//         }).catch(err => {

//           console.log("Error Reading data " + err);

// });

}, []);




// Update map each time new data is retrieved
useEffect(() => {


  // Update legend labels
  let regex = /[^(a-z)(A-Z)(0-9)]/g;
  d3.select(".v1label").text(props.variable1.replace(regex, " "));
  d3.select(".v2label").text(props.variable2.replace(regex, " "));



  // Simple color interpolation
  // let magmaClr = (d) => d3.interpolateMagma( d/q1 );
  // let secondClr = (d) => d3.interpolateCividis( d/q1 );

  var g = d3.select("#mapGraphs").select("svg").select("g");

  let nf = [];

  if(props.current.length != 0) { 

    let paths = g.selectAll("path");

    paths.attr("fill", (d,idx) => {
      
      var val = props.current.find(e => (e["ISO3_Code"] === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3))      

      if(!val) {
        nf.push(d.properties);
      }

      // Assure that this value truly exists in our database
      if(!val) return props.nullclr;
      if(isNaN(val[props.variable1]) || isNaN(val[props.variable2])) return props.nullclr;

      return val.color;

    })
    .on("click", (e, d) => {

        var val = props.current.find(f => f["ISO3_Code"] === d.properties.iso_a3)

        props.setCountry(val);
        

    });


  } // else console.log("CURRENT 0")

  props.setTitle(props.variable1 + " + " + props.variable2);

  // Diagnostic print statements for associating countries with data
  // console.log(nf.length + " COUNTRIES NOT FOUND\n");
  // console.log(nf);


  populateScatterPlot();

}, [props.current]);


function genScatterPlot() {


  let scaleX = d3.scaleLinear()
  .domain([0,d3.max(props.current, d => d[props.variable1])])
  .range([0,hWidth]);

  // let scaleY = d3.scaleLinear()
  // .domain([0,d3.max(props.current, d => d[props.variable2])])
  // .range([hHeight, 0])

  let scaleY = d3.scaleSymlog()
  .domain([0,d3.max(props.current, d => d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2]))])
  .range([hHeight,0])



  var svg = d3.select("#mapGraphs")
  .select("svg").append("g")
  .attr("class", "scatterplot")
  .attr("height", hHeight)
  .attr("width", hWidth)
  .attr("transform", "translate(" + (margin.left+margin.right/2) + "," + (height/2+margin.top) + ")")
  .append("g")
  .attr("id", "scatterPl");

  // Append x-axis label
  svg.append("text")
    .attr("x", (hWidth/2)-hMargin.right-hMargin.left-hMargin.right-(props.variable1.length))
    .attr("y", hHeight+hMargin.bottom+10)
    .attr("font-weight", "bold")
    .attr("id", "scatterL1")
    .text(props.variable1 + " (" + props.scatterX + ")");

  // Append y-axis label
  svg.append("text")
  .attr("x", -hHeight/2-hMargin.right-hMargin.left-10)
  .attr("y", -hMargin.left-hMargin.right)
  .attr("font-weight", "bold")
  .attr("transform", "rotate(-90)")
  .attr("id", "scatterL2")
  .text(props.variable2 + " (" + props.scatterY + ")");


  svg.append("g")
      .attr("id", "scXAxis")
      .call(d3.axisBottom(scaleX))
      .attr("transform", "translate(0," + hHeight + ")");

  svg.append("g")
      .attr("id", "scYAxis")
      .call(d3.axisLeft(scaleY))
      // .attr("transform", "translate(0," + (0-hHeight) + ")");

  let circles = svg.selectAll("circle")
    // .data(props.distribution.sort((a,b) => props.colors1d.indexOf(b) - props.colors1d.indexOf(a))) // Optional sorting based on a different metric ??
    .data(props.current)
    .join("circle")
    .attr("fill", d => d.color)
    .attr("r", scR)
    .attr("cx", d => scaleX(d.color === props.nullclr ? 0 : parseFloat(d[props.variable1])))
    .transition()
    .delay(200)
    .ease(d3.easeCubicOut)
    .attr("cy", d => scaleY(d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2])));
    //.attr("cy", d => hHeight);


}
function populateScatterPlot() {
  

  var svgScatter = d3.select("#mapGraphs")
  .select(".scatterplot")
  .select("#scatterPl");
 


  // let scaleSX = d3.scaleLinear()
  // .domain([0,d3.max(props.current, d => d.color === props.nullclr ? 0 : parseFloat(d[props.variable1]))])
  // .range([0,hWidth]);

  let scaleSX = d3.scaleSymlog()
  .domain([0,d3.max(props.current, d => d.color === props.nullclr ? 0 : parseFloat(d[props.variable1]))])
  .range([0,hWidth]);


  let scaleSY = d3.scaleLinear()
  .domain([0,d3.max(props.current, d => d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2]))])
  .range([hHeight,0])

  // let scaleSY = d3.scaleSymlog()
  // .domain([0,d3.max(props.current, d => d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2]))])
  // .range([hHeight,0])

  


  // Diagnostic info: Sorted values in place of histogram
  // console.log(props.distribution.sort((a,b) => a.place-b.place)

  d3.select("#scatterL1").text(props.variable1 + " (" + props.scatterX + ")");
  d3.select("#scatterL2").text(props.variable2 + " (" + props.scatterY + ")");

  svgScatter
      .select("#scXAxis")
      .transition()
      .call(d3.axisBottom(scaleSX).tickFormat(d3.format(".2"))) 
      //.attr("transform", "translate(0," + hHeight + ")")
      .selectAll("text")
        .attr("y", (d,idx) => (idx)*10)
        //.attr("transform", (d,idx) => "translate(-10," + (idx*10) + ")rotate(-45)")
        .style("text-anchor", "end")
        //.style("fill", "#69a3b2");


    //(idx%2===1 ? 5 : 20)


  svgScatter
      .select("#scYAxis")
      .transition()
      .call(d3.axisLeft(scaleSY).tickFormat(d3.format(".2")))
      //.attr("transform", "translate(0," + (0-hHeight) + ")");

  let circles = svgScatter.selectAll("circle")
    // .data(props.distribution.sort((a,b) => props.colors1d.indexOf(b) - props.colors1d.indexOf(a))) // Optional sorting based on a different metric ??
    .data(props.current)
    .join("circle")
    .attr("class", "circle")
    .attr("fill", d => d.color)
    .attr("r", scR)
    .attr("cy", d => hHeight)
    .attr("cx", d => scaleSX(d.color === props.nullclr ? 0 : parseFloat(d[props.variable1])))
    .transition()
    .duration(500)
    .attr("cy", d => scaleSY(d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2])));


}

useEffect(() => {

  let scaleSX;

  let scaleSY;

  if(props.scatterX === "Log") {

    scaleSX = d3.scaleSymlog()
    .domain([0,d3.max(props.current, d => d.color === props.nullclr ? 0 : parseFloat(d[props.variable1]))])
    .range([0,hWidth]);
  

  } else {

    scaleSX = d3.scaleLinear()
    .domain([0,d3.max(props.current, d => d.color === props.nullclr ? 0 : parseFloat(d[props.variable1]))])
    .range([0,hWidth]);

  }

  if(props.scatterY === "Log") {

    scaleSY = d3.scaleSymlog()
    .domain([0,d3.max(props.current, d => d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2]))])
    .range([hHeight,0]);


  } else {

    scaleSY = d3.scaleLinear()
    .domain([0,d3.max(props.current, d => d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2]))])
    .range([hHeight,0]);

  }

  var svgScatter = d3.select("#mapGraphs")
  .select(".scatterplot")
  .select("#scatterPl");
 

  d3.select("#scatterL1").text(props.variable1 + " (" + props.scatterX + ")");
  d3.select("#scatterL2").text(props.variable2 + " (" + props.scatterY + ")");


  let circles = svgScatter.selectAll("circle")
    .data(props.current)
    .join("circle")
    .attr("fill", d => d.color)
    .attr("r", scR)
    .transition()
    .duration(500)
    .ease(d3.easeCubicOut)
    .attr("cx", d => scaleSX(d.color === props.nullclr ? 0 : parseFloat(d[props.variable1])))
    .attr("cy", d => scaleSY(d.color === props.nullclr ? hHeight : parseFloat(d[props.variable2])))


    svgScatter
    .select("#scXAxis")
    .transition()
    .call(d3.axisBottom(scaleSX).ticks(5, ".2")) 
    // .call(d3.axisBottom(scaleSX).tickFormat(d3.format(".2"))) 
    //.attr("transform", "translate(0," + hHeight + ")")
    .selectAll("text")
      .attr("y", props.scatterX === "Log" ? ((d,idx) => (idx)*10) : 10)
      //.attr("transform", (d,idx) => "translate(-10," + (idx*10) + ")rotate(-45)")
      .style("text-anchor", "end")



  svgScatter
      .select("#scYAxis")
      .transition()
      .call(d3.axisLeft(scaleSY).tickFormat(d3.format(".2")));
      //.call(d3.axisLeft(scaleSY).tickFormat(3, ".2"));




}, [props.scatterX, props.scatterY])

function genHistogram() {

  
  let scaleX = d3.scaleLinear()
  .domain(props.colors1d.length)
  .range([0,hWidth]);

  let scaleY = d3.scaleLinear()
  //.domain(d3.extent(props.distribution.entries(), d => d[1]))
  .domain([0,200]) // There are 195 countries in the world, so let's start with 200
  .range([hHeight, 0])


  var svg = d3.select("#mapGraphs")
  .select("svg").append("g")
  .attr("class", "histogram")
  .attr("height", hHeight)
  .attr("width", hWidth)
  .attr("transform", "translate(" + (margin.left+margin.right/2) + "," + (height/3) + ")")
  //.attr("transform", "translate(" + (width-hMargin.right-hMargin.left-hWidth) + "," + (height-hMargin.top-hMargin.bottom-hHeight) + ")")
  .append("g")
  .attr("id", "histG");

  // Append x-axis label
  svg.append("text")
    .attr("x", ((hWidth/2)-hMargin.right))
    .attr("y", hHeight+hMargin.bottom)
    .attr("font-weight", "bold")
    .text("Color");

  // Append y-axis label
  svg.append("text")
  .attr("x", -hMargin.top-hMargin.bottom-(hHeight/5))
  .attr("y", -hMargin.left)
  .attr("font-weight", "bold")
  .attr("transform", "rotate(-90)")
  .text("Frequency");


  svg.append("g")
      .call(d3.axisBottom(scaleX))
      .attr("transform", "translate(0," + hHeight + ")");

  svg.append("g")
      .attr("id", "histYAxis")
      .call(d3.axisLeft(scaleY))
      //.attr("transform", "translate(0," + (0-hHeight) + ")");


}

// Update histogram rectangles on data update
useEffect(() => {


  populateHistogram();


}, [props.distribution])

function populateHistogram() {


  var svg = d3.select("#mapGraphs")
  .select(".histogram")
  .select("#histG");

  let scaleX = d3.scaleLinear()
  .domain([0,props.colors1d.length+1])
  .range([0,hWidth]);

  let scaleY = d3.scaleLinear()
  .domain([0,d3.max(props.distribution, d => d.value)+1])
  .range([hHeight, 0])
  
  // svg.selectAll("rect")
  // .remove();

  // Diagnostic info: Sorted values in place of histogram
  // console.log(props.distribution.sort((a,b) => a.place-b.place))

  svg
    .select("#histYAxis")
    .transition()
    .call(d3.axisLeft(scaleY))

  // let rects = svg.selectAll("rect")
  //   // .data(props.distribution.sort((a,b) => props.colors1d.indexOf(b) - props.colors1d.indexOf(a))) // Optional sorting based on a different metric ??
  //   .data(props.distribution)
  // .enter().append("rect")
  //   .attr("class", "bar")
  //   .attr("fill", d => d.color)
  //   .attr("x", d => scaleX(d.place)+(itemWidth/2))
  //   .attr("height", 0)
  //   .attr("y", hHeight)
  //   .attr("width", itemWidth)


  let rects = svg.selectAll("rect")
    // .data(props.distribution.sort((a,b) => props.colors1d.indexOf(b) - props.colors1d.indexOf(a))) // Optional sorting based on a different metric ??
    .data(props.distribution)
    .join("rect")
    .attr("fill", d => d.color)
    .attr("x", d => scaleX(d.place)+(itemWidth/2))
    .attr("height", 0)
    .attr("width", itemWidth)
    .attr("y", hHeight)
    .transition()
    .duration(200)
    .attr("y", d => scaleY(d.value))
    .attr("height", d => (hHeight-scaleY(d.value)))


    // Animate graph change on reload
    // rects
    // .transition()

    //.ease(d3.easeSinIn) // There are many other d3.ease animations out there for futher customization too!
    //.delay((d,i) => (i*10)) // Sequentially applies animation - to make this instantaneous, simply comment/remove this line

}


  return (


    <>

      {/* <Histogram distribution={props.distribution} /> */}
      <div id="mapGraphs">
    
      

      </div>

    </>


  );
}

export default MapGraphs;