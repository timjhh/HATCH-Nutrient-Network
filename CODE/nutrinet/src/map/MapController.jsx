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
// import AntSwitch from '@mui/material/AntSwitch';


// const prom = new Promise((resolutionFunc, rejectionFunc) => {
//   // call your async return values after succesfull response
//   setTimeout(function () {
//     resolutionFunc(<h1> Hello World </h1>);
//   }, 5000);
// });



function MapController(props) {

  const [nutrient, setNutrient] = useState("Calories");
  const [current, setCurrent] = useState({});
  const [range, setRange] = useState([0,0]);

  useEffect(() => {


    let regex = new RegExp(`_${props.method}_`);

    var filtered = props.files.filter(d => d.match(regex));
    var curr = {};
    var max = Number.MAX_VALUE;
    var min = Number.MIN_VALUE;

    filtered.forEach(d => {



      d3.csv(`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+d).then(res => {
        

        let idx = res.columns.indexOf(nutrient); // Index of selected nutrient
        //let avg = res.reduce()
        
        let len = Object.entries(res).length;
        
        let sum = 0;
        // max = res[0][nutrient];
        // min = res[0][nutrient];



        res.forEach(val => {
          let num = val[nutrient]
          if(num != null && num != "NA") {
            
            sum += parseFloat(num);

          }
        })

        if(res[0]) {
          curr[res[0]["Country"]] = [sum, sum/len];
        }
        
        //console.log(res[0]["Country"] + " " + nutrient + " " + avg);


      });


    })

    setCurrent(curr);


  }, [nutrient, props.method])




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
        nutrient={nutrient}
        setNutrient={setNutrient} 
        nutrients={props.nutrients}
        {...props} />



      <Map nutrient={nutrient} current={current} range={range} />


    </>


  );
}

export default MapController;






