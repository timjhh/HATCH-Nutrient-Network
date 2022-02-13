import React, { useEffect, useState } from 'react';

import * as d3 from "d3";

import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Histogram from './Histogram.jsx';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


function Map(props) {


const width = 1000,
height = 700;

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
const legendSize = 25;


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



  fetch('./DATA_INPUTS/Spatial_data_inputs/world.geo.json').then(response => {

          return response.json();
  
        }).then(data => {

          // let q1 = d3.quantile(props.current, .80, d => d.avg1);
         

          let q1 = d3.quantile(props.current, .80, d => d[props.variable1]);
          let secondClr = (d) => d3.interpolateCividis( d/q1 );

          let clr = multiplyColors(d3.interpolateBlues(0.01), d3.interpolateBlues(0.7));


          let projection = d3.geoMercator();

          let path = d3.geoPath()
            .projection(projection);
       
            
          const svg = d3.select("#map")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .on("change", {forceUpdate})
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

          // 75th q1 of data, to remove extraneous value
          //q1 = d3.quantile(props.current, .80, d => d[2])
          q1 = d3.quantile(props.current, .80, d => d[props.variable1]);

          let magmaClr = (d) => d3.interpolateMagma( d/q1 );



          const g = svg.append("g")
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .style("stroke-width", 0.5)
          .style("stroke", "white")
          .attr("d", d => path(d))
          .attr("fill", d => d.color);
       
       
          // Drawing the legend bar
          const legend = svg.append("g")
          .attr("class", "legend")
          .attr("font-weight", "bold")
          .attr("width", 50)
          .attr("height", 100)
          .style('position', 'absolute')
          //.style('top', '85%')
          .style('right', '0')
          .attr("transform", "translate(120," + (height-(height/4)) + ")")
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
          .on("mouseover", (event,d) => {
            console.log(d)
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


          const zoom = d3.zoom()
              .scaleExtent([1, 8])
              .extent([[0, 0], [width, height]])
              .on("zoom", (d) => g.attr("transform", d.transform));
          
          svg.call(zoom);




        }).catch(err => {

          console.log("Error Reading data " + err);

});

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

  var g = d3.select("#map").select("svg").select("g");

  let nf = [];

  if(props.current.length != 0) { 

    let paths = g.selectAll("path");

    paths.attr("fill", (d,idx) => {
      
      //var val = props.current.find(e => (e.country === d.properties.formal_en || e.country === d.properties.admin))
      var val = props.current.find(e => (e.ISO3_Code === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3))
      
    

      if(!val) {
        nf.push(d.properties);
      }

      // Assure that this value truly exists in our database
      if(!val) return props.nullclr;
      if(isNaN(val[props.variable1]) || isNaN(val[props.variable2])) return props.nullclr;

      return val.color;

    })
    .on("click", (e, d) => {
        //var val = props.current.find(f => (f[0] === d.properties.formal_en || f[0] === d.properties.admin))
        
        //var val = props.current.find(f => (f.country === d.properties.formal_en || f.country === d.properties.admin))
        var val = props.current.find(f => f.ISO3_Code === d.properties.iso_a3)

        props.setCountry(val);
        

    });


  } else console.log("CURRENT 0")

  props.setTitle(props.variable1 + " + " + props.variable2);

  // Diagnostic print statements for associating countries with data
  // console.log(nf.length + " COUNTRIES NOT FOUND\n");
  // console.log(nf);



}, [props.current]);


  return (


    <>

      <div id="map">
        {/* <Histogram distribution={props.distribution} /> */}

      </div>

    </>


  );
}

export default Map;