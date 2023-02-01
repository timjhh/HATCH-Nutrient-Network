import React, { useEffect, useState } from "react";
import Check from '@mui/icons-material/Check'
import {
  Grid,
  Typography,
  Stack,
  Switch,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Snackbar,
  Alert,
  Chip,
  LinearProgress,
  ListItemText,
  MenuList,
  Divider,
  ListItemIcon
} from "@mui/material";

function VarSelect(props) {
  const [snackBar, setSnackBar] = useState(null);
  const [open, setOpen] = useState(false);
  const MAX_LINES = 10;

  // Same color scale as maps page
  const colors = [
    "#e8e8e8",
    "#bddede",
    "#8ed4d4",
    "#5ac8c8",
    "#dabdd4",
    "#bdbdd4",
    "#8ebdd4",
    "#5abdc8",
    "#cc92c1",
    "#bd92c1",
    "#8e92c1",
    "#5a92c1",
    "#be64ac",
    "#bd64ac",
    "#8e64ac",
    "#5a64ac",
  ];

  function sanitize(text) {
    return text.split("_").join(" ");
  }

  function addLine(label) {

    if(!label) {
      label = props.country + " - " + props.source + " - " + props.variable;
      props.setPreset({label: "Custom"})
    }
    if (props.lines.find((d) => d.label === label)) {
      setSnackBar(label + " already in graph");
      setOpen(true);
    } else if (props.lines.length >= MAX_LINES) {
      setSnackBar("Cannot add more than " + MAX_LINES + " lines");
      setOpen(true);
    } else {
      // Return the first color we haven't used
      const clr = colors.find(
        (d) => !props.lines.map((e) => e.color).includes(d)
      );

      const lns = props.lines.concat({
        label: label,
        color: clr,
      });
      props.setLines(lns);
    }
  }
  const handleSBClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setSnackBar(null);
  };

  function removeLine(item) {
    props.setLines(props.lines.filter((d) => d.label !== item));
  }



  useEffect(() => {
    if(props.preset.label === "Custom") return;
    props.setLines([])
    let lns = []
    props.preset.data.forEach((ps,idx) => {
        const clr = colors[idx%MAX_LINES]
  
        lns.push({
          label: ps,
          color: clr,
        });
      });
    props.setLines(lns);
  }, [props.preset])

  return (
    <>
      {props.loaded ? (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 2fr)",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                labelId="mcountry-select-label"
                id="country-select"
                value={props.country}
                label="Variable One"
                onChange={(e) => {
                  props.setCountry(e.target.value);
                }}
              >
                {props.countries.map((d) => (
                  <MenuItem key={d} value={d}>
                    {sanitize(d)}
                  </MenuItem>
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
                onChange={(e) => {
                  props.setSource(e.target.value);
                }}
              >
                {props.sources.map((d) => (
                  <MenuItem key={d} value={d}>
                    {sanitize(d)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="variable-select-label">Variable</InputLabel>
              <Select
                labelId="variable-select-label"
                id="variable-select"
                value={props.variable}
                label="Variable One"
                onChange={(e) => {
                  props.setVariable(e.target.value);
                }}
              >
                {props.variables.map((d) => (
                  <MenuItem key={d} value={d}>
                    {sanitize(d)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <Button variant="contained" onClick={() => addLine()}>
                Add Line
              </Button>
              <Button
                sx={{ my: 1 }}
                variant="contained"
                onClick={() => props.setLines([])}
              >
                Clear All
              </Button>
            </FormControl>
            <Stack sx={{}} direction="row" spacing={1} alignItems="center">
              <Typography>Quantile</Typography>
              <Switch
                id="scaleVar1Switch"
                checked={props.scaleType !== "Quantile"}
                onChange={() => {
                  // props.scaleType1 === "Quantile" ? props.setScaleType1("Logarithm") : props.setScaleType1("Quantile");
                  // props.setHighlight(null);
                  // props.setSelected(null);
                }}
                name="scaleType1"
              />
              <Typography>Log</Typography>
            </Stack>
          </Box>

          <Grid
            container
            sx={{ gridTemplateColumns: "repeat(4, 2fr)" }}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            {props.lines.map((d, idx) => (
              <Grid item alignItems="center" display="flex" key={d.label + idx}>
                <Chip
                  sx={{ m: 0.25, backgroundColor: d.color, stroke: 1 }}
                  onClick={() => props.setSelected(d)}
                  onDelete={() => removeLine(d.label)}
                  key={d.label + idx}
                  label={d.label}
                />
              </Grid>
            ))}
          </Grid>

          <Grid
          container
          sx={{ gridTemplateColumns: "repeat(4, 2fr)" }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center">
          <MenuList dense>
          <Divider />
              {props.presets.map((d,idx) => (
                <MenuItem>
                  {d.label === props.preset.label &&
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                  }
                  <ListItemText onClick={(e) => props.setPreset(d)} inset>{d.label}</ListItemText>
                </MenuItem>
              ))}
          <Divider />
          </MenuList>
          </Grid>




          <Snackbar open={open} autoHideDuration={2000} onClose={handleSBClose}>
            <Alert
              onClose={handleSBClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {snackBar}
            </Alert>
          </Snackbar>
        </>
      ) : (
        <LinearProgress />
      )}
    </>
  );
}

export default VarSelect;
