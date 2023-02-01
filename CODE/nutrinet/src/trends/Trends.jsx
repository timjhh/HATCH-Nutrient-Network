import React, { useState, useEffect } from "react";

import { Paper, Grid, Typography } from "@mui/material";
import VarSelect from "./VarSelect";
import * as d3 from "d3";
import Chart from "./Chart";

function Trends(props) {
  /*
        Presets for trendline collections
    */
  const preset1 = [
    { label: "Angola - Production_kg - CropRichness", color: "#e8e8e8" },
    { label: "Angola - Import_kg - CropRichness", color: "#bddede" },
    { label: "Cuba - Production_kg - CropRichness", color: "#8ed4d4" },
  ];

  const preset2 = [
    { label: "Estonia - Production_kg - CropRichness", color: "#e8e8e8" },
    { label: "Latvia - Production_kg - CropRichness", color: "#bddede" },
    { label: "Lithuania - Production_kg - CropRichness", color: "#8ed4d4" },
  ];

  const preset3 = [
    { label: "Denmark - Production_kg - CropRichness", color: "#e8e8e8" },
    { label: "Sweden - Production_kg - CropRichness", color: "#bddede" },
    { label: "Norway - Production_kg - CropRichness", color: "#8ed4d4" },
    { label: "Finland - Production_kg - CropRichness", color: "#5ac8c8" },
    { label: "Iceland - Production_kg - CropRichness", color: "#dabdd4" },
    { label: "Faroe Islands - Production_kg - CropRichness", color: "#bdbdd4" },
    { label: "Greenland - Production_kg - CropRichness", color: "#8ebdd4" },
  ];

  const ps1 = [
    "Brunei Darussalam - Production_kg - CropRichness",
    "Myanmar - Production_kg - CropRichness",
    "Indonesia - Production_kg - CropRichness",
    "Lao People's Democratic Republic - Production_kg - CropRichness",
    "Malaysia - Production_kg - CropRichness",
    "Phillipines - Production_kg - CropRichness",
    "Singapore - Production_kg - CropRichness",
    "Thailand - Production_kg - CropRichness",
    "Vietnam - Production_kg - CropRichness",
  ]

  const ps2 = [
    "Mexico - Production_kg - CropRichness",
    "Panama - Production_kg - CropRichness",
    "Guatemala - Production_kg - CropRichness",
    "Honduras - Production_kg - CropRichness",
    "Nicaragua - Production_kg - CropRichness",
    "Costa Rica - Production_kg - CropRichness",
    "Belize - Production_kg - CropRichness",
  ]

  const ps4 = [
    "Denmark - Production_kg - CropRichness",
    "Sweden - Production_kg - CropRichness",
    "Norway - Production_kg - CropRichness",
    "Finland - Production_kg - CropRichness",
    "Iceland - Production_kg - CropRichness",
    "Faroe Islands - Production_kg - CropRichness",
    "Greenland - Production_kg - CropRichness",
  ];

  const presets = [
    {label: "Scandinavia", data: ps4},
    {label: "Central America", data: ps2},
    {label: "Southeast Asia", data:ps1},
    {label: "Custom", data: []}
  ]

  const colors = [
    "#e8e8e8",
    "#bddede",
    "#8ed4d4",
    "#5ac8c8",
    "#dabdd4",
    "#bdbdd4",
    "#8ebdd4",
    "#5abdc8",
    "#cc92c1",
    "#bd92c1",
    "#8e92c1",
    "#5a92c1",
    "#be64ac",
    "#bd64ac",
    "#8e64ac",
    "#5a64ac",
  ];

  const [data, setData] = useState([]);
  const [country, setCountry] = useState("Angola");
  const [year, setYear] = useState("2019");
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
  const [preset, setPreset] = useState(presets[0])

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

  function updateLineData() {
    if (loaded) {
      var dt = [];
      var lns = lines;
      lines.forEach((d, idx) => {
        let vars = d.label.split(" - ");
        let ctry = vars[0];
        let src = vars[1];
        let vr = vars[2];

        let datum = data.filter((e) => e.Country === ctry && e.Source === src);

        dt = dt.concat(
          datum.map((e) => {
            return {
              ...e,
              Value: parseFloat(e[vr]),
              Color: d.color,
              key: d.label,
            };
          })
        );
      });
      setLineData(dt);
    }
  }

  function addLine(label) {
    // Return the first color we haven't used
    const clr = colors.find((d) => !lines.map((e) => e.color).includes(d));

    const lns = lines.concat({
      label: label,
      color: clr,
    });
    setLines(lns);
  }

  return (
    <Grid container>
      <Paper
        elevation={props.paperElevation}
        sx={{ width: 1, my: 2, p: 2, background: "primary.main" }}
      >
        <Typography align="center" variant="h4">
          This page is under construction!
        </Typography>
      </Paper>
      <Grid item xs={12}>
        <Paper
          elevation={props.paperElevation}
          sx={{ my: 2, p: 2, background: "primary.main" }}
        >
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
            {...props}
          />
        </Paper>
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
