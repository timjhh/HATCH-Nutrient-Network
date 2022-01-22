import React, { useEffect, useState } from 'react';
import './App.css';
import Map from './Map.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Papa from 'papaparse';

import world from './DATA_INPUTS/Spatial_data_inputs/world.geo.json';

import * as d3 from "d3";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import AntSwitch from '@mui/material/AntSwitch';




function MapController() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  var csvFilePath = require('./Afghanistan_ImportsGlobalConstrained_2019.csv');
  // var world = require('/public/world.geo.json');
    var world = require('./DATA_INPUTS/Spatial_data_inputs/world.geo.json');
  // './DATA_INPUTS/Spatial_data_inputs/world.geo.json'

    // return new Promise(function(resolve, error) {
      
    //   Papa.parse(csvFilePath, {
    //     header: true,
    //     download: true,
    //     skipEmptyLines: true,
    //     dynamicTyping: true,
    //     complete: (res) => { resolve(res.data) }
    //   }); 

    // });



fetch(world)
  // .then(res => res.json()) // comment this out for now
  .then(res => res.text())          // convert to plain text
  .then(text => console.log(text))  // then log it out

    // JSON.parse(world).then(d => {
    //   console.log(d);
    // })

    // d3.json(world, function(d) {

    //   console.log(d);

    // });


  return (

    <>

      <FileSelect selected={selected} setSelected={setSelected} />



      <Map  />


    </>


  );
}

export default MapController;






