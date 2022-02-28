import React, { useEffect } from 'react';
import { margin } from '@mui/system';
//import * as d3 from "d3";

// import *d3 from "d3";
// import d3Tip from "d3-tip";
// d3.tip = d3Tip;

import * as d3module from 'd3'
import d3tip from 'd3-tip'
const d3 = {
  ...d3module,
  tip: d3tip
}





function Map(props) {



  // Given a color, finds the 2d array index
  // In the form of [x, y]
  // Uses props.colors1d and props.colors2d
  function arrIdx2d(d) {
      
    let idx = props.colors1d.indexOf(d);
    
    let x = idx % props.colors2d.length;
    let y = parseInt(idx / props.colors2d.length);

    return [x,y];

  }
  
  // Given a 2d array, converts:
  // [x, y] - 2d index of a color
  // To:
  // [string, string] - a ramped description of these 2 values
  // Uses props.descriptors
  function descriptors2d(nums) {

    return [props.descriptors[nums[0]], props.descriptors[nums[1]]];

  }


// Dimensions of map
const width = 1200,
height = 750;


const projection = d3.geoMercator();

const path = d3.geoPath()
  .projection(projection);


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

         

       
            
          const svg = d3.select("#map")
          .append("svg")
          .attr("id", "mapSVG")
          .attr("width", width)
          .attr("height", height)
          .on("click", (event,d) => {

            if(event.srcElement.tagName === "svg") {

              props.setSelected(null);
              props.setHighlight(null);

            }
            
          })
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


          var tip = d3.tip()
          .attr("id", "d3Tip")
          .attr('class', 'd3-tip')
          .direction('s')
          .html(function(event,d) { 
            
            //console.log(props.current)
            //var val = props.current.find(e => (e["ISO3_Code"] === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3));

            //console.log(val)
            return d.properties.name; 
          
          });

          const g = svg.append("g")
          .attr("id", "pathsG")
          .selectAll("path")
          .data(data.features)
          .join("path")
          .style("stroke-width", 0.5)
          .style("stroke", "white")
          .attr("d", d => path(d))
          //.on("mousemove", (d,e) => pointerMove(d,e))
          // .on("pointermove", (d,e) => pointerMove(d,e))
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          // .on("mouseover", mouseOver)
          // .on("mouseout", mouseOut)
          .on("click", (event, d) => {
            props.setHighlight(null);
            props.setSelected(d.properties.iso_a3)
          })


        
          //let svg = d3.select("#mapSVG")
          
          g.call(tip);

          const tooltip = svg.append("g")
          .attr("id", "ttg")
          .attr("opacity", 0);
    

    
          tooltip.append("rect")
          //.attr("fill", (d,idx) => yC[idx])
          .attr("id", "tooltip")
          .attr("fill", "ghostwhite")
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("stroke", "black")
          .attr("stroke-width", "2px")
          .attr("opacity", 1)
          //.attr("x", 0)
          //.attr("y", 0)
          .attr("width", 80)
          .attr("height", 50)
          .attr("transform", (d,idx) => "translate(0,0)");
    
    
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
  

          function slided(d) {


            let transform = d3.zoomTransform(g.node());
            transform.k = d.target.value

            g.attr("transform", transform);
            d3.select("#sliderP").select("input").attr("value", transform.k)


          }

          const zoom = d3.zoom()
          .scaleExtent([1, 8])
          .extent([[0, 0], [width, height]])
          //.translateBy(g, 500, -500)
          .on("zoom", (d) => {

            g.attr("transform", d.transform)
            //console.log(d.transform)
            //console.log(d3.select("#sliderP").select("input").attr("value"))
            //d3.select("#sliderP").select("input").attr("value", d.transform.k)
          
            //d3.select("#sliderP").node().value = zoom.scale();

          });
          
          let zoomSlider = d3.select("#sliderP")
          //.attr("className", "position-absolute")
          //.append("input")
          .datum({})
          .attr("type", "range")
          .attr("value", zoom.scaleExtent()[0])
          .attr("min", zoom.scaleExtent()[0])
          .attr("max", zoom.scaleExtent()[1])
          .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100);
          //.on("input", () => {

            // var scale = zoom.scale(), extent = zoom.scaleExtent(), translate = zoom.translate();
            // var x = translate[0], y = translate[1];
            // var target_scale = +this.value;
            // var factor = target_scale / scale;

            // var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
            // if (clamped_target_scale != target_scale) {
            //     target_scale = clamped_target_scale;
            //     factor = target_scale / scale;
            // }
            // x = (x - center[0]) * factor + center[0];
            // y = (y - center[1]) * factor + center[1];

            // zoom.scale(target_scale).translate([x, y]);

            // g.transition()
            //         .attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")");
            // g.selectAll("path")
            //         .attr("d", path.projection(projection));

         // });

          
          svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(0,height/4).scale(1.27));




          // function setupZoom(svg, circles, gx, gy) {
          //   // D3 Zoom API:
          //   const extent = [[margin.left, margin.top], [width - margin.right, height - margin.bottom]];
          //   const zoom = d3.zoom()
          //       .extent(extent)          // Where the interaction occurs
          //       .translateExtent(extent) // Limits panning to the original extent
          //       .scaleExtent([1, 32])    // Sets the maximum zoom factor
          //       .on("zoom", zooming);
          //   svg.call(zoom);
            
          //   function zooming(event) {
          //       mutable transform = event.transform;
          //       // Do zooming here, event.transform expresses the pan+zoom from original x & y scales
          //       const xz = event.transform.rescaleX(x);  // generates a new Scale with modified domain
          //       const yz = event.transform.rescaleY(y);
          //       circles.attr("cx", d => xz(d.Longitude))
          //              .attr("cy", d => yz(d.Latitude));
          //       gx.call(xAxis, xz);
          //       gy.call(yAxis, yz);
          //   }
          // }
          
          // mutable transform = null;



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

  //var g = d3.select("#map").select("svg").select("g");
  var g = d3.select("#pathsG");

  
  let nf = [];

  if(props.current.length !== 0) { 


    // var tip = d3.tip()
    // .attr('class', 'd3-tip')
    // .direction('s')
    // .html(function(event,d) { 
      
    //   //console.log(props.current)
    //   //var val = props.current.find(e => (e["ISO3_Code"] === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3));

    //   //console.log(val)
    //   return d.properties.name + " " + d.color; 
    
    // });

    let g = d3.select("#pathsG");

    // let tip = d3.select("#d3Tip")
    // .html((d,idx) => {

    //   console.log(d);
    //   console.log(idx)
    //   return d;

    // });

    var tip = d3.tip()
    .attr("id", "d3Tip")
    .attr('class', 'd3-tip')
    .direction('s')
    .html(function(event,d) { 
      
      var val = props.current.find(e => (e["ISO3_Code"] === d.properties.iso_a3 || e.ISO3_Code === d.properties.iso_a3));

      if(val) {
        
        let desc = descriptors2d(arrIdx2d(val.color));

        return val.Country + "<br/>" + props.variable1 + ": " + desc[0] + "<br/>" + props.variable2 + ": " + desc[1]; 
      
      } else {
      
        return d.properties.name;
        //let v1 = isNaN(val[props.variable1]) ? "N/A" 
        //return d.properties.name + "<br/>" + val[props.variable1] + "<br/>" + val[props.variable2];
      
      }

    });

  

    let paths = g.selectAll("path");



    g.call(tip);
    
    paths
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .attr("fill", (d,idx) => {

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


  } else {

    g.selectAll("path")
    .transition()
    .duration(300)
    .style("stroke", "white")
    .style("stroke-width", 0.5);

  }

}, [props.highlight])


useEffect(() => {

  var g = d3.select("#map").select("svg").select("g");
  console.log(props.selected);
  if(props.selected != null) {

    g.selectAll("path")
    .transition()
    .duration(200)
    .style("stroke", d => d.properties.iso_a3 === props.selected ? props.highlightClr : "white")
    .style("stroke-width", d => d.properties.iso_a3 === props.selected ? 3 : 0.5);

  } else {

    g.selectAll("path")
    .transition()
    .duration(300)
    .style("stroke", "white")
    .style("stroke-width", 0.5);

  }

}, [props.selected])

function mouseOver(event, d) {

  //console.log(d);
  //console.log(event);
  // setTimeout(() => {
  //   d3.select("#ttg").transition().duration(250).attr("opacity", 1);
  // }, 400)

  // [x,y]
  let coords = path.centroid(d);

  // [left,top],[right,bottom]
  let bounds = path.bounds(d);

  let height = bounds[1][1] - bounds[0][1];
  let width = bounds[1][0] - bounds[0][0];

  d3.select("#ttg").attr("opacity", 1);

  d3.select("#tooltip")

  // Attach box to manually calculated center
  .attr("transform", "translate(" + (bounds[0][0]+(width/2)) + "," + (bounds[0][1]+(height/2)) + ")")
  
  // Attach box to centroid
  // .attr("transform", "translate(" + (coords[0]+(width/2)) + "," + (coords[1]+(height)) + ")")
  
  // Attach box to pointer
  //.attr("transform", `translate(${d3.pointer(event, this)})`);



}

function mouseOut() {

  // setTimeout(() => {
  //   d3.select("#ttg").attr("opacity", 0);
  // }, 400)
  
  d3.select("#ttg").attr("opacity", 0);

}

function pointerMove(d,e) {

  let position = d3.pointer(d);

  console.log(e.properties.name);

  console.log(position);
  d3.select("#tooltip")
  //.attr("x", position[0])
  //.attr("y", position[1])
  // .attr("transform", "translate(" + position[0] + "," + position[1] + ")");
  .attr("transform", `translate(${d3.pointer(d, this)})`);
  


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
    
        {/* <div id="sliderP"></div> */}
        <input type="range" onChange={(e) => console.log(e.target.value)} value="1" min="1" max="8" orient="vertical" id="sliderP"/>

      </div>

    </>


  );
}

export default Map;