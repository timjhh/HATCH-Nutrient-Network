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
      <Grid item xs={1} lg={2}>

      </Grid>
      <Grid item xs={12} lg={8} justify='center' alignItems='center'>

        <DataController />

      </Grid>

      <Grid item xs={1} lg={2}>

      </Grid>
    </Grid>





    </div>
  );
}

export default App;
