import React from 'react';
import { Grid, Typography, Stack, Switch, Paper, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function NutriSelect(props) {

  function sanitize(text) {
    return text.split("_").join(" ");
  }

  return (

    <Grid container spacing={1}>



      <Grid item xs={12}>


        <Paper sx={{ background: 'primary.main' }} elevation={props.paperElevation}>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>




            <FormControl sx={{ m: 2 }}>
              <InputLabel id="country-select-label">First Variable</InputLabel>
              <Select
                labelId="mcountry-select-label"
                id="country-select"
                value={props.variable1}
                label="Variable One"
                onChange={(e) => { props.setVariable1(e.target.value) }}
              >
                {props.variables.map(d => (
                  <MenuItem key={d} value={d}>{sanitize(d)}</MenuItem>
                ))}
              </Select>
              {/* <Typography sx={{m:2, width:1}} style={{"font-size": "2em", "font-weight": "lighter"}}>Scaling</Typography> */}

            </FormControl>
            <Stack sx={{  }} direction="row" spacing={1} alignItems="center">
                <Typography>Quantile</Typography>
                <Switch id="scaleVar1Switch" checked={props.scaleType1 !== "Quantile"} onChange={() => { 
                  
                  props.scaleType1 === "Quantile" ? props.setScaleType1("Logarithm") : props.setScaleType1("Quantile");
                  props.setHighlight(null); 
                  props.setSelected(null);
                  
                  }} name="scaleType1" />
                <Typography>Log</Typography>
             </Stack>

            <FormControl sx={{ m: 2 }}>
              <InputLabel id="country-select-label">Second Variable</InputLabel>
              <Select
                labelId="mcountry-select-label"
                id="country-select"
                value={props.variable2}
                label="Variable Two"
                onChange={(e) => { props.setVariable2(e.target.value) }}
              >
                {props.variables.map(d => (
                  <MenuItem key={d} value={d}>{sanitize(d)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack sx={{  }} direction="row" spacing={1} alignItems="center">
                <Typography>Quantile</Typography>
                <Switch id="scaleVar2Switch" checked={props.scaleType2 !== "Quantile"} onChange={() => {
                  props.scaleType2 === "Quantile" ? props.setScaleType2("Logarithm") : props.setScaleType2("Quantile") 
                  props.setHighlight(null);
                  props.setSelected(null);
                }} 
                name="scaleType2" />
                <Typography>Log</Typography>
            </Stack>


            <FormControl sx={{ m: 2 }}>

              <InputLabel id="method-select-label">Method</InputLabel>
              <Select
                labelId="method-select-label"
                id="method-select"
                value={props.source}
                label="Method"
                onChange={(e) => { props.setSource(e.target.value) }}
              >
                {props.sources.map(d => (
                  <MenuItem key={d} value={d}>{sanitize(d)}</MenuItem>
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

      </Grid>


    </Grid>

  );
}

export default NutriSelect;
