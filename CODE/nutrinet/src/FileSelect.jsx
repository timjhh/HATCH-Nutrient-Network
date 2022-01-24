import React, { useEffect, useState } from 'react';
import Graph from './Graph.jsx'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import * as fs from 'fs';

function FileSelect(props) {


  return (


<Paper sx={{ m: 2, p: 2, background: 'primary.main', elevation: 24 }}>

<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>



    <FormControl sx={{ m:2 }}>
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
    <FormControl sx={{ m:2 }}>

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
    <FormControl sx={{ m:2 }}>

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


</Box>
</Paper>

  );
}

export default FileSelect;
