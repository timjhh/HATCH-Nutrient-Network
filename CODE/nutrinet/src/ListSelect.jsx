import React, {useState} from 'react';

import { Paper, Grid, Box, Select, MenuItem, InputLabel, FormControl, Chip, Button, Stack } from '@mui/material';

function ListSelect(props) {

    const handleChangeMultiple = (event) => {
        const {options} = event.target
        let val = [];
        for(let i=0;i<options.length;i++) {
            if(options[i].selected) val.push(options[i].value)
        }
        props.setData(val)
    }


    // Max amount of chips to show before displaying overflow chip
    const MAX_LABELS = 10

return (

    <>
            <Grid item sx={{ m: 1, maxWidth: 300 }}>
            <Stack spacing={2}>
            <FormControl>
                <InputLabel shrink htmlFor="select-multiple-native">
                   {props.label}
                </InputLabel>
                <Select
                multiple
                native
                value={props.data}
                onChange={handleChangeMultiple}
                label={props.label}
                inputProps={{
                    id: 'select-multiple-native',
                }}
                >
                {props.options.map((item) => (
                    <option key={item} value={item}>
                    {item}
                    </option>
                ))}
                </Select>
            </FormControl>
            
            <Stack direction="row" spacing={1} justifyContent="center">
                <Button variant="contained" onClick={() => props.setData(props.options)}>Select All</Button>
                <Button variant="contained" onClick={() => props.setData([])}>Clear All</Button>
            </Stack>

            <Stack direction="row" spacing={0.75} style={{display:"flex",flexWrap:"wrap"}}>
            {props.data.slice(0,MAX_LABELS).map(d => (
                <Chip key={d} label={d} />
            ))}
            {props.data.length > MAX_LABELS &&
            <Chip key={"more"} label={("And " + (props.data.length-MAX_LABELS) + " More...")} />}
            </Stack>
            </Stack>
            </Grid>
    
    </>

)
}

export default ListSelect;