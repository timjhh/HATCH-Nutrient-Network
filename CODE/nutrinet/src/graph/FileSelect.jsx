import React from "react";

import {Grid, Typography, Stack, Switch, FormControl, InputLabel, MenuItem, Select, Paper, Autocomplete, TextField} from "@mui/material"

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
              aria-labelledby="country-select"
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
              id="variable-select"
              aria-labelledby={"variable select"}
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
              aria-labelledby="source-select"
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
              aria-labelledby="year-select"
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
            aria-labelledby="bipartite-select"
            sx={{ width: 1 }}
            direction="row"
            alignItems="center"
            justifyContent={"center"}
          >
            <label htmlFor="bipartite-select">Railway</label>
            <Switch
              id="bipSwitch"
              checked={props.bipartite}
              onChange={() => {
                props.setBipartite(!props.bipartite);
              }}
              name="bipartite"
            />
            <label htmlFor="bipartite-select">Force-Directed</label>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ textAlign: "center", width: 1 }}>
          <label htmlFor="thresholded-selector">
            Thresholded?
          </label>
          </Typography>
          <Stack
            sx={{ width: 1 }}
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={"center"}
          >
            <label htmlFor="thresholded-selector">N</label>
            <Switch
              for="threshold"
              id="thrSwitch"
              checked={props.threshold}
              onChange={() => {
                props.setThreshold(!props.threshold);
              }}
              name="threshold"
            />
            <label htmlFor="thresholded-selector">Y</label>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FileSelect;
