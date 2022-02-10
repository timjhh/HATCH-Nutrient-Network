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

function MapController(props) {

  const [variable1, setVariable1] = useState("Population");

  const [variable2, setVariable2] = useState("GDP");

  const [current, setCurrent] = useState([]);
  const [range, setRange] = useState([0,0]);

  const [country, setCountry] = useState("Select a Country");
  const [label, setLabel] = useState([]);
  const [label2, setLabel2] = useState([]);

  const [title, setTitle] = useState("Title");

  const [method, setMethod] = useState(props.methods[0]);
  const [source, setSource] = useState("Import_kg");

  const [variables, setVariables] = useState([]);

  const [sources, setSources] = useState(["Import_kg"]);

  const unused = ["Year", "Country", "M49.Code", "ISO2.Code", "ISO3_Code", "Source",	"income"];


  useEffect(() => {


    let regex = new RegExp(`_${method}_`);

    var filtered = props.files.filter(d => d.match(regex));
    var curr = [];
    var max = Number.MAX_VALUE;
    var min = Number.MIN_VALUE;

    setCurrent([]);




    d3.csv(`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/SocioEconNutri_2019.csv").then((res, idz) => {


      setVariables(res.columns.filter(d => !unused.includes(d)));
      setCurrent(res.filter(d => d.Source === source));
      setSources(Array.from(d3.group(res, d => d.Source).keys()));
      console.log(current);

    });


    // Code to dynamically load in data
    // filtered.forEach(d => {



    //   d3.csv(`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+d).then((res, idz) => {
      
    //     if(Object.entries(res).length != 1) {

    //     let idx = res.columns.indexOf(variable1); // Index of selected variable1

        
    //     // Subtract one for the entry of column names
    //     let len = Object.entries(res).length-1;
       
    //     var count1 = 0; // How many nutrients did we accurately count
    //     var sum1 = 0; // What is their summation

    //     var count2 = 0; // How many nutrients did we accurately count
    //     var sum2 = 0; // What is their summation


    //     res.forEach((row,idy) => {

          
    //       let num1 = parseFloat(row[variable1]);
          
    //       if(!Number.isNaN(num1)) {

    //         sum1 += num1;
    //         count1++;

    //       }

    //       let num2 = parseFloat(row[variable2]);
          
    //       if(!Number.isNaN(num2)) {

    //         sum2 += num2;
    //         count2++;

    //       }

    //     })

    //   //Debugging code - may be useful later
    //   //   try {
    //   //   if(res[0]["Country"] === "United States of America") {
    //   //     console.log("-------- Results --------");
    //   //     console.log(sum);
    //   //     console.log(sum / count);
    //   //     console.log(variable1);
    //   //     console.log("-------- End --------");
    //   //   }
    //   // } catch(e) {
    //   //   console.log(res)
    //   //   console.log(e)
    //   // }


    //     if(res[0]) {
    //       curr.push({

    //         country: res[0]["Country"],
    //         avg1: (sum1/count1),
    //         avg2: (sum2/count2)

    //       });
    //     }

    //   }

    //   });


    // })

    setCurrent(curr);


  }, [variable1, variable2, source])




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
        source={source}
        setSource={setSource}
        {...props} />






      <Grid container spacing={2}>

        <Grid item xs={12} lg={9}>
          
          <Map
          setTitle={setTitle} 
          setLabel={setLabel} 
          setLabel2={setLabel2}
          setCountry={setCountry}
          className="viz" 
          variable1={variable1} 
          variable2={variable2} 
          current={current} 
          range={range} />

        </Grid>
        <Grid item xs={12} lg={3}>
          <Box       
          sx={{ backgroundColor: 'primary.dark',
          p: 2,
          m: 0
      }}>

            <Typography mb={-2} ml={1}>Country</Typography>
            <Typography mb={2} mt={-2} variant={"p"} style={{"fontSize": "2em", "fontWeight": "lighter"}}>{country}</Typography>

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
                <p>= {(100*(label[0] / label[1])).toFixed(5)}%</p>
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
                <p>= {(100*(label2[0] / label2[1])).toFixed(5)}%</p>
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






