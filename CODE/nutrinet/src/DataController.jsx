import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './graph/Graph.jsx';
import FileSelect from './graph/FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import AntSwitch from '@mui/material/AntSwitch';
import { Route, Routes, Router, Link, BrowserRouter } from 'react-router-dom';

import GraphController from './graph/GraphController.jsx'
import MapController from './map/MapController.jsx'

function DataController() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);


  var countries = [];
  var years = [];
  var methods = [];

  function importAll(r) {
    return r.keys();
  }



const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only."];



  //const files = importAll(require.context(`${process.env.PUBLIC_URL}`+'./DATA_INPUTS_T/Tabular_data_inputs', false, /\.(csv)$/));
  // Old regex /\.(csv)$/
  const files = importAll(require.context('./DATA_INPUTS/Tabular_data_inputs', false, /^((?!.*DATA_INPUTS).)*\.(csv)$/));

  
  files.forEach(d => {
    let arr = d.substring(2).split("_");
    arr[2] = arr[2].split(".")[0];
    //console.log(arr);
    if(!countries.includes(arr[0])) countries.push(arr[0]);
    if(!methods.includes(arr[1])) methods.push(arr[1]);
    if(!years.includes(arr[2])) years.push(arr[2]);
  })

  return (

    <>

    <Routes>
        <Route path='/'
         element={<GraphController
         files={files} selected={selected} setSelected={setSelected}
         // country={country} setCountry={setCountry}
         // method={method} setMethod={setMethod}
         // year={year} setYear={setYear}
         countries={countries} methods={methods} years={years}/>}/>

        <Route path='/maps'
          element={<MapController
          files={files}
          nutrients={nutrients}
          selected={selected} setSelected={setSelected}
          // country={country} setCountry={setCountry}
          // method={method} setMethod={setMethod}
          // year={year} setYear={setYear}
          countries={countries} methods={methods} years={years}/>}/>

    </Routes>


    </>


  );
}

export default DataController;






