import React, { useEffect } from 'react';

import * as d3 from "d3";

function Map(props) {

// Dimensions of map
const width = 1200,
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



// function multiplyColors(c1, c2) {
  
//   let rgb1 = d3.color(c1);
//   let rgb2 = d3.color(c2);

//   let r = Math.floor((rgb1['r'] * rgb2['r']) / 255);
//   let g = Math.floor((rgb1['g'] * rgb2['g']) / 255);
//   let b = Math.floor((rgb1['b'] * rgb2['b']) / 255);


//   return rgbToHex(r,g,b);

// }
// function rgbToHex(r, g, b) {
//   const componentToHex = c => {
//     const hex = c.toString(16);
//     return hex.length === 1 ? '0' + hex : hex;
//   };
//   return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
// }



useEffect(() => {



  fetch('./DATA_INPUTS/Spatial_data_inputs/world.geo.json').then(response => {

          return response.json();
  
        }).then(data => {

         
          let projection = d3.geoMercator();

          let path = d3.geoPath()
            .projection(projection);
       
            
          const svg = d3.select("#map")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .on("click", (event,d) => {

            if(event.srcElement.tagName === "svg") {

              props.setSelected(null);

            }
            
          })
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");



          const g = svg.append("g")
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .style("stroke-width", 0.5)
          .style("stroke", "white")
          .attr("d", d => path(d))
          //.on("click", d => props.setSelected(d.properties.iso_a3))
          .on("click", (event, d) => {
            props.setSelected(d.properties.iso_a3)
          })
          //.on("pointermove", (d,e) => pointerMove(d,e))
          .attr("fill", d => d.color);
          // .on("mouseover", function(d,i) {
          //   d3.select(this.parentNode.appendChild(this)).transition().duration(300)
          //       .style({'stroke-opacity':1,'stroke':'#F00'});
          // });

          const tooltip = svg.append("g")
          .attr("id", "ttlbl")
          .attr("opacity", 0);
    
    
          tooltip.append("rect")
          //.attr("fill", (d,idx) => yC[idx])
          .attr("fill", "ghostwhite")
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("stroke", "black")
          .attr("stroke-width", "2px")
          .attr("opacity", 1)
          //.attr("width", d => d.length * 10 + ((": $0.00").length*5))
          .attr("width", 80)
          .attr("height", 4 * 23)
          .attr("transform", (d,idx) => "translate(0," + parseFloat(50) + ")");
    
    
        // tooltip.selectAll("path")
        // .data(lines)
        // .join("circle")
        //   // Manually add offset based on index of year
        //   // Oh boy is this some spaghetti
        //   // Note - 20 is the offset in this case, as each index is multiplied by 20
        //   .attr("transform", (d,idx) => "translate(8," + (parseFloat(idx * 15)-3) + ")")
        //   .attr("r", 6)
        //   .attr("fill", (d,idx) => yC[idx]);
    

    
          // tooltip.selectAll("text")
          // .data(lines)
          // .join("text")
          // .style("font-size", 12)
          // .style("border", "solid")
          // .style("border-width", "2px")
          // .style("border-radius", "5px")
          // .attr("transform", (d,idx) => "translate(16," + (parseFloat((idx * 15))+1) + ")")
          // .text(d => d + ": $0.00"); 
    
          tooltip.append("text")
          .attr("id", "ttlblyear")
          .style("font-size", 12)
          .style("font-weight", "bold")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .attr("transform", "translate(16," + parseFloat(-13) + ")")
          .text("Year 0");
  


          const zoom = d3.zoom()
              .scaleExtent([1, 8])
              .extent([[0, 0], [width, height]])
              //.translateBy(g, 500, -500)
              .on("zoom", (d) => g.attr("transform", d.transform));
          
          svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(0,height/4).scale(1.27));





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

  if(props.current.length !== 0) { 

    let paths = g.selectAll("path");
    
    paths.attr("fill", (d,idx) => {

      var val = props.current.find(e => (e["ISO3_Code"] === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3));

      if(!val) {
        nf.push(d.properties);
      }

      // Assure that this value truly exists in our database
      if(!val) return props.nullclr;
      if(isNaN(val[props.variable1]) || isNaN(val[props.variable2])) return props.nullclr;

      return val.color;

    });
    // .on("click", (e, d) => {

    //     var val = props.current.find(f => f["ISO3_Code"] === d.properties.iso_a3)

    //     props.setCountry(val);
        

    // });


  } // else console.log("CURRENT 0")

  // Diagnostic print statements for associating countries with data
  // console.log(nf.length + " COUNTRIES NOT FOUND\n");
  // console.log(nf);

}, [props.current]);


// Update highlighted countries
useEffect(() => {

  var g = d3.select("#map").select("svg").select("g");

  if(props.highlight != null) {

    g.selectAll("path")
    .transition()
    .duration(200)
    .style("stroke", d => {

      var val = props.current.find(e => (e["ISO3_Code"] === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3));

      // Assure that this value truly exists in our database
      if(!val) return props.nullclr;
      if(isNaN(val[props.variable1]) || isNaN(val[props.variable2])) return props.nullclr;

      return val.color === props.highlight ? props.highlightClr : "white";
      
    })
    .style("stroke-width", d => {
      

      var val = props.current.find(e => (e["ISO3_Code"] === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3));

      // Assure that this value truly exists in our database
      if(!val) return props.nullclr;
      if(isNaN(val[props.variable1]) || isNaN(val[props.variable2])) return props.nullclr;

      return val.color === props.highlight ? 2 : 0.5;


    });

    // g.selectAll("path")
    // .data(props.current)
    // // .transition()
    // // .duration(300)
    // .style("stroke", d => d.color === props.highlight ? "red" : "white")
    // .style("stroke-width", d => d.color === props.highlight ? 3 : 0.5);
    // .on("change", (d,i) => {
    //   d3.select(this.parentNode.appendChild(this)).transition().duration(300)
    //   .style({'stroke-opacity':1,'stroke':'#F00'});
    // });

  } else {

    g.selectAll("path")
    .transition()
    .duration(300)
    .style("stroke", "white")
    .style("stroke-width", 0.5);

  }

}, [props.highlight])


function pointerMove(d,e) {


  // let position = d3.pointer(d);

  // let boundX = position[0]-(margin.right+(margin.left*2));
  // let boundY = position[1]-margin.top-margin.bottom;

  // let visible = true;
  // if(boundX > (width-margin.right-margin.left) || boundX <= 0) visible = false;
  // if(boundY > height-margin.top-margin.bottom || boundY <= -margin.top) visible = false;

  // console.log(e.properties.name);






  // Max width before graph flips, calculated by label + figure amount
  // let maxWidth = d3.max(lines, d => {
  //   return d.length * 10 + ((": $0.00").length*5);
  // });

  // let maxWidth = d3.max(lines, d => {
  //   return ((": $0.00").length*5);
  // });

  // d3.select("#ttline")
  // .attr("opacity", visible ? 1 : 0);


  // d3.select("#ttlbl")
  // .attr("opacity", visible ? 1 : 0);

  // Get point on graph by inverting the mouse's x coordinate, converting it to an integer
  // and making sure its positive to convert into an index for data array
  //let idx = Math.floor(d3.max([0,x.invert(position[0]-(margin.right+(margin.left*2)))-1]));

  //if(idx > props.length) idx = props.length-1;


  //let minY = d3.min([props.data[idx].revenue, props.data[idx].cost]);
  //let maxY = d3.max([props.data[idx].revenue, props.data[idx].cost]);

  // d3.select("#ttline")
  // .attr("x1", position[0]-(margin.right+(margin.left*2)))
  // .attr("x2", position[0]-(margin.right+(margin.left*2)));
  // .attr("y1", y(0))
  // .attr("y2", y(maxY));

  // Move all elements about graph
  // d3.select("#ttlbl")
  // .selectAll("*")
  // .attr("x", position[0] - (margin.right+margin.left) - (maxWidth+position[0] >= width ? 120 : 15))
  // .attr("y", position[1]-35);

  // And the circles too
  // d3.select("#ttlbl")
  // .selectAll("circle")
  // .attr("cx", position[0] - (margin.right+margin.left) - (maxWidth+position[0] >= width ? 120 : 15))
  // .attr("cy", position[1]-35);


  // Update all tooltip data points
  // d3.select("#ttlbl")
  // .selectAll("text")
  // .text((d,idy) => {
  //   let point = props.data[idx];
  //   // Set label accordingly - each data point is in the format of [revenue, cost, value]
  //   let num = idy === 0 ? point.revenue : idy === 1 ? point.cost : idy === 2 ? (point.revenue + point.cost) : (point.value);
  //   return new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(num);
  //   //return d + ":" + new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(num);
  // });

  // d3.select("#ttlblyear")
  // .text("Year " + props.data[idx].year);

}



  return (


    <>

      {/* <Histogram distribution={props.distribution} /> */}
      <div id="map">
    
      

      </div>

    </>


  );
}

export default Map;