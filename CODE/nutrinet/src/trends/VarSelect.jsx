import React, {useState} from 'react';
import * as d3 from "d3";
import { Grid, Typography, Stack, Switch, Paper, Box, Select, MenuItem, InputLabel, FormControl, Button, Snackbar, Alert, Chip, LinearProgress } from '@mui/material';

function VarSelect(props) {

  const [snackBar, setSnackBar] = useState(null)
  const [open,setOpen] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const MAX_LINES = 10

  // Same color scale as maps page
  const colors = ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8", "#dabdd4", "#bdbdd4", "#8ebdd4", "#5abdc8", "#cc92c1", "#bd92c1", "#8e92c1", "#5a92c1", "#be64ac", "#bd64ac", "#8e64ac", "#5a64ac"];


  function sanitize(text) {
    return text.split("_").join(" ");
  }
  
  function addLine() {
    if(props.lines.find(d => d.label === (props.country+" - "+props.source+" - "+props.variable))) {
      setSnackBar(props.country+" - "+props.source+" - "+props.variable + " already in graph")
      setOpen(true)
    }
    else if(props.lines.length >= MAX_LINES) {
      setSnackBar("Cannot add more than "+MAX_LINES+" lines")
      setOpen(true)
    }
    else {
      // Return the first color we haven't used
      const clr = colors.find(d => !props.lines.map(e => e.color).includes(d))
      console.log(clr)
      const lns = props.lines.concat({
        label: props.country+" - "+props.source+" - "+props.variable,
        color: clr,
        data: []
      })
      props.setLines(lns)
    }
  }
  const handleSBClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setSnackBar(null)
  };

  function removeLine(item) {
    props.setLines(props.lines.filter(d => d.label !== item))
  }

  return (
          <>
          { props.loaded ?(
          <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 2fr)', alignItems: "center" }}>


            <FormControl sx={{ m: 2 }}>
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                labelId="mcountry-select-label"
                id="country-select"
                value={props.country}
                label="Variable One"
                onChange={(e) => { props.setCountry(e.target.value) }}
              >
                {props.countries.map(d => (
                  <MenuItem key={d} value={d}>{sanitize(d)}</MenuItem>
                ))}
              </Select>

            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="source-select-label">Source</InputLabel>
              <Select
                labelId="source-select-label"
                id="source-select"
                value={props.source}
                label="Source"
                onChange={(e) => { props.setSource(e.target.value) }}
              >
                {props.sources.map(d => (
                  <MenuItem key={d} value={d}>{sanitize(d)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="country-select-label">Variable</InputLabel>
              <Select
                labelId="mcountry-select-label"
                id="country-select"
                value={props.variable}
                label="Variable One"
                onChange={(e) => { props.setVariable(e.target.value) }}
              >
                {props.variables.map(d => (
                  <MenuItem key={d} value={d}>{sanitize(d)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m:2 }}>
              <Button variant="contained" onClick={() => addLine()}>Add Line</Button>
              <Button sx={{my:1}} variant="contained" onClick={() => props.setLines([])}>Clear All</Button>
            </FormControl>
            <Stack sx={{  }} direction="row" spacing={1} alignItems="center">
                <Typography>Quantile</Typography>
                <Switch id="scaleVar1Switch" checked={props.scaleType !== "Quantile"} onChange={() => { 
                  
                  // props.scaleType1 === "Quantile" ? props.setScaleType1("Logarithm") : props.setScaleType1("Quantile");
                  // props.setHighlight(null); 
                  // props.setSelected(null);
                  
                  }} name="scaleType1" />
                <Typography>Log</Typography>
             </Stack>

          </Box>

        <Grid
          container
          sx={{ gridTemplateColumns: 'repeat(4, 2fr)'}}
          direction="row"
          justifyContent="flex-start"
          alignItems="center">
          {props.lines.map((d,idx) => (
              <Grid item alignItems="center" display="flex" key={d.label+idx}>
                  <Chip sx={{m:0.25, backgroundColor: d.color, stroke: 1}} onClick={() => props.setSelected(d)} onDelete={() => removeLine(d.label)} key={d.label+idx} label={d.label} />
              </Grid>
          ))}
        </Grid>

        <Snackbar open={open} autoHideDuration={2000} onClose={handleSBClose}>
              <Alert onClose={handleSBClose} severity="error" sx={{ width: '100%' }}>
                {snackBar}
              </Alert>
        </Snackbar>
        </>
        ): <LinearProgress />}
        </>

  );
}

export default VarSelect;