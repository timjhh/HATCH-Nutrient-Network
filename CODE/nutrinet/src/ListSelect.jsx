import React from "react";

import {
  Grid,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Button,
  Stack,
  OutlinedInput,
} from "@mui/material";

function ListSelect(props) {
  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    let val = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) val.push(options[i].value);
    }
    props.setData(val);
  };

  // Max amount of chips to show before displaying overflow chip
  const MAX_LABELS = 10;

  return (
    <>
      <Grid item sx={{ m: 1, width: "30%" }}>
        <Stack spacing={2}>
          <FormControl>
            <InputLabel shrink htmlFor={"lS" + props.label}>
              {props.label}
            </InputLabel>
            <Select
              multiple
              native
              value={props.data}
              onChange={handleChangeMultiple}
              input={<OutlinedInput label="Input" />}
              label={props.label}
              id={"lS" + props.label}
            >
              {props.options.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => props.setData(props.options)}
            >
              Select All
            </Button>
            <Button variant="contained" onClick={() => props.setData([])}>
              Clear All
            </Button>
          </Stack>

          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            {props.data.slice(0, MAX_LABELS).map((d) => (
              <Chip sx={{ m: 0.25 }} key={d} label={d} />
            ))}
            {props.data.length > MAX_LABELS && (
              <Chip
                key={"more"}
                sx={{ m: 0.25 }}
                label={"And " + (props.data.length - MAX_LABELS) + " More..."}
              />
            )}
          </Grid>
        </Stack>
      </Grid>
    </>
  );
}

export default ListSelect;
