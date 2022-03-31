import React, { useEffect, useState } from 'react';
import './App.css';

import Grid from '@mui/material/Grid';

import Navigation from './Navigation.jsx';
import DataController from './DataController.jsx'


function App() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  return (

    <div className="App">


    <Navigation />




    <Grid container spacing={0}>
      <Grid item xs={1} xl={2}>

      </Grid>
      <Grid item xs={10} xl={8} justify='center' alignItems='center'>
        Hello World
        <DataController />

      </Grid>

      <Grid item xs={1} xl={2}>

      </Grid>
    </Grid>





    </div>
  );
}

export default App;
