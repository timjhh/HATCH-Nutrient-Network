import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import Button from "@mui/material/Button"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'



function DataDownloader(props) {
  
    const [country, setCountry] = useState("Algeria")
    const [year, setYear] = useState("2019")
    const [source, setSource] = useState("Import_kg")

    return (

        <Paper elevation={props.paperElevation} sx={{ my:2, p:2, background: 'primary.main'}}>

        <Box sx={{ width: 1 }}>

            <Typography mb={2} variant={"h4"} sx={{"textAlign": "center"}}>Download This Data</Typography>

            <Grid item>
            <FormControl sx={{ my:2, width: 1 }}>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
                labelId="mcountry-select-label"
                id="country-select"
                value={country}
                label="Country"
                onChange={(e) => { setCountry(e.target.value) }}
            >
            {props.countries.map(d => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
            </Select>


            </FormControl>
            </Grid>
            <Grid item>
            <FormControl sx={{ my: 2, width: 1 }}>

            <InputLabel id="method-select-label">Source</InputLabel>
            <Select
                labelId="method-select-label"
                id="method-select"
                value={source}
                label="Method"
                onChange={(e) => { setSource(e.target.value) }}
            >
            {props.methods.map(d => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
            </Select>

            </FormControl>
            </Grid>
            <Grid item>
            <FormControl sx={{ my: 2, width: 1 }}>

            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
                labelId="year-select-label"
                id="year-select"
                value={year}
                label="Year"
                onChange={(e) => { setYear(e.target.value) }}
            >
            {props.years.map(d => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
            </Select>

            </FormControl>
            </Grid>
            {/* <Grid item>
            <FormControl sx={{ width: 1 }}>

            <Autocomplete
            disablePortal
            id="highlight_nodes"
            options={props.highlightOptions}
            value={props.highlighted}
            groupBy={(option) => props.nutrients.includes(option) ? "Nutrients" : "Crops"}
            onChange={(d,e) => props.setHighlighted(e)}
            sx={{ m:2 }}
            renderInput={(params) => <TextField {...params} label="Highlight" />}
            />
            </FormControl>
            </Grid> */}



            {/* <Grid item>
            <Typography sx={{textAlign: "center", width:1}}>Thresholded?</Typography>
            <Stack sx={{ width: 1 }} direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                <Typography>N</Typography>
                    <Switch id="thrSwitch" checked={props.threshold} onChange={() => { props.setThreshold(!props.threshold) }} name="threshold" />
                <Typography>Y</Typography>
            </Stack>
            </Grid> */}

            <a href="./DATA_INPUTS/Nutri_2019.csv" download><Button variant="contained">Download This Data(test)</Button></a>
            <br/>
            <br/>
            <Link to="./DATA_INPUTS/Nutri_2019.csv" download target="_self"><Button variant="contained">Download alt This Data(test)</Button></Link>


        </Box>
        </Paper>

    );
}

export default DataDownloader