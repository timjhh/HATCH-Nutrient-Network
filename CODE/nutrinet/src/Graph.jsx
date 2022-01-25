import React, { useEffect, useState } from 'react';
import * as d3 from "d3";
import Papa from 'papaparse';
import {event as currentEvent} from 'd3-selection';


function Graph(props) {

const radius = 2;

const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only."];


// Update margin once size ref is created
const margin = {top: 50, right: 20, bottom: 30, left: 30},
width = 700 - margin.right - margin.left,
height = 400 - (margin.top+margin.bottom);




const [parsedData, setParsedData] = useState([]);
//const [nodes, setNodes] = useState([]);
//const [links, setLinks] = useState([]);



  useEffect(() => {

    
    genGraph(props.current);


    // (async () => {


    //   try {


    //     const d = await getData('./Afghanistan_ImportsGlobalConstrained_2019.csv');


    //     const w = await wrangle(d);

    //     const g = await genGraph(w);


    //   } catch(err) {
    //     console.log(err);
    //   }


    // }) ();


    //   // yee haw!!
    //   async function wrangle(d) {


    //   let nds = [];
    //   let lnks = [];

    //   nutrients.forEach(e => {
    //     nds.push({id: e, group: 2 });
    //   })

    //   d.forEach(e => {

    //     nds.push({id: e.FAO_CropName, group: 1 })
        
    //     Object.entries(e).forEach(f => {
    
    //         if(!Number.isNaN(f[1]) && f[1] > 0) {
    //           if(nutrients.includes(f[0])) lnks.push({ source: e.FAO_CropName, target: f[0], value: f[1] })
    //         }
            

    //     })
        

    //   })




    //   return [nds,lnks];

    //   }




    //   async function getData(link) {

    //     var csvFilePath = require('./Afghanistan_ImportsGlobalConstrained_2019.csv');


    //       return new Promise(function(resolve, error) {
            
    //         Papa.parse(csvFilePath, {
    //           header: true,
    //           download: true,
    //           skipEmptyLines: true,
    //           dynamicTyping: true,
    //           complete: (res) => { resolve(res.data) }
    //         }); 

    //       });



    //   }




    async function genGraph(data) {


    d3.select("#graph").selectAll("*").remove();

    const nodes = data[0];
    const links = data[1];

    console.log(nodes);
    console.log(links);

    const svg = d3.select("#graph")
    .append("svg")
    .attr("class", "svg-content-responsive svg-container")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("border", "1px solid black")
    //.style("position", "absolute")
    .attr("viewBox", "0 0 " + (width) + " " + (height))
    .on("click", (event, item) => {
        console.log(event.srcElement.tagName === "svg");

        if(event.srcElement.tagName === "svg") {
          node.attr("opacity", 1);
          link.attr("opacity", 1);
        }

    });

    const g = svg.append("g")
    .attr("class", "content");


    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .extent([[0, 0], [width, height]])
        .on("zoom", (d) => {
          g.attr("transform", d.transform)
        });
    
    svg.call(zoom);

  var forceX = d3.forceX(function(d) {


    var bip = d3.select("#bipSwitch").attr("checked");

    if(!bip) {

      return d.group === 2 ? width/3 : (2*width)/3;

    }
      return 0.01;
    }).strength(() => {
      return d3.select("#bipSwitch").attr("checked") ? 0.01 : 0.5;
    });


  var forceY = d3.forceY(null).strength(0);

    const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("repel", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide(4))
    .force("x", forceX)
    .force("y", forceY);


  var link = g.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke", "lightgray")
      .attr("stroke-width", function(d) { return 0.2; });


    var node = g.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter().append("g");

    var labels = node.append("text")
    .text((d) => d.id)
        //.attr('x', -radius) // Optional styling for large circles
        //.style("font-size", "10px")
        .attr('x', 4)
        .style("cursor", "pointer")
        .style("font-weight", "bold")
        .style("font-size", "0.2em")
        .attr('y', 0);





    var circles = node.append("circle")
    .attr("r", radius)
    .on("click", (e, d) => {

          var connected = link.filter(g => g.source.id === d.id || g.target.id === d.id);


          node.attr("opacity", 0.1);
          link.attr("opacity", g => (g.source.id === d.id || g.target.id === d.id) ? 1 : 0.1);

          node.filter(h => h.id === d.id).attr("opacity", 1);

          connected.each(function(g) {
            node.filter(h => h.id === g.source.id || h.id === g.target.id).attr("opacity", 1);
          });



    })
    .attr("fill", d => (d.group === 2 ? "steelblue" : "red"))
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));


    simulation
    .nodes(nodes)
    .on("tick", ticked);

    simulation.force("link")
    .links(links);






  function dragstarted(d) {
    if (!d.active) simulation.alphaTarget(0.3).restart();
    d.subject.fx = d.x;
    d.subject.fy = d.y;
  }

  function dragged(d) {
    d.subject.fx = d.x;
    d.subject.fy = d.y;
  }

  function dragended(d) {
    if (!d.active) simulation.alphaTarget(0);
    d.subject.fx = null;
    d.subject.fy = null;
  }




    function ticked() {

      link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      node
      .attr("transform", function(d) {
        return "translate(" + (d.x = Math.max(radius, Math.min(width - radius, d.x))) + "," + (d.y = Math.max(radius, Math.min(height - radius, d.y))) + ")"; 
      });

  }






      // Re-compute y force on graph
      simulation.force("y").initialize(nodes);

      // Restart simulation
      simulation
      .alpha(0.3)
      .alphaTarget(0)
      .restart();
     }



  }, [props.current])

  useEffect(() => {


    console.log(props.switch);
    let svg = d3.select("graph").select("svg");


  }, [props.current]);







// function genGraph({
//   nodes, // an iterable of node objects (typically [{id}, …])
//   links // an iterable of link objects (typically [{source, target}, …])
// }, {
//   nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
//   nodeGroup, // given d in nodes, returns an (ordinal) value for color
//   nodeGroups, // an array of ordinal values representing the node groups
//   nodeTitle, // given d in nodes, a title string
//   nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
//   nodeStroke = "#fff", // node stroke color
//   nodeStrokeWidth = 1.5, // node stroke width, in pixels
//   nodeStrokeOpacity = 1, // node stroke opacity
//   nodeRadius = 5, // node radius, in pixels
//   nodeStrength,
//   linkSource = ({source}) => source, // given d in links, returns a node identifier string
//   linkTarget = ({target}) => target, // given d in links, returns a node identifier string
//   linkStroke = "#999", // link stroke color
//   linkStrokeOpacity = 0.6, // link stroke opacity
//   linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
//   linkStrokeLinecap = "round", // link stroke linecap
//   linkStrength,
//   colors = d3.schemeTableau10, // an array of color strings, for the node groups
//   width = 640, // outer width, in pixels
//   height = 400, // outer height, in pixels
//   invalidation // when this promise resolves, stop the simulation
// } = {}) {
//   // Compute values.
//   const N = d3.map(nodes, nodeId).map(intern);
//   const LS = d3.map(links, linkSource).map(intern);
//   const LT = d3.map(links, linkTarget).map(intern);
//   if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
//   const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
//   const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
//   const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
//   const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);


//   // Replace the input nodes and links with mutable objects for the simulation.
//   nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
//   links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

//   // Compute default domains.
//   if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

//   // Construct the scales.
//   const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

//   // Construct the forces.
//   const forceNode = d3.forceManyBody();
//   const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
//   if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
//   if (linkStrength !== undefined) forceLink.strength(linkStrength);

//   const simulation = d3.forceSimulation(nodes)
//       .force("link", forceLink)
//       .force("charge", forceNode)
//       .force("center",  d3.forceCenter())
//       .on("tick", ticked);

//   const svg = d3.create("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("viewBox", [-width / 2, -height / 2, width, height])
//       .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

//   const link = svg.append("g")
//       .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
//       .attr("stroke-opacity", linkStrokeOpacity)
//       .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
//       .attr("stroke-linecap", linkStrokeLinecap)
//     .selectAll("line")
//     .data(links)
//     .join("line");

//   const node = svg.append("g")
//       .attr("fill", nodeFill)
//       .attr("stroke", nodeStroke)
//       .attr("stroke-opacity", nodeStrokeOpacity)
//       .attr("stroke-width", nodeStrokeWidth)
//     .selectAll("circle")
//     .data(nodes)
//     .join("circle")
//       .attr("r", nodeRadius)
//       .call(drag(simulation));

//   if (W) link.attr("stroke-width", ({index: i}) => W[i]);
//   if (L) link.attr("stroke", ({index: i}) => L[i]);
//   if (G) node.attr("fill", ({index: i}) => color(G[i]));
//   if (T) node.append("title").text(({index: i}) => T[i]);
//   if (invalidation != null) invalidation.then(() => simulation.stop());

//   function intern(value) {
//     return value !== null && typeof value === "object" ? value.valueOf() : value;
//   }

//   function ticked() {
//     link
//       .attr("x1", d => d.source.x)
//       .attr("y1", d => d.source.y)
//       .attr("x2", d => d.target.x)
//       .attr("y2", d => d.target.y);

//     node
//       .attr("cx", d => d.x)
//       .attr("cy", d => d.y);
//   }

//   function drag(simulation) {    
//     function dragstarted(event) {
//       if (!event.active) simulation.alphaTarget(0.3).restart();
//       event.subject.fx = event.subject.x;
//       event.subject.fy = event.subject.y;
//     }
    
//     function dragged(event) {
//       event.subject.fx = event.x;
//       event.subject.fy = event.y;
//     }
    
//     function dragended(event) {
//       if (!event.active) simulation.alphaTarget(0);
//       event.subject.fx = null;
//       event.subject.fy = null;
//     }
    
//     return d3.drag()
//       .on("start", dragstarted)
//       .on("drag", dragged)
//       .on("end", dragended);
//   }

//   return Object.assign(svg.node(), {scales: {color}});
// }

















  return (
    <div id={"graph"}>
      
    </div>
  );
}

export default Graph;
