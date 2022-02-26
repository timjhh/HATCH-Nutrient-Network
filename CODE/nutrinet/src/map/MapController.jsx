import React, { useEffect, useState } from 'react';
import Map from './Map.jsx';
import NutriSelect from './NutriSelect.jsx';
import MapGraphs from './MapGraphs.jsx';

import { Grid, Stack, Switch, Paper, Box, FormControl } from '@mui/material';

import * as d3 from "d3";

import Typography from '@mui/material/Typography';


function MapController(props) {

  const [variable1, setVariable1] = useState("Population");

  const [variable2, setVariable2] = useState("Population");

  const [current, setCurrent] = useState([]);
  
  const [distribution, setDistribution] = useState([]);

  const [source, setSource] = useState("Import_kg");

  const [variables, setVariables] = useState([]);

  const [sources, setSources] = useState(["Import_kg"]);

  // Selected color will highlight all affected countries
  // This should be in the form of a hexidecimal color, or the nullclr attribute
  const [highlight, setHighlight] = useState(null);

  // Selected country will be highlighted on the scatterplot
  // This should either be an ISO_A3 Code for a country, or null.
  const [selected, setSelected] = useState(null);

  const unused = ["", "Year", "Country", "M49.Code", "ISO2.Code", "ISO3_Code", "Source",	"income"];

  const [scaleType1, setScaleType1] = useState("Quantile");
  const [scaleType2, setScaleType2] = useState("Quantile");

  // Set scatterplot scale
  const [scatterX, setScatterX] = useState("Log");
  const [scatterY, setScatterY] = useState("Linear");

  // What color to show for unavailable data
  var nullclr = "black";
  
  // What color to show for highlighted data
  var highlightClr = "#FF7F7F";

  // What line thickness should highlighted rectangles be in the legend
  var highlightLegendWidth = 4;

  // Categorical string descriptors meant for our color scale
  // This should be equal to colors2d.length, i.e. one strip of our 2d color scale
  var descriptors = ["Low", "Medium-Low", "Medium-High", "High"];

  // 3x3 Bivariate Colors
  // const colors1d = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];
  // const colors2d = [
  // ["#e8e8e8", "#ace4e4", "#5ac8c8"], 
  // ["#dfb0d6", "#a5add3", "#5698b9"], 
  // ["#be64ac", "#8c62aa", "#3b4994"]
  // ];

  // 4x4 Bivariate Colors
  const colors1d = ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8", "#dabdd4", "#bdbdd4", "#8ebdd4", "#5abdc8", "#cc92c1", "#bd92c1", "#8e92c1", "#5a92c1", "#be64ac", "#bd64ac", "#8e64ac", "#5a64ac"];
  const colors2d = [
    ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8"], 
    ["#dabdd4", "#bdbdd4", "#8ebdd4", "#5abdc8"],
    ["#cc92c1", "#bd92c1", "#8e92c1", "#5a92c1"],
    ["#be64ac", "#bd64ac", "#8e64ac", "#5a64ac"]
  ]

  // const colors1d = ["#e8e8e8", "#c8e1e1", "#a6d9d9", "#81d1d1", "#5ac8c8", "#dec8d9", "#c8c8d9", "#a6c8d9", "#81c8d1", "#5ac8c8", "#d3a7cb", "#c8a7cb", "#a6a7cb", "#81a7cb", "#5aa7c8", "#c986bc", "#c886bc", "#a686bc", "#8186bc", "#5a86bc", "#be64ac", "#be64ac", "#a664ac", "#8164ac", "#5a64ac"];
  // const colors2d = [
  //   ["#e8e8e8", "#c8e1e1", "#a6d9d9", "#81d1d1", "#5ac8c8"],
  //   ["#dec8d9", "#c8c8d9", "#a6c8d9", "#81c8d1", "#5ac8c8"], 
  //   ["#d3a7cb", "#c8a7cb", "#a6a7cb", "#81a7cb", "#5aa7c8"],
  //   ["#c986bc", "#c886bc", "#a686bc", "#8186bc", "#5a86bc"],
  //   ["#be64ac", "#be64ac", "#a664ac", "#8164ac", "#5a64ac"]
  // ];




  useEffect(() => {

    d3.csv(`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/SocioEconNutri_2019.csv").then((res, idz) => {




      let data = res.filter(d => d.Source === source);

      let m1 = d3.max(data, d => parseFloat(d[variable1]));
      let m2 = d3.max(data, d => parseFloat(d[variable2]));

      var scaleVar1;
      var scaleVar2;

      if(scaleType1 === "Quantile") {

        // PASS THE ENTIRE DOMAIN DATASET INSTEAD OF MIN/MAX
        // YES YES YES!!!!!
        scaleVar1 = d3.scaleQuantile()
        .domain(data.map(e => e[variable1]))
        .range(d3.range(0,colors2d.length));


      } else {
        
        scaleVar1 = d3.scaleSymlog()
        .domain([0, m1])
        .range([0,1]);

        // Experimental: rangeRound to flatten numbers to array index
        // scaleVar1 = d3.scaleSymlog()
        // .domain([0, m1])
        // .rangeRound(d3.range(0, colors2d.length));

      }
      //console.log(scaleVar1.quantiles())
      if(scaleType2 === "Quantile") {

        scaleVar2 = d3.scaleQuantile()
        .domain(data.map(e => e[variable2]))
        .range(d3.range(0,colors2d.length));

      } else {

        scaleVar2 = d3.scaleSymlog()
        .domain([0,m2])
        .range([0,1]);

      }
    
 


      // Iterate over data to assign colors to each country
      data.forEach(d => {


        let v1 = 0;
        let v2 = 0;


        // Apply scale each variable for coloring
        if(scaleType1 === "Quantile") {

          v1 = scaleVar1(parseFloat(d[variable1]));

        } else {
  
          v1 = Math.round(scaleVar1(parseFloat(d[variable1])) * colors2d.length)-1;
          v1 = v1 < 0 ? 0 : v1;
        }

        if(scaleType2 === "Quantile") {

          v2 = scaleVar2(parseFloat(d[variable2]));
  
        } else {
          //console.log(scaleVar2(parseFloat(d[variable2])));
          v2 = Math.round(scaleVar2(parseFloat(d[variable2])) * colors2d.length)-1;
          v2 = v2 < 0 ? 0 : v2;
        }

        //console.log(v1)
        // Apply a color if it's found, else apply our default null coloring(defined above)
        try {

          d.color = ((v1 === undefined || v2 === undefined) || (isNaN(v1) || isNaN(v2))) ? nullclr : colors2d[v2][v1];
          
        } catch(e) {
          //console.log(v2)
          // console.log(scaleVar2(parseFloat(d[variable2])) * colors2d.length);
        }
        


      })

      // Create color distribution for later use in histogram
      let colorDist = d3.rollups(data, v => v.length-1, d => d.color);

      colors1d.forEach((d,idx) => {
        if(colorDist.filter(e => e[0] === d).length === 0) colorDist.push([d, 0]);
      })

      setVariables(res.columns.filter(d => !unused.includes(d)));
      setCurrent(data);
      setSources(Array.from(d3.group(res, d => d.Source).keys()));

      // Now map colors into a usable object with values { color: x, value: y, place: sequential index of color in order }
      // We add one to place because our null color has an index of -1
      setDistribution(colorDist.map(e => ({color: e[0], value: e[1], place: (colors1d.indexOf(e[0])+1) }))); 
      

    
    });


  }, [variable1, variable2, source, scaleType1, scaleType2])


  return (

    <>







      {/* <Grid container spacing={0} direction="column"
      alignItems="center"
      justifyContent="center"> */}
      <Grid container spacing={2}>


        {/* <Grid item xs={12} lg={9}> */}
        <Grid item xs={9} sx={{ }}>

            <NutriSelect
            //methods={props.methods} // Many .csv files
            sources={sources}
            variables={variables} // Single .csv file
            variable1={variable1}
            setVariable1={setVariable1}
            variable2={variable2}
            setVariable2={setVariable2}  
            // method={method}
            // setMethod={setMethod}
            scaleType1={scaleType1}
            scaleType2={scaleType2}
            setScaleType1={setScaleType1}
            setScaleType2={setScaleType2}
            source={source}
            setSource={setSource}
            scatterX={scatterX}
            setScatterX={setScatterX}
            scatterY={scatterY}
            setScatterY={setScatterY}
            {...props} />





          <Paper  sx={{ elevation: 24 }}>
            <Map
            className="viz"
            
            variable1={variable1} 
            variable2={variable2} 
            current={current} // Current data applied
            distribution={distribution}
            colors1d={colors1d}
            colors2d={colors2d}
            descriptors={descriptors}
            nullclr={nullclr}
            highlightClr={highlightClr}
            highlight={highlight}
            setHighlight={setHighlight}
            selected={selected}
            setSelected={setSelected}
  
            />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          


        <Paper sx={{ mb: 2, background: 'primary.main', elevation: 24, width: 1 }}>
          <FormControl sx={{ width: 1 }}>

          {/* <Typography sx={{ ml: 3, width: 1, mt: 1 }}>Scatterplot X Scale</Typography> */}
          <Typography align="center" sx={{  mt: 1, fontWeight: "bold"  }}>Scatterplot X Scale</Typography>
          <Stack justifyContent="center" sx={{ my: 2, width: 1 }} direction="row" spacing={1} alignItems="center">
            <Typography>Linear</Typography>
            <Switch id="scatterX" checked={scatterX === "Log"} onChange={() => { scatterX === "Log" ? setScatterX("Linear") : setScatterX("Log") }} name="scatterX" />
            <Typography>Log</Typography>
          </Stack>

          <Typography align="center" sx={{ width: 1, fontWeight: "bold" }}>Scatterplot Y Scale</Typography>
          <Stack justifyContent="center" sx={{ my: 2, width: 1 }} direction="row" spacing={1} alignItems="center">
            <Typography>Linear</Typography>
            <Switch id="scatterY" checked={scatterY === "Log"} onChange={() => { scatterY === "Log" ? setScatterY("Linear") : setScatterY("Log") }} name="scatterY" />
            <Typography>Log</Typography>
          </Stack>

          </FormControl>
        </Paper>





          <Paper  sx={{ elevation: 24 }}>
            <MapGraphs
            highlightLegendWidth={highlightLegendWidth}
            selected={selected}
            setSelected={setSelected}
            highlightClr={highlightClr}
            highlight={highlight}
            setHighlight={setHighlight}
            className="viz" 
            variable1={variable1} 
            variable2={variable2} 
            current={current} // Current data applied
            distribution={distribution}
            colors1d={colors1d}
            colors2d={colors2d}
            nullclr={nullclr}
            scatterX={scatterX}
            scatterY={scatterY}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sx={{ width: 1 }}>
          <Box       
          sx={{ backgroundColor: 'primary.dark',
          p: 2,
          m: 0
      }}>


        <Typography mb={2} mt={-2} variant={"p"} style={{"fontSize": "1.2em", "fontWeight": "lighter", "textAlign": "center"}}>- Select a color in the legend to highlight all countries of the same color class</Typography>
        <br/>
        <Typography mb={2} mt={-2} variant={"p"} style={{"fontSize": "1.2em", "fontWeight": "lighter", "textAlign": "center"}}>- Select a country to highlight it in the scatterplot</Typography>
        <br/>
        <Typography mb={2} mt={-2} variant={"p"} style={{"fontSize": "1.2em", "fontWeight": "lighter", "textAlign": "center"}}>- For more information on scores, hover over any country</Typography>
        <br/>

        <hr/>

          </Box>
        </Grid>


      </Grid>







    </>


  );
}

export default MapController;