import React, {useState, useEffect} from 'react';

import { Paper, Grid, Typography } from '@mui/material';
import VarSelect from './VarSelect';
import * as d3 from "d3";
import Chart from './Chart';



function Trends(props) {

    /*
        Presets for trendline collections
    */
    const preset1  = [
        {label: "Angola - Production_kg - Calcium", color: "#e8e8e8", data: []},
        {label: "Angola - Imports_kg - Calcium", color: "#bddede", data: []},
        {label: "Cuba - Production_kg - CropRichness", color: "#8ed4d4", data: []},
    ]

    const [country, setCountry] = useState("Angola")
    const [year, setYear] = useState("2019")
    const [source, setSource] = useState("Production_kg")
    const [scaleType, setScaleType] = useState("Linear")
    const [variable, setVariable] = useState("Production")
    const [selected, setSelected] = useState(null)
    const [lines,setLines] = useState(preset1)
    const [lineData, setLineData] = useState([])

    const variables = ["Hello","World"]

    const data = [
        [new Date(1980),1],
        [new Date(1981),2],
        [new Date(1982),3],
        [new Date(1983),1],
        [new Date(1984),20],
        [new Date(1985),32],
        [new Date(1986),15],
        [new Date(1987),21],
        [new Date(1988),35],
    ]

    useEffect(() => {
        if(props.data.length > 0) {
            updateLineData()
        }
        
    }, [lines, props.data])


    function updateLineData() {
        if(props.data.length > 0) {
            var dt = []
            var lns = lines
            lns.forEach((d,idx) => {
                //if(lns[idx].length === 0) { // Only update data if necessary
                    let vars = d.label.split(" - ")
                    let ctry = vars[0]
                    let src = vars[1]
                    let vr = vars[2]
                 
                    //let datum = props.data.filter(e => e.Country === ctry && e.Source === src).map(e => [parseInt(e.Year), parseFloat(e.Folate)])
                    
                    // Filter for country, source selected, count crop richness then sort by year
                    // TODO add variable filtering
                    let datum = d3
                    .rollups(props.data.filter(e => e.Country === ctry && e.Source === src), v => v.length, d => parseInt(d.Year))
                    .sort((a,b) => a[0]-b[0])
                    .map(e => [{year: e[0], value: e[1], label: d.label}])
                    //.map(e => [{label: d.label, year: d.Year, val: e}])
                    console.log(datum)
                    lns[idx] = datum
                    dt = dt.concat(datum)
                //}
            })
            console.log(dt)
            
            // lns.forEach((d,idx) => {
            //     //if(lns[idx].length === 0) { // Only update data if necessary
            //         let vars = d.label.split(" - ")
            //         let ctry = vars[0]
            //         let src = vars[1]
            //         let vr = vars[2]
            //         console.log(ctry, src, vr)
            //         //let datum = props.data.filter(e => e.Country === ctry && e.Source === src).map(e => [parseInt(e.Year), parseFloat(e.Folate)])
                    
            //         // Filter for country, source selected, count crop richness then sort by year
            //         // TODO add variable filtering
            //         let datum = d3
            //         .rollups(props.data.filter(e => e.Country === ctry && e.Source === src), v => v.length, d => parseInt(d.Year))
            //         .sort((a,b) => a[0]-b[0])
            //         //.map(e => [{label: d.label, year: d.Year, val: e}])
            //         console.log(datum)
            //         lns[idx] = datum
            //     //}

            // })
            setLines(lns)
            console.log(lns)
        }
    }

    return (

        <Grid container>


        <Paper elevation={props.paperElevation} sx={{ width:1,my:2, p:2, background: 'primary.main'}}>
            <Typography align="center" variant="h4">This page is under construction!</Typography>
        </Paper>
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
                setSelected={setSelected}
                data={data}
                lines={lines}
                />
            </Paper>
        </Grid>
        </Grid>

    );
}

export default Trends;