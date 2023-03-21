import React, { useState } from "react";
import Check from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
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
  LinearProgress,
  ListItemText,
  MenuList,
  Divider,
  ListItemIcon,
  Paper,
  Chip,
  Tooltip
} from "@mui/material";

function VarSelect(props) {
  const [snackBar, setSnackBar] = useState(null);
  const [open, setOpen] = useState(false);
  const MAX_LINES = 10;
  
  function sanitize(text) {
    return text.split(/\_|\./).join(" ");
  }

  function addLine(label) {
    if (!label) {
      label = props.country + " - " + props.variable + " - " + props.source;
      props.setPreset({ label: "Custom" });
    }
    if (props.lines.find((d) => d.label === label)) {
      setSnackBar(label + " already in graph");
      setOpen(true);
    } else if (props.lines.length >= MAX_LINES) {
      setSnackBar("Cannot add more than " + MAX_LINES + " lines");
      setOpen(true);
    } else {
      // Return the first color we haven't used
      const clr = props.colors.find(
        (d) => !props.lines.map((e) => e.color).includes(d)
      );
      
      let v = label.split(" - ")[1]

      const displayLabel = sanitize(props.socioEconVars.includes(v) ? label.split(" - ", 2).join(" - ")
      : label)

      const lns = props.lines.concat({
        label: label,
        color: clr,
        displayLabel: displayLabel
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

  return (
    <>
      {props.loaded ? (
        <Grid mb={1} container spacing={2} sx={{ height: "70%" }}>
          <Grid item xs={9}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper
                  elevation={props.paperElevation}
                  sx={{ p: 2, background: "primary.main" }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      alignItems: "center",
                    }}
                  >
                    <FormControl sx={{ m: 2 }}>
                      <InputLabel id="country-select-label">Country</InputLabel>
                      <Select
                        labelId="mcountry-select-label"
                        aria-labelledby="country-select"
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
                      <InputLabel id="variable-select-label">
                        Variable
                      </InputLabel>
                      <Select
                        labelId="variable-select-label"
                        id="variable-select"
                        aria-labelledby="variable-select"
                        value={props.variable}
                        label="Variable"
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
                      
                      <InputLabel id="source-select-label">Source
                      {props.socioEconVars.includes(props.variable) &&
                      <Tooltip 
                          //sx={!props.socioEconVars.includes(props.variable) && {display:"none"}}
                          //sx={{px: 2}}
                          title={"This variable is not affected by source"}>
                        <InfoIcon sx={{fontSize: "inherit"}}/>
                        </Tooltip>  
                      }
                      </InputLabel>
                      <Select
                        labelId="source-select-label"
                        aria-labelledby="source-select"
                        id="source-select"
                        value={props.source}
                        disabled={props.socioEconVars.includes(props.variable)}
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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography><label htmlFor="scale-type-switch">Linear</label></Typography>
                      <label htmlFor="scale-type-switch" aria-label="scale-type-switch">
                      <Switch
                        id="scaleSwitch"
                        aria-labelledby="scale-type-switch"
                        checked={props.scaleType !== "Linear"}
                        onChange={() => {
                          props.setScaleType(
                            props.scaleType === "Linear" ? "Log" : "Linear"
                          );
                        }}
                        name="scaleTypeSwitch"
                      />
                      </label>
                      <Typography><label htmlFor="scale-type-switch">Log</label></Typography>
                    </Stack>

                    <FormControl sx={{ m: 2 }}>
                      <Button aria-labelledby="add-line-button" variant="contained" onClick={() => addLine()}>
                        Add Line
                      </Button>
                      <Button
                        sx={{ my: 1 }}
                        variant="contained"
                        aria-labelledby="clear-lines-button"
                        onClick={() => props.setLines([])}
                      >
                        Clear All
                      </Button>
                    </FormControl>
                  </Box>

                  <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleSBClose}
                  >
                    <Alert
                      onClose={handleSBClose}
                      severity="error"
                      sx={{ width: "100%" }}
                    >
                      {snackBar}
                    </Alert>
                  </Snackbar>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={props.paperElevation}>
                  <Grid
                    container
                    sx={{ gridTemplateColumns: "repeat(4, 2fr)", p: 2 }}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    {props.lines.map((d, idx) => (
                      <Grid
                        item
                        alignItems="center"
                        display="flex"
                        key={d.label + idx}
                      >
                        <Chip
                          sx={{ m: 0.25, backgroundColor: 'white', fontWeight:'bold',border:('0.5em solid '+d.color)}}
                          onClick={() => props.setSelected(d)}
                          onDelete={() => props.removeLine(d.label)}
                          key={d.label + idx}
                          label={d.displayLabel}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <Paper
              elevation={props.paperElevation}
              sx={{ p: 2, background: "primary.main" }}
            >
                <Typography variant={"h2"} sx={{ fontSize: "1.2em", my: 1, fontWeight:"bold" }}>
                  Highlights
                </Typography>
                <Divider />
              <MenuList>
                {props.presets.map((d, idx) => (
                  <MenuItem key={"preset" + idx} onClick={(e) => props.setPreset(d)}>
                    {d.label === props.preset.label && (
                      <ListItemIcon>
                        <Check />
                      </ListItemIcon>
                    )}
                    <ListItemText inset>
                      {d.label}
                    </ListItemText>
                  </MenuItem>
                ))}
                <Divider />
              </MenuList>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <LinearProgress id="varSelectLoadingBar" role="progressbar" aria-label="var-select-loading-bar" aria-labelledby="var-select-loading-bar" />
      )}
    </>
  );
}

export default VarSelect;
