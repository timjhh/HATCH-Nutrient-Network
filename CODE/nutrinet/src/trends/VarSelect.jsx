import React, {useState} from 'react';
import { Grid, Typography, Stack, Switch, Paper, Box, Select, MenuItem, InputLabel, FormControl, Button, Snackbar, Alert } from '@mui/material';

function VarSelect(props) {

  const [snackBar, setSnackBar] = useState(null)
  const [open,setOpen] = useState(false)

  function sanitize(text) {
    return text.split("_").join(" ");
  }
  
  function addLine() {

    if(props.lines.includes(props.country+" - "+props.variable+" - "+props.year)) {
      setSnackBar(props.country+" - "+props.variable+" - "+props.year)
      setOpen(true)
    } else {
      const lns = props.lines.concat(props.country+" - "+props.variable+" - "+props.year)
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

  return (



          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: "center" }}>

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
              {/* <Typography sx={{m:2, width:1}} style={{"font-size": "2em", "font-weight": "lighter"}}>Scaling</Typography> */}

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


             <Snackbar open={open} autoHideDuration={2000} onClose={handleSBClose}>
              <Alert onClose={handleSBClose} severity="error" sx={{ width: '100%' }}>
                {snackBar + " already in graph"}
              </Alert>
            </Snackbar>

          </Box>

  );
}

export default VarSelect;
