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
        {label: "Angola - Production_kg - Population", color: "#e8e8e8", data: []},
        {label: "Angola - Import_kg - Population", color: "#bddede", data: []},
        {label: "Cuba - Production_kg - CropRichness", color: "#8ed4d4", data: []},
    ]

    const [data, setData] = useState([])
    const [country, setCountry] = useState("Angola")
    const [year, setYear] = useState("2019")
    const [source, setSource] = useState("Production_kg")
    const [scaleType, setScaleType] = useState("Linear")
    const [variable, setVariable] = useState("Population")
    const [selected, setSelected] = useState(null)
    const [lines,setLines] = useState(preset1)
    const [lineData, setLineData] = useState([])
    const [loaded,setLoaded] = useState(false)

    const [countries, setCountries] = useState([]);
    const [years, setYears] = useState([]);
    const [sources, setSources] = useState([]);
    const [variables, setVariables] = useState([]);
  

    // const data = [
    //     [new Date(1980),1],
    //     [new Date(1981),2],
    //     [new Date(1982),3],
    //     [new Date(1983),1],
    //     [new Date(1984),20],
    //     [new Date(1985),32],
    //     [new Date(1986),15],
    //     [new Date(1987),21],
    //     [new Date(1988),35],
    // ]

    useEffect(() => {

        if(data.length === 0) {
    
          d3.csv("./DATA_INPUTS/SocioEconNutri_AY.csv").then(res => {
    
            // Year,Source,Country
            setData(res)
            setCountries([...new Set(res.map(d => d.Country))]);
            setSources([...new Set(res.map(d => d.Source))]);
            setYears([...new Set(res.map(d => d.Year))].sort());
            setVariables(res.columns.filter(d => !props.unused.includes(d)));
    
            setLoaded(true)
        
          }).catch(err => console.log(err))
    
        }
    
    
      }, [])

    useEffect(() => {
        if(data.length > 0) {
            updateLineData()
        }
        
    }, [lines, props.data])


    function updateLineData() {
        if(loaded) {
            var dt = []
            var lns = lines
            lines.forEach((d,idx) => {
                //if(lns[idx].length === 0) { // Only update data if necessary
                    let vars = d.label.split(" - ")
                    let ctry = vars[0]
                    let src = vars[1]
                    let vr = vars[2]
                 
                    //let datum = props.data.filter(e => e.Country === ctry && e.Source === src).map(e => [parseInt(e.Year), parseFloat(e.Folate)])
                    
                    // Filter for country, source selected, count crop richness then sort by year
                    // TODO add variable filtering
                    // let datum = d3
                    // .rollups(data.filter(e => e.Country === ctry && e.Source === src), v => v.length, d => parseInt(d.Year))
                    // .sort((a,b) => a[0]-b[0])
                    // console.log(datum)
                    // lns[idx] = datum
                    // dt = dt.concat(datum)

                    let datum = data.filter(e => e.Country === ctry && e.Source === src)

                    dt.push(datum.map(e => {
                        return {...e, Value: e[vr]}}))

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
            //setLines(lns)
            //console.log(lns)
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
                years={years}
                countries={countries}
                sources={sources}
                loaded={loaded}
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