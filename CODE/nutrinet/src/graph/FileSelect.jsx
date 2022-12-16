import React from 'react';

import Button from "@mui/material/Button"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'

function FileSelect(props) {


  return (


<Paper elevation={props.paperElevation} sx={{ p:2, background: 'primary.main', height: '100%'}}>

<Box sx={{ width: 1 }}>


    <Grid item>
    <FormControl sx={{ my:2, width: 1 }}>
      <InputLabel id="country-select-label">Country</InputLabel>
      <Select
        labelId="mcountry-select-label"
        id="country-select"
        value={props.country}
        label="Country"
        onChange={(e) => { props.setCountry(e.target.value) }}
      >
      {props.countries.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>


    </FormControl>
    </Grid>
    <Grid item>
    <FormControl sx={{ my: 2, width: 1 }}>

      <InputLabel id="method-select-label">Method</InputLabel>
      <Select
        labelId="method-select-label"
        id="method-select"
        value={props.method}
        label="Method"
        onChange={(e) => { props.setMethod(e.target.value) }}
      >
      {props.methods.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>

    </FormControl>
    </Grid>
    <Grid item>
    <FormControl sx={{ my: 2, width: 1 }}>

      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        id="year-select"
        value={props.year}
        label="Year"
        onChange={(e) => { props.setYear(e.target.value) }}
      >
      {props.years.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>

    </FormControl>
    </Grid>
    <Grid item>
    <FormControl sx={{ width: 1 }}>

    <Autocomplete
      disablePortal
      id="highlight_nodes"
      options={props.highlightOptions}
      value={props.highlighted}
      groupBy={(option) => props.nutrients.includes(option) ? "Nutrients" : "Crops"}
      onChange={(d,e) => props.setHighlighted(e)}
      sx={{ m:2 }}
      renderInput={(params) => <TextField {...params} label="Highlight" />}
    />
    </FormControl>
    </Grid>


    
    <Grid item>
      <Stack sx={{ width: 1 }} direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
          <Typography>Railway</Typography>
            <Switch id="bipSwitch" checked={props.bipartite} disabled={props.monopartite} onChange={() => { props.setBipartite(!props.bipartite) }} name="bipartite" />
          <Typography>Force-Directed</Typography>
      </Stack>
    </Grid>

    <Grid item>
      <Typography sx={{textAlign: "center", width:1}}>Thresholded?</Typography>
      <Stack sx={{ width: 1 }} direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
          <Typography>N</Typography>
            <Switch id="thrSwitch" checked={props.threshold} onChange={() => { props.setThreshold(!props.threshold) }} name="threshold" />
          <Typography>Y</Typography>
      </Stack>
    </Grid>

    <a href="./DATA_INPUTS/Nutri_2019.csv" download><Button variant="contained">Download This Data(test)</Button></a>


</Box>
</Paper>

  );
}

export default FileSelect;
