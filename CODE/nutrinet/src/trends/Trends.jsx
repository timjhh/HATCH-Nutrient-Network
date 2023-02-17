import React, { useState, useEffect } from "react";

import { Paper, Grid } from "@mui/material";
import VarSelect from "./VarSelect";
import * as d3 from "d3";
import Chart from "./Chart";

function Trends(props) {
  /*
        Presets for trendline collections
    */

  const MAX_LINES = 10;

  const ps1 = [
    "Brunei Darussalam - CropRichness - Production_kg",
    "Myanmar - CropRichness - Production_kg",
    "Indonesia - CropRichness - Production_kg",
    "Lao People's Democratic Republic - CropRichness - Production_kg",
    "Malaysia - CropRichness - Production_kg",
    "Phillipines - CropRichness - Production_kg",
    "Singapore - CropRichness - Production_kg",
    "Thailand - CropRichness - Production_kg",
    "Vietnam - CropRichness - Production_kg",
  ]

  const ps2 = [
    "Mexico - CropRichness - Export_kg",
    "Panama - CropRichness - Export_kg",
    "Guatemala - CropRichness - Export_kg",
    "Honduras - CropRichness - Export_kg",
    "Nicaragua - CropRichness - Export_kg",
    "Costa Rica - CropRichness - Export_kg",
    "Belize - CropRichness - Export_kg",
  ]

  const ps3 = [
    "Denmark - CropRichness - Import_kg",
    "Sweden - CropRichness - Import_kg",
    "Norway - CropRichness - Import_kg",
    "Finland - CropRichness - Import_kg",
    "Iceland - CropRichness - Import_kg",
    "Faroe Islands - CropRichness - Import_kg",
    "Greenland - CropRichness - Import_kg",
    "Denmark - Population - Import_kg"
  ];

  const ps4 = [
    "United Kingdom of Great Britain and Northern Ireland - CropRichness - Production_kg",
    "Luxembourg - CropRichness - Production_kg",
    "Belgium - CropRichness - Production_kg",
    "Belgium-Luxembourg - CropRichness - Production_kg",
    "Ireland - CropRichness - Production_kg",
    "Netherlands - CropRichness - Production_kg",
    "France - CropRichness - Production_kg",
    "Austria - CropRichness - Production_kg",
    "Germany - CropRichnessy - Production_kg",
    "Switzerland - CropRichness - Production_kg",
  ]

  const presets = [
    {label: "Scandinavia Imports", data: ps3},
    {label: "Central America Exports", data: ps2},
    {label: "Southeast Asia", data:ps1},
    {label: "Western Europe", data: ps4},
    {label: "Custom", data: []}
  ]

  // const colors = [
  //   "#e8e8e8",
  //   "#bddede",
  //   "#8ed4d4",
  //   "#5ac8c8",
  //   "#dabdd4",
  //   "#bdbdd4",
  //   "#8ebdd4",
  //   "#5abdc8",
  //   "#cc92c1",
  //   "#bd92c1",
  //   "#8e92c1",
  //   "#5a92c1",
  //   "#be64ac",
  //   "#bd64ac",
  //   "#8e64ac",
  //   "#5a64ac",
  // ];

  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ]

  const [data, setData] = useState([]);
  const [country, setCountry] = useState(props.countries[0]);
  const [year, setYear] = useState("2020");
  const [source, setSource] = useState("Production_kg");
  const [scaleType, setScaleType] = useState("Linear");
  const [variable, setVariable] = useState("Population");
  const [selected, setSelected] = useState(null);
  const [lines, setLines] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [sources, setSources] = useState([]);
  const [variables, setVariables] = useState([]);
  const [preset, setPreset] = useState(null)

  function sanitize(text) {
    return text.split("_").join(" ");
  }

  useEffect(() => {
    if (data.length === 0) {
      d3.csv("./DATA_INPUTS/SocioEconNutri_AY.csv")
        .then((res) => {
          // Year,Source,Country
          setData(res);
          setCountries([...new Set(res.map((d) => d.Country))]);
          setSources([...new Set(res.map((d) => d.Source))]);
          setYears([...new Set(res.map((d) => d.Year))].sort());
          setVariables(res.columns.filter((d) => !props.unused.includes(d)));
          setPreset(presets[0])
          setLoaded(true);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      updateLineData();
    }
  }, [lines, props.data]);

  function removeLine(item) {
    setLines(lines.filter((d) => d.label !== item));
  }

  function updateLineData() {
    if (loaded) {
      var dt = [];
      lines.forEach((d, idx) => {
        let vars = d.label.split(" - ");
        let ctry = vars[0];
        let vr = vars[1];
        let src = vars[2];

        let datum = data.filter((e) => e.Country === ctry && e.Source === src);
        
        // Fill in the gaps in our data with 0 values
        if((datum.length < (d3.max(props.years)-d3.min(props.years))+1) && datum.length > 0) {
          // Set of values that ARE in the data
          let yrs = datum.map(y => y.Year)
          // Find years that have not yet been used
          let unused = props.years.filter(x => !yrs.includes(x))

          // Concatenate unused years with a 0
          datum = datum.concat(unused.map(y => {
            let o = {Year: y}
            o[vr] = 0
            return o
          }))
        }

        // Add this dataset to the set of lines we now have 
        dt = dt.concat(
          datum.map((e) => {
            return {
              ...e,
              Value: parseFloat(e[vr]),
              Color: d.color,
              key: d.label,
            };
          }).sort((a, b) => parseInt(a.Year) - parseInt(b.Year))
        );
      });
    
      setLineData(dt);
    }
  }

  // State update for switching presets
  // Each preset should have a label and data attribute
  // Data should be in the form of an array containing labels in the format of
  // "Country - Source - Variable"
  useEffect(() => {
    if(preset === null || preset.label === "Custom" || preset.data.length === 0) return;
    setLines([])
    let lns = []
    preset.data.forEach((ps,idx) => {
        const clr = colors[idx%MAX_LINES]
  
        let v = ps.split(" - ")[1]
        const displayLabel = sanitize(props.socioEconVars.includes(v) ? ps.split(" - ", 2).join(" - ")
        : ps)

        lns.push({
          label: ps,
          color: clr,
          displayLabel: displayLabel
        });
      });
    setLines(lns);
  }, [preset])



  return (
    <Grid container>

      <Grid item xs={12}>
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
            selected={selected}
            setSelected={setSelected}
            presets={presets}
            preset={preset}
            setPreset={setPreset}
            colors={colors}
            removeLine={removeLine}
            {...props}
          />
      </Grid>
      <Grid item xs={12}>
        <Paper
          elevation={props.paperElevation}
          sx={{ my: 2, p: 2, background: "primary.main" }}
        >
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
            selected={selected}
            setSelected={setSelected}
            data={data}
            lines={lines}
            lineData={lineData}
            loaded={loaded}
          />
        </Paper>


        
      </Grid>
    </Grid>
  );
}

export default Trends;
