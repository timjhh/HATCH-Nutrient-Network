import React, { useEffect, useState } from 'react';

import * as d3 from "d3";

import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import AntSwitch from '@mui/material/AntSwitch';



function Map(props) {


const width = 1000,
height = 800;

const colors1d = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];
const colors2d = [
["#e8e8e8", "#ace4e4", "#5ac8c8"], 
["#dfb0d6", "#a5add3", "#5698b9"], 
["#be64ac", "#8c62aa", "#3b4994"]
];
const legendSize = 20;

const [geoData, setGeoData] = useState({});

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



// if(props.current.length != 0) {  



//fetch('./DATA_INPUTS/Spatial_data_inputs/countries.geojson').then(response => {
  fetch('./DATA_INPUTS/Spatial_data_inputs/world.geo.json').then(response => {

          return response.json();
  
        }).then(data => {

          // let q1 = d3.quantile(props.current, .80, d => d.avg1);
         

          let q1 = d3.quantile(props.current, .80, d => d[props.variable1]);
          let secondClr = (d) => d3.interpolateCividis( d/q1 );

          let clr = multiplyColors(d3.interpolateBlues(0.01), d3.interpolateBlues(0.7));

          setGeoData(data);
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
          .attr("fill", "steelblue");
       
       
        // // Drawing the legend bar
          const legend = svg.append("g")
          .attr("class", "legend")
          .attr("font-weight", "bold")
          .attr("width", 50)
          .attr("height", 100)
          .style('position', 'absolute')
          .style('top', '85%')
          .style('right', '0')
          .attr("transform", "translate(120,350)")
          //.attr("transform", "rotate(135)");

          legend.selectAll("rect")
          .data(colors1d)
          .enter()
          .append("rect")
          .attr("width", legendSize)
          .attr("height", legendSize)
          .attr("x", (d,idx) => legendSize*(idx%3)-85)
          .attr("y", (d,idx) => legendSize*(parseInt(idx/3))-50)
          .attr("fill", d => d)
          .on("mouseover", (event,d) => {
            console.log(d)
          })
          .attr("transform", "rotate(-135)");
          



          legend.append("text")
          .text("Legend")
          .attr("x", -5);

          legend.append("text")
          .attr("x", 15)
          .attr("y", 80)
          .attr("class", "v1label")
          .attr("transform", "rotate(45)")
          .text(props.variable1);

          legend.append("text")
          .attr("x", -55)
          .attr("y", 110)
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
// }, [props.current, props.variable1, props.range]);




// Update map each time new data is retrieved
useEffect(() => {







  // Update legend labels
  let regex = /[^(a-z)(A-Z)(0-9)]/g;
  d3.select(".v1label").text(props.variable1.replace(regex, " "));
  d3.select(".v2label").text(props.variable2.replace(regex, " "));


  // Setting Max to 80th quantile
  // let q1 = d3.quantile(props.current, .80, d => d[props.variable1]);
  // let q2 = d3.quantile(props.current, .80, d => d[props.variable2]);

  var m1 = d3.max(props.current, d => parseFloat(d[props.variable1]));
  var m2 = d3.max(props.current, d => parseFloat(d[props.variable2]));
  
  let scalevar1 = d3.scaleQuantile()
  .domain([0, m1])
  .range([0,1,2]);

  let scalevar2 = d3.scaleQuantile()
  .domain([0,m2])
  .range([0,1,2]);


  // let magmaClr = (d) => d3.interpolateMagma( d/q1 );
  // let secondClr = (d) => d3.interpolateCividis( d/q1 );

  var g = d3.select("#map").select("svg").select("g");

  let nf = [];

  if(props.current.length != 0) { 


    g.selectAll("path").attr("fill", (d,idx) => {
      
      //var val = props.current.find(e => (e.country === d.properties.formal_en || e.country === d.properties.admin))
      var val = props.current.find(e => (e.ISO3_Code === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3))
      
      


      if(!val) {
        nf.push(d.properties);
      }

      //let nullclr = "#808080";
      let nullclr = "black"

      //return val ? secondClr(val.avg1) : "#808080";
      if(!val) return nullclr;
      if(isNaN(val[props.variable1]) || isNaN(val[props.variable2])) return nullclr;
  
      // let v1 = !isNaN(val[props.variable1]) ? scalevar1(parseFloat(val[props.variable1])) : 0;
      // let v2 = !isNaN(val[props.variable2]) ? scalevar2(parseFloat(val[props.variable2])) : 0;
      let v1 = scalevar1(parseFloat(val[props.variable1]));
      let v2 = scalevar2(parseFloat(val[props.variable2]));

      //return val ? colors2d[2][1] : "#808080";
      return val ? colors2d[v2][v1] : "#808080";
    })
    .on("click", (e, d) => {
        //var val = props.current.find(f => (f[0] === d.properties.formal_en || f[0] === d.properties.admin))
        
        //var val = props.current.find(f => (f.country === d.properties.formal_en || f.country === d.properties.admin))
        var val = props.current.find(f => f.ISO3_Code === d.properties.iso_a3)


        // props.setLabel("Country: " + val.Country + " Variable: " + props.variable1 + " Avg. " + val[props.variable1] + " max " + m1 + "\n" +
        //   "||| Variable: " + props.variable2 + " Avg. " + val[props.variable2] + " max " + m2);

        props.setCountry(val.Country);
        
        //props.setLabel(" Variable: " + props.variable1 + " val " + val[props.variable1] + " max " + m1);
        props.setLabel([val[props.variable1], m1]);

        //props.setLabel2("Variable: " + props.variable2 + " val " + val[props.variable2] + " max " + m2);
        props.setLabel2([val[props.variable2], m2]);

    });

  } else console.log("CURRENT 0")

  props.setTitle(props.variable1 + " + " + props.variable2);
  console.log(nf.length + " COUNTRIES NOT FOUND\n");
  console.log(nf);



}, [props.current]);


  return (


    <>

      <div id="map">

      </div>

    </>


  );
}

export default Map;