import React, { useEffect, useState } from 'react';

import * as d3 from "d3";

import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import AntSwitch from '@mui/material/AntSwitch';



function Map(props) {
// function Map(data, {
//   id = d => d.id, // given d in data, returns the feature id
//   value = () => undefined, // given d in data, returns the quantitative value
//   title, // given a feature f and possibly a datum d, returns the hover text
//   format, // optional format specifier for the title
//   scale = d3.scaleSequential, // type of color scale
//   domain, // [min, max] values; input of color scale
//   range = d3.interpolateBlues, // output of color scale
//   width = 640, // outer width, in pixels
//   height, // outer height, in pixels
//   projection, // a D3 projection; null for pre-projected geometry
//   features, // a GeoJSON feature collection
//   featureId = d => d.id, // given a feature, returns its id
//   borders, // a GeoJSON object for stroking borders
//   outline = projection && projection.rotate ? {type: "Sphere"} : null, // a GeoJSON object for the background
//   unknown = "#ccc", // fill color for missing data
//   fill = "white", // fill color for outline
//   stroke = "white", // stroke color for borders
//   strokeLinecap = "round", // stroke line cap for borders
//   strokeLinejoin = "round", // stroke line join for borders
//   strokeWidth, // stroke width for borders
//   strokeOpacity, // stroke opacity for borders
// } = {}) {
//   // Compute values.
//   const N = d3.map(data, id);
//   const V = d3.map(data, value).map(d => d == null ? NaN : +d);
//   const Im = new d3.InternMap(N.map((id, i) => [id, i]));
//   const If = d3.map(features.features, featureId);

//   // Compute default domains.
//   if (domain === undefined) domain = d3.extent(V);

//   // Construct scales.
//   const color = scale(domain, range);
//   if (unknown !== undefined) color.unknown(unknown);



const width = 1000,
height = 800;

const [geoData, setGeoData] = useState({});

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


// var max = Number.MAX_VALUE;
// var min = Number.MIN_VALUE;
var q1 = 0;


//fetch('./DATA_INPUTS/Spatial_data_inputs/countries.geojson').then(response => {
  fetch('./DATA_INPUTS/Spatial_data_inputs/world.geo.json').then(response => {

          return response.json();
  
        }).then(data => {

          let clr = multiplyColors(d3.interpolateBlues(0.01), d3.interpolateBlues(0.7));
          console.log(clr);
          setGeoData(data);
          let projection = d3.geoMercator();

          let path = d3.geoPath()
            .projection(projection);
       
            
          const svg = d3.select("#map")
          .append("svg")
          .style("border", "1px solid black")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

          // 75th q1 of data, to remove extraneous value
          q1 = d3.quantile(props.current, .80, d => d[2])

          let magmaClr = (d) => d3.interpolateMagma( d/q1 );



          // bivariateColorScale = values => {
          //   const [xValue, yValue] = values;
          //   // feel like it is more readable to destructure config object rather than writing legendConfig.blah a number of times
          //   const { width, height, colorX, colorY, color0, interpolator } = legendConfig;
            
          //   const xBotScale = interpolator(color0, colorX);
          //   const xTopScale = interpolator(
          //     colorY,
          //     multiplyColors(colorX, colorY)
          //   );

          //   const yColorScale = interpolator(
          //     xBotScale(xScale(xValue)),
          //     xTopScale(xScale(xValue))
          //   );
          //   return yColorScale(yScale(yValue));
          // }


          const g = svg.append("g")
          .selectAll("path")
          .data(data.features)
          // .join("path")
          .enter()
          .append("path")
          .style("stroke-width", 0.5)
          .style("stroke", "white")
          .attr("d", d => path(d))
          .attr("fill", "steelblue");
       
       
          //d3.select("#map").select("svg").remove("*");


          // if(props.current.length != 0) { 



          //   g.selectAll("path").attr("fill", (d,idx) => {
          //     var val = props.current.find(e => (e[0] === d.properties.formal_en || e[0] === d.properties.name))
          //     // || e.includes(d.properties.name)
          //     return val ? magmaClr(val[2]) : "#808080";
          //   })
          //   .on("click", (e, d) => {
          //     var val = props.current.find(f => (f[0] === d.properties.formal_en || f[0] === d.properties.name))
          //       console.log(val);
          //       console.log(d.properties)
          //       props.setLabel("Country " + val[0] + " Avg. " + val[2] + " q1 " + q1);
          //   });

          // }

        //   // Band scale for x-axis
        //   const xScale = d3
        //     .scaleBand()
        //     .domain([0, 1])
        //     .range([0, width]);
          
        //   // Linear scale for y-axis
        //   const yScale = d3
        //     .scaleLinear()
        //     .domain(domain)
        //     .range([height, 0]);


        //   var gradient = legend.append('defs')
        //       .append('linearGradient')
        //       .attr('id', 'gradient')
        //       .attr('x1', '0%') // bottom
        //       .attr('y1', '100%')
        //       .attr('x2', '0%') // to top
        //       .attr('y2', '0%')
        //       .attr('spreadMethod', 'pad');





        // // Drawing the legend bar
          const legend = svg.append("g")
          .attr("class", "legend")
          .attr("width", 50)
          .attr("height", 100)
          .style('position', 'absolute')
          .style('top', '85%')
          .style('right', '0')
          .attr("transform", "translate(120,350)");


          legend.append("text")
          .text("Legend");

          const zoom = d3.zoom()
              .scaleExtent([1, 8])
              .extent([[0, 0], [width, height]])
              .on("zoom", (d) => g.attr("transform", d.transform));
          
          svg.call(zoom);




        }).catch(err => {

          console.log("Error Reading data " + err);

});

}, []);
// }, [props.current, props.nutrient, props.range]);




// Update map each time new data is retrieved
useEffect(() => {

  let q1 = d3.quantile(props.current, .80, d => d.avg1);
  let q2 = d3.quantile(props.current, .80, d => d.avg2);

  let magmaClr = (d) => d3.interpolateMagma( d/q1 );
  let secondClr = (d) => d3.interpolateCividis( d/q1 );

  var g = d3.select("#map").select("svg").select("g");

  let nf = [];

  if(props.current.length != 0) { 


    console.log(geoData);
    g.selectAll("path").attr("fill", (d,idx) => {
      //var val = props.current.find(e => (e[0] === d.properties.formal_en || e[0] === d.properties.admin))
      var val = props.current.find(e => (e.country === d.properties.formal_en || e.country === d.properties.admin))


      if(!val) {
        nf.push(d.properties);
      }
      return val ? secondClr(val.avg1) : "#808080";
    })
    .on("click", (e, d) => {
        //var val = props.current.find(f => (f[0] === d.properties.formal_en || f[0] === d.properties.admin))
        var val = props.current.find(f => (f.country === d.properties.formal_en || f.country === d.properties.admin))

        console.log(val);
        console.log(d.properties)
        props.setLabel("Country: " + val.country + " Nutrient: " + props.nutrient + " Avg. " + val.avg1 + " q1 " + q1 + "\n" +
          " Nutrient: " + props.nutrientTwo + " Avg. " + val.avg2 + " q2 " + q2);
    });

  }

  console.log(nf.length + " COUNTRIES NOT FOUND\n");
  console.log(nf);


  // g.selectAll("path")
  // // .data(data.features)
  // .attr("fill", (d,idx) => {
  //   var val = props.current.find(e => (e[0] === d.properties.formal_en || e[0] === d.properties.name))
  //   return val ? magmaClr(val[2]) : "#808080";
  // })

  // const g = svg.append("g")
  // .selectAll("path")
  // .data(data.features)
  // // .join("path")
  // .enter()
  // .append("path")
  // .style("stroke-width", 0.5)
  // .style("stroke", "white")
  // .attr("d", d => path(d))
  // .attr("fill", (d,idx) => {
  //   var val = props.current.find(e => (e[0] === d.properties.formal_en || e[0] === d.properties.name))
  //   // || e.includes(d.properties.name)
  //   return val ? magmaClr(val[2]) : "#808080";
  // })


}, [props.current, props.nutrient, props.nutrientTwo, props.range]);


//   // Construct a path generator.
//   const path = d3.geoPath(projection);




// d3.json(props.data, function(err, geojson) {
//       svg.append("path").attr("d", path(geojson.features));})


  // svg.append("g")
  //   .selectAll("path")
  //   .data(props.data.features)
  //   .join("path")
  //       .attr("fill", (d, i) => colors(d))
  //     // .attr("fill", (d, i) => color(V[Im.get(If[i])]))
  //     .attr("d", path(props.data))
  //   .append("title")
  //     .text((d, i) => "Title");


      //.text((d, i) => title(d, Im.get(If[i])));

//   if (borders != null) svg.append("path")
//       .attr("pointer-events", "none")
//       .attr("fill", "none")
//       .attr("stroke", stroke)
//       .attr("stroke-linecap", strokeLinecap)
//       .attr("stroke-linejoin", strokeLinejoin)
//       .attr("stroke-width", strokeWidth)
//       .attr("stroke-opacity", strokeOpacity)
//       .attr("d", path(borders));

  // return Object.assign(svg.node(), {scales: {color}});

  return (





    <>

      <div id="map">

      </div>

    </>


  );
}

export default Map;