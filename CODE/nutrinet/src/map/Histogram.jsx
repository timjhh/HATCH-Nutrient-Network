import React, { useEffect, useState } from 'react';
import * as d3 from "d3";
import Papa from 'papaparse';
import {event as currentEvent} from 'd3-selection';


function Histogram(props) {

  const margin = {top: 50, right: 20, bottom: 30, left: 30},
  width = 200 - margin.right - margin.left,
  height = 200 - (margin.top+margin.bottom);

  let itemWidth = 10; // Width of each individual rectangle

  
  let scaleX = d3.scaleLinear()
  .domain(props.distribution.size)
  .range([0,width]);

  let scaleY = d3.scaleLinear()
  .domain(d3.extent(props.distribution.entries(), d => d[1]))
  .range([0, height])


  useEffect(() => {

    const svg = d3.select("#map").select("svg")
    .append("g")
    .attr("class", "histogram")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,200)");


  }, [])

  useEffect(() => {

    if(props.distribution) {

    }

  }, [props.distribution]);

    // useEffect(() => {

    //     var svg = d3.select("#hist")
    //     .append("svg")
    //         .attr("width", width + margin.left + margin.right)
    //         .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //         .attr("transform",
    //             "translate(" + margin.left + "," + margin.top + ")");

    //     if(props.distribution.length > 0) {
    //         console.log(props.distribution);
    //         var xScale = d3.scaleLinear()
    //         .domain([0,50])
    //         .range(d3.extent(props.distribution, d => Object.entries(d)[1]))
    //     }



    // }, [])


    // useEffect(() => {


    //     //genGraph(props.distribution);
        
    //     if(props.distribution.length > 0) {
    //         console.log(props.distribution);
    //         var xScale = d3.scaleLinear()
    //         .domain([0,50])
    //         .range(d3.extent(props.distribution, d => Object.entries(d)[1]))
    //     }

    // }, [props.distribution])








    // Consider adding async back
    async function genGraph(data) {


    d3.select("#graph").select("svg").remove();






    // const zoom = d3.zoom()
    //     .scaleExtent([1, 8])
    //     .extent([[0, 0], [width, height]])
    //     .on("zoom", (d) => {
    //       g.attr("transform", d.transform)
    //     });
    
    // svg.call(zoom);











  }





  return (
    <div id={"hist"}>
      
    </div>
  );
}

export default Histogram;
