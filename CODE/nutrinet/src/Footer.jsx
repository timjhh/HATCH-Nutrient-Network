import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './graph/Graph.jsx';
import FileSelect from './graph/FileSelect.jsx';
import { Grid, Paper } from '@mui/material/';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import AntSwitch from '@mui/material/AntSwitch';
import { Route, Routes, Router, Link, BrowserRouter } from 'react-router-dom';

import GraphController from './graph/GraphController.jsx'
import MapController from './map/MapController.jsx'

function Footer() {



  return (



    <Grid container spacing={2} sx={{ mt:2, p:1, bgcolor: '#c5cae9', display: 'block', fontWeight: "lighter", display: "inline-flex", flexDirection: 'row', alignItems: 'center' }}>

    <Grid item xs={4} sx={{ display: 'inline-flex' }}>

        <Paper sx={{width: 1, p:1}} elevation={6}>
            <Typography variant={"p"}>
            This material is based upon work supported by the USDA Hatch Program(grant numbers VT-H02303 and VT-02709). Any opinions, findings, conclusions, or recommendations
            expressed in this publication are those of the author(s) and do not necessarily reflect the view of the U.S. Department of Agriculture. 

            For more information about this project, see our first paper <a href="https://www.nature.com/articles/s41467-021-25615-2" rel='noreferrer' target={"_blank"}>here</a>.
          </Typography>
        </Paper>
        
    </Grid>




    <Grid item xs={8} sx={{ p:2 }}>
  
      <Paper sx={{ width: 1, py:1 }} elevation={6} gutterBottom component="div">
          
        <Typography variant={"h5"} style={{"textAlign": "center"}}>About the Project</Typography>
        

      </Paper>


    </Grid>
      

      

  </Grid>



  );
}

export default Footer;





