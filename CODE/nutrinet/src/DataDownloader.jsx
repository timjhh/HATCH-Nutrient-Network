import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import { Paper, Box, Select, MenuItem, InputLabel, FormControl, Chip, Button, Stack, LinearProgress } from '@mui/material';

import Typography from '@mui/material/Typography';
import { CSVLink, CSVDownload } from "react-csv";
import ListSelect from 'ListSelect';


function DataDownloader(props) {

    const [countriesDL, setCountriesDL] = useState([])
    const [yearsDL, setYearsDL] = useState([])
    const [sourcesDL, setSourcesDL] = useState([])

    function downloadData() {
        console.log(yearsDL)
        console.log(countriesDL)
        console.log(sourcesDL)
        let dl = props.data.filter(d => 
            (yearsDL.length > 0 && yearsDL.includes(d.Year.toString())) &&
            (countriesDL.length > 0 && countriesDL.includes(d.Country)) &&
            (sourcesDL.length > 0 && sourcesDL.includes(d.Source))
        )

        console.log(dl)
    }


    return (

        <Paper elevation={props.paperElevation} sx={{ my:2, p:2, background: 'primary.main'}}>

        {props.loaded ?
        <>
        <Typography mb={2} variant={"h4"} sx={{"textAlign": "center"}}>Download This Data</Typography>
        <Button variant="contained" onClick={downloadData}>Download</Button>
        {/* <CSVLink asyncOnClick={true} onClick={downloadData} filename={"nutrinet-custom-data.csv"} data={props.data}>
            Download me
        </CSVLink> */}

        <Box sx={{ width: 1, display:"flex", flexWrap:"wrap", justifyContent:"center" }}>



            <ListSelect
            label={"Countries"}
            data={countriesDL}
            setData={setCountriesDL}
            options={props.countries}
            />

            <ListSelect
            label={"Years"}
            data={yearsDL}
            setData={setYearsDL}
            options={props.years}
            />

            <ListSelect
            label={"Sources"}
            data={sourcesDL}
            setData={setSourcesDL}
            options={props.methods}
            />
        </Box>
        </>
        :<LinearProgress/>}
        </Paper>

    );
}

export default DataDownloader