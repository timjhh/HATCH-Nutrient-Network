import React, { useEffect, useState } from 'react';
import Map from './Map.jsx';
import NutriSelect from './NutriSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Papa from 'papaparse';




import * as d3 from "d3";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function MapController(props) {

  const [nutrient, setNutrient] = useState("Calories");

  const [nutrientTwo, setNutrientTwo] = useState("Zinc");

  const [current, setCurrent] = useState([]);
  const [range, setRange] = useState([0,0]);
  const [label, setLabel] = useState("Click a Country To See Nutrient Data");

  const [method, setMethod] = useState(props.methods[0]);

  useEffect(() => {


    let regex = new RegExp(`_${method}_`);

    var filtered = props.files.filter(d => d.match(regex));
    var curr = [];
    var max = Number.MAX_VALUE;
    var min = Number.MIN_VALUE;

    setCurrent([]);


    filtered.forEach(d => {



      d3.csv(`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+d).then((res, idz) => {
      
        if(Object.entries(res).length != 1) {

        let idx = res.columns.indexOf(nutrient); // Index of selected nutrient

        
        // Subtract one for the entry of column names
        let len = Object.entries(res).length-1;
       
        var count1 = 0; // How many nutrients did we accurately count
        var sum1 = 0; // What is their summation

        var count2 = 0; // How many nutrients did we accurately count
        var sum2 = 0; // What is their summation


        res.forEach((row,idy) => {

          
          let num1 = parseFloat(row[nutrient]);
          
          if(!Number.isNaN(num1)) {

            sum1 += num1;
            count1++;

          }

          let num2 = parseFloat(row[nutrientTwo]);
          
          if(!Number.isNaN(num2)) {

            sum2 += num2;
            count2++;

          }

        })

      //Debugging code - may be useful later
      //   try {
      //   if(res[0]["Country"] === "United States of America") {
      //     console.log("-------- Results --------");
      //     console.log(sum);
      //     console.log(sum / count);
      //     console.log(nutrient);
      //     console.log("-------- End --------");
      //   }
      // } catch(e) {
      //   console.log(res)
      //   console.log(e)
      // }


        if(res[0]) {
          //curr.push([res[0]["Country"], sum, sum/count]);
          curr.push({

            country: res[0]["Country"],
            avg1: (sum1/count1),
            avg2: (sum2/count2)

          });
        }

      }

      });


    })

    setCurrent(curr);


  }, [nutrient, method])




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
        methods={props.methods} 
        nutrients={props.nutrients}
        nutrient={nutrient}
        setNutrient={setNutrient} 
        method={method}
        setMethod={setMethod}
        {...props} />

      <NutriSelect
        methods={props.methods} 
        nutrients={props.nutrients}
        nutrient={nutrientTwo}
        setNutrient={setNutrientTwo} 
        method={method}
        setMethod={setMethod}
        {...props} />


      <p>Note: Consider Including Country Codes in Filename. This will allow all countries to be found</p>
      <p>{label}</p>

      <Map setLabel={setLabel} className="viz" nutrient={nutrient} nutrientTwo={nutrientTwo} current={current} range={range} />



    </>


  );
}

export default MapController;






