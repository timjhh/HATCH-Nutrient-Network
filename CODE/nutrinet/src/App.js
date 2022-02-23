import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './graph/Graph.jsx';
import FileSelect from './graph/FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Navigation from './Navigation.jsx';
import GraphController from './graph/GraphController.jsx'
import MapController from './map/MapController.jsx'
import DataController from './DataController.jsx'

import { Route, Routes, Router, Link, BrowserRouter } from 'react-router-dom';

function App() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  return (

    <div className="App">


    <Navigation />




    <Grid container spacing={0}>
      <Grid item xs={1}>

      </Grid>
      <Grid item xs={10}>

        <DataController />

      </Grid>

      <Grid item xs={1}>

      </Grid>
    </Grid>





    </div>
  );
}

export default App;
