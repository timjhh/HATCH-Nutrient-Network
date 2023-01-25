import React, {useState, useEffect} from 'react';

import { Paper, Box, Button, LinearProgress, Divider } from '@mui/material';

import Typography from '@mui/material/Typography';
import { CSVLink } from "react-csv";
import ListSelect from 'ListSelect';


function DataDownloader(props) {

    const [countriesDL, setCountriesDL] = useState([])
    const [yearsDL, setYearsDL] = useState([])
    const [sourcesDL, setSourcesDL] = useState([])
    const [canDownload, setCanDownload] = useState(false)

    const [dlData, setDLData] = useState([])

    useEffect(() => {
        setCanDownload(!(yearsDL.length > 0 && countriesDL.length > 0 && sourcesDL.length > 0))
    }, [countriesDL, yearsDL, sourcesDL])

    function downloadData() {
 
        // Filter for selected years, countries and sources of data
        let dl = props.data.filter(d => 
            (yearsDL.length > 0 && yearsDL.includes(d.Year.toString())) &&
            (countriesDL.length > 0 && countriesDL.includes(d.Country)) &&
            (sourcesDL.length > 0 && sourcesDL.includes(d.Source))
        )
        
        setDLData(dl)
    }


    return (

        <Paper elevation={props.paperElevation} sx={{ my:2, p:2, background: 'primary.main'}}>

        {props.loaded ?
        <>
        <Typography mb={2} variant={"h4"} sx={{"textAlign": "center"}}>Download This Data</Typography>

        <Box sx={{ width: 1, display:"flex", flexWrap:"wrap", justifyContent:"space-between" }}>



            <ListSelect
            label={"Countries"}
            data={countriesDL}
            setData={setCountriesDL}
            options={props.countries}
            />

            <Divider orientation="vertical" flexItem />

            <ListSelect
            label={"Years"}
            data={yearsDL}
            setData={setYearsDL}
            options={props.years}
            />

            <Divider orientation="vertical" flexItem />

            <ListSelect
            label={"Sources"}
            data={sourcesDL}
            setData={setSourcesDL}
            options={props.methods}
            />
        </Box>
        <Button disabled={canDownload} variant="contained">
            <CSVLink style={{ textDecoration: 'none', color: "white" }} asyncOnClick={true} onClick={downloadData} filename={"nutrinet-custom-data.csv"} data={dlData}>
               {
                !canDownload ?
                "Download Data"
                : "Select Data to Download"
               }
            </CSVLink>
        </Button>
        </>
        :   <LinearProgress/>}
        </Paper>

    );
}

export default DataDownloader