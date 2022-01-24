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






// let magmaClr = (d) => d3.interpolateMagma( d/233 );

const width = 1000,
height = 800;

console.log(props.current);



useEffect(() => {

var worldData = {};

var max = Number.MAX_VALUE;
var min = Number.MIN_VALUE;





fetch('./world.geo.json').then(response => {

          return response.json();
        }).then(data => {


          let projection = d3.geoMercator();

          let path = d3.geoPath()
            .projection(projection);

        if(props.current != []) {

          Object.entries(props.current).forEach(d => {

            min = Math.min(min, d[1][1]);
            max = Math.max(max, d[1][1]);

          });


        }
        let magmaClr = (d) => d3.interpolateMagma( d/max );


        const svg = d3.select("#map")
            .append("svg")
            .style("border", "1px solid black")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");



          const g = svg.append("g")
          .selectAll("path")
          .data(data.features)
          // .join("path")
          .enter()
          .append("path")
          .attr("d", d => path(d))
          .attr("fill", (d,idx) => {
            console.log(props.current[d.properties.name_long][1])
            console.log(max)
            return props.current[d.properties.name_long] ? props.current[d.properties.name_long][1] : 500;
            //return props.current[d.properties.name_long][1];
          })
          .on("click", (e, d) => {
              console.log(d.properties.name)
          });

          const zoom = d3.zoom()
              .scaleExtent([1, 8])
              .extent([[0, 0], [width, height]])
              .on("zoom", (d) => g.attr("transform", d.transform));
          
          svg.call(zoom);






        }).catch(err => {
          // Do something for an error here
          console.log("Error Reading data " + err);

});





  // const svg = d3.create("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .attr("viewBox", [0, 0, width, height])
  //     .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

//   if (outline != null) svg.append("path")
//       .attr("fill", fill)
//       .attr("stroke", "currentColor")
//       .attr("d", path(outline));




}, [props.current]);

useEffect(() => {


}, [props.selected])

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






