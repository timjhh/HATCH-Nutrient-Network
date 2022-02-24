import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';  
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function NutriSelect(props) {


  return (


<Paper sx={{ m: 2, p: 2, background: 'primary.main', elevation: 24 }}>

<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>

    


    <FormControl sx={{ m:2 }}>
      <InputLabel id="country-select-label">First Variable</InputLabel>
      <Select
        labelId="mcountry-select-label"
        id="country-select"
        value={props.variable1}
        label="Variable One"
        onChange={(e) => { props.setVariable1(e.target.value) }}
      >
      {props.variables.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>
      {/* <Typography sx={{m:2, width:1}} style={{"font-size": "2em", "font-weight": "lighter"}}>Scaling</Typography> */}
      <Stack sx={{ m:2, width: 1 }} direction="row" spacing={1} alignItems="center">
          <Typography>Quantile</Typography>
            <Switch id="scaleVar1Switch" checked={props.scaleType1 !== "Quantile"} onChange={() => { props.scaleType1 === "Quantile" ? props.setScaleType1("Logarithm") : props.setScaleType1("Quantile") }} name="scaleType1" />
          <Typography>Log</Typography>
      </Stack>
    </FormControl>


    <FormControl sx={{ m:2 }}>
      <InputLabel id="country-select-label">Second Variable</InputLabel>
      <Select
        labelId="mcountry-select-label"
        id="country-select"
        value={props.variable2}
        label="Variable Two"
        onChange={(e) => { props.setVariable2(e.target.value) }}
      >
      {props.variables.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>
      <Stack sx={{ m:2, width: 1 }} direction="row" spacing={1} alignItems="center">
          <Typography>Quantile</Typography>
            <Switch id="scaleVar2Switch" checked={props.scaleType2 !== "Quantile"} onChange={() => { props.scaleType2 === "Quantile" ? props.setScaleType2("Logarithm") : props.setScaleType2("Quantile") }} name="scaleType2" />
          <Typography>Log</Typography>
      </Stack>
    </FormControl>

 

    <FormControl sx={{ m:2 }}>

      <InputLabel id="method-select-label">Method</InputLabel>
      <Select
        labelId="method-select-label"
        id="method-select"
        value={props.source}
        label="Method"
        onChange={(e) => { props.setSource(e.target.value) }}
      >
      {props.sources.map(d => (
        <MenuItem key={d} value={d}>{d}</MenuItem>
        ))}
      </Select>

    </FormControl>

    <FormControl sx={{ml: 3, border:1}}>

    <Typography sx={{ ml:3, width: 1, mt: 1 }}>Scatterplot X Scale</Typography>
    <Stack sx={{ ml:2, my: 2, width: 1 }} direction="row" spacing={1} alignItems="center">
          <Typography>Linear</Typography>
            <Switch id="scatterX" checked={props.scatterX === "Log"} onChange={() => { props.scatterX === "Log" ? props.setScatterX("Linear") : props.setScatterX("Log") }} name="scatterX" />
          <Typography>Log</Typography>
    </Stack>

    <Typography sx={{ ml:3, width: 1 }}>Scatterplot Y Scale</Typography>
    <Stack sx={{ ml:2, my: 2, width: 1 }} direction="row" spacing={1} alignItems="center">
          <Typography>Linear</Typography>
            <Switch id="scatterY" checked={props.scatterY === "Log"} onChange={() => { props.scatterY === "Log" ? props.setScatterY("Linear") : props.setScatterY("Log") }} name="scatterY" />
          <Typography>Log</Typography>
    </Stack>
    
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
