import React, { useEffect, useState } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


function NutriSelect(props) {




useEffect(() => {




}, [])








  function handleChange(e) {

    console.log(e.target)
    props.setSelected(e.target.value);

  }



  return (


<Paper sx={{ m: 2, p: 2, background: 'primary.main', elevation: 24 }}>

<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>



    <FormControl sx={{ m:2 }}>
      <InputLabel id="country-select-label">Nutrient</InputLabel>
      <Select
        labelId="mcountry-select-label"
        id="country-select"
        value={props.variable1}
        label="Nutrient"
        onChange={(e) => { props.setVariable1(e.target.value) }}
      >
      {props.nutrients.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>


    </FormControl>
    <FormControl sx={{ m:2 }}>
      <InputLabel id="country-select-label">Second Nutrient</InputLabel>
      <Select
        labelId="mcountry-select-label"
        id="country-select"
        value={props.variable2}
        label="Second Nutrient"
        onChange={(e) => { props.setVariable2(e.target.value) }}
      >
      {props.nutrients.map(d => (
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
{/*    <FormControl sx={{ m:2 }}>

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

    </FormControl>*/}


</Box>
</Paper>

  );
}

export default NutriSelect;
