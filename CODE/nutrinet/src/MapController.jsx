import React, { useEffect, useState } from 'react';
import './App.css';
import Map from './Map.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Papa from 'papaparse';


import world from './DATA_INPUTS/Spatial_data_inputs/worldgeo.json';
import countries from './DATA_INPUTS/Spatial_data_inputs/countries.geojson';

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

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  var worldData = {};

  var csvFilePath = require('./Afghanistan_ImportsGlobalConstrained_2019.csv');
  // var world = require('/public/world.geo.json');
  var world = require('./DATA_INPUTS/Spatial_data_inputs/worldgeo.json');


  var countries = require('./DATA_INPUTS/Spatial_data_inputs/countries.geojson');


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



// fetch(world)
//   // .then(res => res.json()) // comment this out for now
//   .then(res => res.text())          // convert to plain text
//   .then(text => console.log(text))  // then log it out

    // JSON.parse(world).then(d => {
    //   console.log(d);
    // })


fetch('./world.geo.json').then(response => {

          return response.json();
        }).then(data => {
          // Work with JSON data here
          worldData = data;

        }).catch(err => {
          // Do something for an error here
          console.log("Error Reading data " + err);
        });

    // d3.json('./DATA_INPUTS/Spatial_data_inputs/countries.geojson', function(d) {

    //   console.log(d);

    // });


  return (

    <>

      <FileSelect selected={selected} setSelected={setSelected} />



      <Map data={worldData} />


    </>


  );
}

export default MapController;






