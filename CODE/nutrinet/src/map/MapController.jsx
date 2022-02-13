import React, { useEffect, useState } from 'react';
import Map from './Map.jsx';
import NutriSelect from './NutriSelect.jsx';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Papa from 'papaparse';




import * as d3 from "d3";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { color } from '@mui/system';
import { InternMap } from 'd3';

function MapController(props) {

  const [variable1, setVariable1] = useState("Population");

  const [variable2, setVariable2] = useState("GDP");

  const [current, setCurrent] = useState([]);
  
  const [distribution, setDistribution] = useState(new InternMap);
 

  const [country, setCountry] = useState(null);
  const [label, setLabel] = useState([]);
  const [label2, setLabel2] = useState([]);

  const [title, setTitle] = useState("Title");

  const [method, setMethod] = useState(props.methods[0]);
  const [source, setSource] = useState("Import_kg");

  const [variables, setVariables] = useState([]);

  const [sources, setSources] = useState(["Import_kg"]);

  const unused = ["", "Year", "Country", "M49.Code", "ISO2.Code", "ISO3_Code", "Source",	"income"];

  const [scaleType1, setScaleType1] = useState("Quantile");
  const [scaleType2, setScaleType2] = useState("Quantile");


  // What color to show for unavailable data
  var nullclr = "black";

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


    let regex = new RegExp(`_${method}_`);

    var filtered = props.files.filter(d => d.match(regex));
    var max = Number.MAX_VALUE;
    var min = Number.MIN_VALUE;

    setCurrent([]);




    d3.csv(`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/SocioEconNutri_2019.csv").then((res, idz) => {




      let data = res.filter(d => d.Source === source);

      let m1 = d3.max(data, d => parseFloat(d[variable1]));
      let m2 = d3.max(data, d => parseFloat(d[variable2]));


      var scaleVar1;

      console.log(scaleType1);
      if(scaleType1 === "Quantile") {

        scaleVar1 = d3.scaleQuantile()
        .domain([0, m1])
        .range(d3.range(0,colors2d.length));

      } else {
        
        scaleVar1 = d3.scaleSymlog()
        .domain([0, m1])
        .range([0,1]);
        // .range(d3.range(0,colors2d.length));
        //.nice();

        //console.log(d3.range(0,colors2d.length))

        // scaleVar1 = d3.scaleSqrt()
        // .domain([0, m1])
        // .range(d3.range(0,colors2d.length));

      }

    
      var scaleVar2 = d3.scaleQuantile()
      .domain([0,m2])
      .range(d3.range(0,colors2d.length));


      // Iterate over data to assign colors to each country
      data.forEach(d => {

        // Apply scale each variable for coloring
        let v1 = scaleVar1(parseFloat(d[variable1]));
        let v2 = scaleVar2(parseFloat(d[variable2]));
        
        //console.log(v1);
        
        // Apply a color if it's found, else apply our default null coloring(defined above)
        if(scaleType1 === "Quantile") {
          d.color = (isNaN(v1) || isNaN(v2)) ? nullclr : d.color = colors2d[v2][v1];
        } else {
          d.color = (isNaN(v1) || isNaN(v2)) ? nullclr : d.color = colors2d[v2][parseInt(v1*colors2d.length)-1];
        }
        


      })

      // Create color distribution for later use in histogram
      let colorDist = d3.rollup(data, v => v.length-1, d => d.color);

      colors1d.forEach((d,idx) => {
        if(colorDist.get(d) == undefined) colorDist.set(d, 0)
      })

      setVariables(res.columns.filter(d => !unused.includes(d)));
      setCurrent(data);
      setSources(Array.from(d3.group(res, d => d.Source).keys()));
      setDistribution(colorDist);
      

      


    });





  }, [variable1, variable2, source, scaleType1])

  useEffect(() => {


    if(country) {

    let m1 = d3.max(current, d => parseFloat(d[variable1]));
    let m2 = d3.max(current, d => parseFloat(d[variable2]));
    
    //props.setLabel(" Variable: " + props.variable1 + " val " + val[props.variable1] + " max " + m1);
    setLabel([country[variable1], m1]);

    //props.setLabel2("Variable: " + props.variable2 + " val " + val[props.variable2] + " max " + m2);
    setLabel2([country[variable2], m2]);


    }

  }, [country])

  // useEffect(() => {

  //   if(current.length > 0) {
      
  //     let m1 = d3.max(current, d => parseFloat(d[variable1]));
  //     let m2 = d3.max(current, d => parseFloat(d[variable2]));
      
  //     setScaleVar1(d3.scaleQuantile()
  //     .domain([0, m1])
  //     .range(d3.range(0,colors2d.length)));
    
  //     setScaleVar2(d3.scaleQuantile()
  //     .domain([0,m2])
  //     .range(d3.range(0,colors2d.length-1)));
  //   }

  // }, [current])


  async function getData(link) {

    var csvFilePath = require(link);


      return new Promise(function(resolve, error) {
        
        Papa.parse(csvFilePath, {
          header: true,
          download: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (res) => { resolve(res.data) }
        }); 

      });

  }



  return (

    <>

      <NutriSelect
        //methods={props.methods} // Many .csv files
        sources={sources}
        //variables={props.nutrients} // Many .csv files
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
        {...props} />






      <Grid container spacing={0} direction="column"
      alignItems="center"
      justifyContent="center">

        <Grid item xs={12}>
          
          <Map
          setTitle={setTitle} 
          setLabel={setLabel} 
          setLabel2={setLabel2}
          setCountry={setCountry}
          className="viz" 
          variable1={variable1} 
          variable2={variable2} 
          current={current} // Current data applied
          distribution={distribution}
          colors1d={colors1d}
          colors2d={colors2d}
          nullclr={nullclr}
  
          
          />

        </Grid>
        <Grid item xs={12} sx={{ width: 1 }}>
          <Box       
          sx={{ backgroundColor: 'primary.dark',
          p: 2,
          m: 0
      }}>


            <Typography mb={-2} ml={1}>Country</Typography>
            <Typography mb={2} mt={-2} variant={"p"} style={{"fontSize": "2em", "fontWeight": "lighter"}}>{(country != null ? country.Country : "Select a Country")}</Typography>

            <Typography mt={3} mb={-2} ml={1}>Source</Typography>
            <Typography mt={-2} variant={"p"} style={{"fontSize": "2em", "fontWeight": "lighter"}}>{source}</Typography>

            <Typography mt={3} mb={-2} ml={1}>Variables</Typography>
            <Typography mb={2} mt={-2} variant={"p"} style={{"fontSize": "2em", "fontWeight": "lighter"}}>{title}</Typography>

            <hr/>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>

              
              {/* {label.map(d => (
                <p>{d}</p>
              ))} */}
              
              {label.length > 0 &&
              <>
                <Typography mb={0} mt={2} variant={"p"} style={{"fontSize": "1em", "fontWeight": "lighter"}}>{variable1}</Typography>
                <p>{label[0]} / {label[1]}</p>
                <p>= {(100*(label[0] / label[1])).toFixed(4)}%</p>
              </>
              }

            </Grid>
            <Grid item xs={12} md={6}>

              {/* {label2.map((d,idx) => (
                <p>{d}</p>
              ))} */}
              {label2.length > 0 &&
              <>
                <Typography mb={0} mt={2} variant={"p"} style={{"fontSize": "1em", "fontWeight": "lighter"}}>{variable2}</Typography>
                <p>{label2[0]} / {label2[1]}</p>
                <p>= {(100*(label2[0] / label2[1])).toFixed(4)}%</p>
              </>
              }

            </Grid>
          </Grid>
            
            
          </Box>
        </Grid>


      </Grid>







    </>


  );
}

export default MapController;






