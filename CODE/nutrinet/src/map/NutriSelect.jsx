import React, { useEffect, useState } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


function NutriSelect(props) {


const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only."];



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
        value={props.selected}
        label="Nutrient"
        onChange={(e) => { props.setSelected(e.target.value) }}
      >
      {nutrients.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>


    </FormControl>
{/*    <FormControl sx={{ m:2 }}>

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

    </FormControl>*/}


</Box>
</Paper>

  );
}

export default NutriSelect;
