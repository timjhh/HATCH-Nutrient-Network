import React, { useState } from 'react';
import './App.css';

import Grid from '@mui/material/Grid';

import Navigation from './Navigation.jsx';
import DataController from './DataController.jsx'
import Footer from 'Footer';

function App() {
  
  return (

    <div className="App">


    <Navigation />




    <Grid container spacing={0}>
      <Grid item xs={1} xl={2}>

      </Grid>
      <Grid item xs={10} xl={8} justify='center' alignItems='center'>

        <DataController />

      </Grid>

      <Grid item xs={1} xl={2}>

      </Grid>
    </Grid>

    <Footer/>




    </div>
  );
}

export default App;
