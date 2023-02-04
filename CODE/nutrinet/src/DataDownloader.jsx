import React, {useState, useEffect, useRef} from 'react';

import { Paper, Box, Button, LinearProgress, Divider } from '@mui/material';
import { ref, equalTo, query, orderByChild, get } from "firebase/database";

import Typography from '@mui/material/Typography';
import { CSVLink } from "react-csv";
import ListSelect from 'ListSelect';


function DataDownloader(props) {

    const [countriesDL, setCountriesDL] = useState([])
    const [yearsDL, setYearsDL] = useState([])
    const [sourcesDL, setSourcesDL] = useState([])
    const [canDownload, setCanDownload] = useState(false)

    const [dlData, setDLData] = useState([])

    const csvLink = React.createRef()

    useEffect(() => {
        setCanDownload(!(yearsDL.length > 0 && countriesDL.length > 0 && sourcesDL.length > 0))
    }, [countriesDL, yearsDL, sourcesDL])

    useEffect(() => {
        if(dlData.length > 0) {
            csvLink.current.link.click()
        }
    }, [dlData])

    // Queries firebase for data to be downloaded by iterating through countries, filtering returned data by year,
    // then by source requested
    function downloadData() {

        if(!props.database) return;

        Promise.all(countriesDL
            .map(country => {
                return fetchDataByCountry(country)
            })).then((data) => {
                console.log(data.flat())
                if(data.length > 0) {
                    setDLData(data.flat())
                } else {
                    props.setSnackBar("Warning: 0 Records Found for Request")
                }

            // .map(async (country) => {
            //     console.log(fetchDataByCountry(country))
            //     return fetchDataByCountry(country)
            // })).then((data) => {
            // console.log(data)
            // if(data.length > 0) {
            //     setDLData(data)
            // } else {
            //     props.setSnackBar("Warning: 0 Records Found for Request")
            // }
        })

        // Filter for selected years, countries and sources of data
        // let dl = data.filter(d => 
        //     (yearsDL.length > 0 && yearsDL.includes(d.Year.toString())) &&
        //     (countriesDL.length > 0 && countriesDL.includes(d.Country)) &&
        //     (sourcesDL.length > 0 && sourcesDL.includes(d.Source))
        // )

        
    }

    async function fetchDataByCountry(country) {

            const rf = query(ref(props.database, '/'), orderByChild('Country'), equalTo(country));
            return get(rf).then(snapshot => {

                    return Object.values(snapshot.val()).filter(e => 
                    (yearsDL.length > 0 && yearsDL.includes(String(e.Year))) &&
                    (sourcesDL.length > 0 && sourcesDL.includes(e.Source))
                    )
                    
            }).catch(e => {
            console.log(e)
            props.setSnackBar("Error: Database Call Failed")
            return [];
            })

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
            options={props.sources}
            />
        </Box>
        <Button disabled={canDownload} variant="contained" onClick={downloadData}>
            {
            !canDownload ?
            "Download Data"
            : "Select Data to Download"
            }
        </Button>
        <CSVLink ref={csvLink} style={{ display: 'none' }} asyncOnClick={true} filename={"nutrinet-custom-data.csv"} data={dlData}/>   
        
        </>
        :   <LinearProgress/>}
        </Paper>

    );
}

export default DataDownloader