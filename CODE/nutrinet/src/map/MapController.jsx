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

  useEffect(() => {


    let regex = new RegExp(`_${props.method}_`);


    var data = props.files.filter(d => d.match(regex));


  }, [nutrient, props.method])


  return (

    <>

      <NutriSelect
        methods={props.methods} 
        nutrient={nutrient}
        setNutrient={setNutrient} 
        nutrients={props.nutrients}
        {...props} />



      <Map nutrient={nutrient} />


    </>


  );
}

export default MapController;






