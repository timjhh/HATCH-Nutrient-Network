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



function importAll(r) {
  return r.keys();
}


var countries = [];
var years = [];
var methods = [];

useEffect(() => {




}, [])


const files = importAll(require.context('./DATA_INPUTS/Tabular_data_inputs', false, /\.(csv)$/));

files.forEach(d => {
  let arr = d.substring(2).split("_");
  arr[2] = arr[2].split(".")[0];
  if(!countries.includes(arr[0])) countries.push(arr[0]);
  if(!methods.includes(arr[1])) methods.push(arr[1]);
  if(!years.includes(arr[2])) years.push(arr[2]);
})




  const [country, setCountry] = useState(countries[0]);
  const [method, setMethod] = useState(methods[0]);
  const [year, setYear] = useState(years[0]);

  function handleChange() {
    let fileName = country+"_"+method+"_"+year+".csv";

    props.setSelected(fileName);
  }



  return (


<Paper sx={{ m: 2, p: 2, background: 'primary.main', elevation: 24 }}>

<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>



    <FormControl sx={{ m:2 }}>
      <InputLabel id="country-select-label">Country</InputLabel>
      <Select
        labelId="mcountry-select-label"
        id="country-select"
        value={country}
        label="Country"
        onChange={(e) => { handleChange(); setCountry(e.target.value) }}
      >
      {countries.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>


    </FormControl>
    <FormControl sx={{ m:2 }}>

      <InputLabel id="method-select-label">Method</InputLabel>
      <Select
        labelId="method-select-label"
        id="method-select"
        value={method}
        label="Method"
        onChange={(e) => { handleChange(); setMethod(e.target.value) }}
      >
      {methods.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>

    </FormControl>
    <FormControl sx={{ m:2 }}>

      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        id="year-select"
        value={year}
        label="Year"
        onChange={(e) => { handleChange(); setYear(e.target.value) }}
      >
      {years.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>

    </FormControl>


</Box>
</Paper>

  );
}

export default FileSelect;
