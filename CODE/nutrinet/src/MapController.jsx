import React, { useEffect, useState } from 'react';
import './App.css';
import Map from './Map.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import AntSwitch from '@mui/material/AntSwitch';




function MapController() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  return (

    <>

     <FileSelect selected={selected} setSelected={setSelected} />



      <Map />


    </>


  );
}

export default MapController;






