import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './Graph.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import AntSwitch from '@mui/material/AntSwitch';




function GraphController() {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);

  return (

    <>

     <FileSelect selected={selected} setSelected={setSelected} />

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Bipartite</Typography>
          <Switch id="bipSwitch" checked={bipartite} onChange={() => { setBipartite(!bipartite) }} name="bipartite" />
        <Typography>Force-Directed</Typography>
      </Stack>


      <Graph />

    </>


  );
}

export default GraphController;






