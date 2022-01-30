import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './Graph.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import GraphController from './GraphController.jsx'
import MapController from './map/MapController.jsx'
import DataController from './DataController.jsx'

import { Route, Routes, Router, Link, BrowserRouter } from 'react-router-dom';

function App() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  return (

    <div className="App">



    <Box sx={{p: 2}}>

      <Button sx={{mx: 2}} href="/" variant="outlined">Graphs</Button>    
      <Button sx={{mx: 2}} href="/maps" variant="outlined">Maps</Button>    
    
    </Box>


    <Grid container spacing={2}>
      <Grid item xs={2}>

      </Grid>
      <Grid item xs={8}>

    <DataController />
{/*    <Routes>
        <Route path='/maps' element={<MapController/>}/>
        <Route path='/graph' element={<GraphController/>}/>
    </Routes>*/}


      </Grid>

      <Grid item xs={2}>

      </Grid>
    </Grid>





    </div>
  );
}

export default App;
