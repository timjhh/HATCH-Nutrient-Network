import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './Graph.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Navigation from './Navigation.jsx';
import GraphController from './GraphController.jsx'
import MapController from './map/MapController.jsx'
import DataController from './DataController.jsx'

import { Route, Routes, Router, Link, BrowserRouter } from 'react-router-dom';

function App() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  return (

    <div className="App">


    <Navigation />




    <Grid container spacing={2}>
      <Grid item xs={2}>

      </Grid>
      <Grid item xs={8}>

    <DataController />



      </Grid>

      <Grid item xs={2}>

      </Grid>
    </Grid>





    </div>
  );
}

export default App;
