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


const prom = new Promise((resolutionFunc, rejectionFunc) => {
  // call your async return values after succesfull response
  setTimeout(function () {
    resolutionFunc(<h1> Hello World </h1>);
  }, 5000);
});

function MapController() {

  const [selected, setSelected] = useState("Calories");
  const [bipartite, setBipartite] = useState(false);



    // d3.json('./DATA_INPUTS/Spatial_data_inputs/countries.geojson', function(d) {

    //   console.log(d);

    // });


  return (

    <>

      <NutriSelect selected={selected} setSelected={setSelected} />



      <Map selected={selected} />


    </>


  );
}

export default MapController;






