import React from "react";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";


function sanitize(text) {
  return text.split(/\_|\./).join(" ");
}

function FileSelect(props) {
  return (
    <Paper
      elevation={props.paperElevation}
      sx={{ p: 2, background: "primary.main", height: "100%" }}
    >
      <Grid container spacing={1}
       sx={{ width: 1 }}
       alignItems="center"
       justifyContent="center">
        <Grid item xs={12}>
          <FormControl sx={{ mt: 2, width: 1 }}>
            <Autocomplete
              disablePortal
              id="country-select"
              options={props.countries}
              value={props.country}
              onChange={(d, e) => {
                if (e !== null) props.setCountry(e);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Country" />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ width: 1, mt:2 }}>
            <Autocomplete
              disablePortal
              id="highlight_nodes"
              options={props.highlightOptions}
              value={props.highlighted}
              groupBy={(option) =>
                props.nutrients.includes(option) ? "Nutrients" : "Crops"
              }
              onChange={(d, e) => props.setHighlighted(e)}
              renderInput={(params) => (
                <TextField {...params} label="Variable" />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ width: 1, mt: 2 }}>
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
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ width: 1 }}>
            <Autocomplete
              disablePortal
              id="year-select"
              options={props.years}
              value={props.year}
              freeSolo
              onChange={(d, e) => {
                if (e !== null) {
                  props.setYear(e);
                }
              }}
              sx={{ mt: 2 }}
              renderInput={(params) => <TextField {...params} label="Year" />}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Stack
            sx={{ width: 1 }}
            direction="row"
            alignItems="center"
            justifyContent={"center"}
          >
            <Typography>Railway</Typography>
            <Switch
              id="bipSwitch"
              checked={props.bipartite}
              onChange={() => {
                props.setBipartite(!props.bipartite);
              }}
              name="bipartite"
            />
            <Typography>Force-Directed</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ textAlign: "center", width: 1 }}>
            Thresholded?
          </Typography>
          <Stack
            sx={{ width: 1 }}
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={"center"}
          >
            <Typography>N</Typography>
            <Switch
              id="thrSwitch"
              checked={props.threshold}
              onChange={() => {
                props.setThreshold(!props.threshold);
              }}
              name="threshold"
            />
            <Typography>Y</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FileSelect;
