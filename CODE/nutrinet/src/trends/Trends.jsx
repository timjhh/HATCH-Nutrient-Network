import React, {useState, useEffect} from 'react';

import { Paper, Box, Button, LinearProgress, Divider, Grid, Chip, Badge } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import VarSelect from './VarSelect';
import Chart from './Chart';



function Trends(props) {


    const [country, setCountry] = useState("Angola")
    const [year, setYear] = useState("2019")
    const [source, setSource] = useState("Production_kg")
    const [scaleType, setScaleType] = useState("Linear")
    const [variable, setVariable] = useState("Production")
    const [lines,setLines] = useState([])

    const variables = ["Hello","World"]

    const data = [
        [1980,1],
        [1981,2],
        [1982,3],
        [1983,1],
        [1984,20],
        [1985,32],
        [1986,15],
        [1987,21],
        [1988,35],
    ]

    // Same color scale as maps page
    const colors = ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8", "#dabdd4", "#bdbdd4", "#8ebdd4", "#5abdc8", "#cc92c1", "#bd92c1", "#8e92c1", "#5a92c1", "#be64ac", "#bd64ac", "#8e64ac", "#5a64ac"];


    function removeLine(item) {
        console.log(item)
        const idx = lines.indexOf(item)
        if(idx > -1) setLines(lines.splice(idx,1))
    }

    useEffect(() => {
        setLines(["Angola - Production - Calcium", "Angola - Imports - Calcium", "Cuba - Production - CropRichness"])
    }, [])

    return (

        <Grid container>


        <Grid item xs={12}>
            <Paper elevation={props.paperElevation} sx={{ my:2, p:2, background: 'primary.main'}}>
                <VarSelect
                year={year}
                setYear={setYear}
                country={country}
                setCountry={setCountry}
                source={source}
                setSource={setSource}
                scaleType={scaleType}
                setScaleType={setScaleType}
                variable={variable}
                setVariable={setVariable}
                variables={variables}
                lines={lines}
                setLines={setLines}
                {...props}
                />
            </Paper>
        </Grid>

        
        <Grid item xs={12}>
            <Paper elevation={props.paperElevation} sx={{ my:2, p:2, background: 'primary.main'}}>

                <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start">
                {lines.map((d,idx) => (
                    <Box alignItems="center" display="flex" key={"chip"+idx}>
                        <ClearIcon onClick={() => removeLine(d)} sx={{}} />
                        <Chip sx={{m:0.25, backgroundColor: colors[idx]}} key={d} label={d} />
                    </Box>
                ))}
                </Grid>
        
                <Chart 
                year={year}
                setYear={setYear}
                country={country}
                setCountry={setCountry}
                source={source}
                setSource={setSource}
                scaleType={scaleType}
                setScaleType={setScaleType}
                variable={variable}
                setVariable={setVariable}
                variables={variables}
                data={data}
                />
            </Paper>
        </Grid>

        <Paper elevation={props.paperElevation} sx={{ my:2, p:2, background: 'primary.main'}}>
            This page is under construction!
        </Paper>
        </Grid>

    );
}

export default Trends;