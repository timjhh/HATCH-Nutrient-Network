import React, { useEffect, useState } from "react";
import Map from "./Map.jsx";
import NutriSelect from "./NutriSelect.jsx";
import MapGraphs from "./MapGraphs.jsx";

import {
  Grid,
  Stack,
  Switch,
  Paper,
  FormControl,
  LinearProgress,
} from "@mui/material";

import * as d3 from "d3";

import Typography from "@mui/material/Typography";

function MapController(props) {
  // 4x4 Bivariate Colors
  const colors1d = [
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
  const colors2d = [
    ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8"],
    ["#dabdd4", "#bdbdd4", "#8ebdd4", "#5abdc8"],
    ["#cc92c1", "#bd92c1", "#8e92c1", "#5a92c1"],
    ["#be64ac", "#bd64ac", "#8e64ac", "#5a64ac"],
  ];

  // Has the choropleth loaded?
  const [mapLoaded, setMapLoaded] = useState(false);

  // NOTE : variable1, variable2, and year all used an assumed default value.
  // If variable 'Population' or year '2019' are ever removed, be sure to update these
  const [variable1, setVariable1] = useState("AmountTotalCrop_kg");

  const [variable2, setVariable2] = useState("CropRichness");

  const [bigData, setBigData] = useState([]);

  const [year, setYear] = useState(2020);

  const [years, setYears] = useState([]);

  const [current, setCurrent] = useState([]); // Current data selected with color attribute attached

  const [currentSNA, setCurrentSNA] = useState([]); // Current Sans-NA values

  const [distribution, setDistribution] = useState([]); // Distribution of colors from 2-d legend, used to create histogram

  const [source, setSource] = useState("Production_kg"); // What source of food intake? Import, Production, etc.

  const [sources, setSources] = useState(["Production_kg"]); // List containing all sources of food intake

  const [variables, setVariables] = useState([]);

  // Selected color will highlight all affected countries
  // This should be in the form of a hexidecimal color, or the nullclr attribute
  // Hardcoded default is the "medium-high" option in the bivariate scale
  const [highlight, setHighlight] = useState(null);

  // Selected country will be highlighted on the scatterplot
  // This should either be an ISO_A3 Code for a country, or null.
  const [selected, setSelected] = useState(null);

  const [scaleType1, setScaleType1] = useState("Quantile");
  const [scaleType2, setScaleType2] = useState("Quantile");

  // What color to show for unavailable data
  var nullclr = "black";
  var nullStroke = "white";

  // What color to show for highlighted data
  var highlightClr = "#FF7F7F";

  // What line thickness should highlighted rectangles be in the legend
  var highlightLegendWidth = 4;

  // Categorical string descriptors meant for our color scale
  // This should be equal to colors2d.length, i.e. one strip of our 2d color scale
  var descriptors = ["Low", "Medium-Low", "Medium-High", "High"];

  // This scale will always be constant as its domain does not change
  const gdpScale = d3
  .scaleOrdinal()
  .domain(["Low income","Lower middle income", "Upper middle income", "High income"])
  .range(d3.range(0, colors2d.length));

  // const colors1d = ["#e8e8e8", "#c8e1e1", "#a6d9d9", "#81d1d1", "#5ac8c8", "#dec8d9", "#c8c8d9", "#a6c8d9", "#81c8d1", "#5ac8c8", "#d3a7cb", "#c8a7cb", "#a6a7cb", "#81a7cb", "#5aa7c8", "#c986bc", "#c886bc", "#a686bc", "#8186bc", "#5a86bc", "#be64ac", "#be64ac", "#a664ac", "#8164ac", "#5a64ac"];
  // const colors2d = [
  //   ["#e8e8e8", "#c8e1e1", "#a6d9d9", "#81d1d1", "#5ac8c8"],
  //   ["#dec8d9", "#c8c8d9", "#a6c8d9", "#81c8d1", "#5ac8c8"],
  //   ["#d3a7cb", "#c8a7cb", "#a6a7cb", "#81a7cb", "#5aa7c8"],
  //   ["#c986bc", "#c886bc", "#a686bc", "#8186bc", "#5a86bc"],
  //   ["#be64ac", "#be64ac", "#a664ac", "#8164ac", "#5a64ac"]
  // ];

  useEffect(() => {
    d3.csv(
      `${process.env.PUBLIC_URL}` + "./DATA_INPUTS/SocioEconNutri.csv"
    ).then((res, err) => {
      // Only set large dataset up once
      setBigData(res);

      // Set up selectable variables,years and sources for interaction
      setVariables(res.columns.filter((d) => !props.unused.includes(d)));
      setYears([...new Set(res.map((d) => d.Year))].sort());
      setSources(Array.from(d3.group(res, (d) => d.Source).keys()));
    });
  }, []);


  useEffect(() => {
    if (bigData.length > 0) {
      updateData();
    }
  }, [variable1, variable2, scaleType1, scaleType2, source, year, bigData]);

  // On each new variable selection, scale type, year or source change
  // Query the data for this source/year and plot all variables
  function updateData() {
    let data = bigData.filter(
      (d) => d.Source === source && d.Year === String(year)
    );

    /// If we are using a socio-econ variable and country does not have a record for this source
    // try to find other sources that do exist for this country and fill in socioecon vars
    if(props.socioEconVars.includes(variable1) || props.socioEconVars.includes(variable2)) {
      if(data.length < props.countries.length) {
        let used = data.map(e => e["Country"])
        let unused = props.countries.filter(c => !used.includes(c))
        unused.forEach(u => {
          let t = bigData.find(b => b.Year === String(year) && b.Country === u)
          if(t) {
            props.nutrients.forEach(n => {
              t[("Kg_"+n)] = "NA"
            })
            data.push(t)
          }
        })
      }
    }


    let m1 = d3.max(data, (d) => parseFloat(d[variable1]));
    let m2 = d3.max(data, (d) => parseFloat(d[variable2]));

    var scaleVar1;
    var scaleVar2;

    // For both variables, check the selected scale type, create a new scale along one dimension
    // of our 2d grid and pass our domain
    if (scaleType1 === "Quantile") {
      scaleVar1 = d3
        .scaleQuantile()
        .domain(data.map((e) => e[variable1]))
        .range(d3.range(0, colors2d.length));
    } else {
      scaleVar1 = d3.scaleSymlog().domain([0, m1]).range([0, 1]);
    }

    if (scaleType2 === "Quantile") {
      scaleVar2 = d3
        .scaleQuantile()
        .domain(data.map((e) => e[variable2]))
        .range(d3.range(0, colors2d.length));
    } else {
      scaleVar2 = d3.scaleSymlog().domain([0, m2]).range([0, 1]);
    }

    // Iterate over data to assign colors to each country
    data.forEach((d) => {
      let v1 = 0;
      let v2 = 0;

      // Apply scale each variable for coloring
      if (scaleType1 === "Quantile") {
        v1 = scaleVar1(parseFloat(d[variable1]));
      } else {
        v1 =
          Math.round(scaleVar1(parseFloat(d[variable1])) * colors2d.length) - 1;
        v1 = v1 < 0 ? 0 : v1;
      }

      if (scaleType2 === "Quantile") {
        v2 = scaleVar2(parseFloat(d[variable2]));
      } else {
        v2 =
          Math.round(scaleVar2(parseFloat(d[variable2])) * colors2d.length) - 1;
        v2 = v2 < 0 ? 0 : v2;
      }

      // Special case: GDP is null
      // In which case, use 'income' variable according to World Bank Classifier
      if(variable1 === "GDP" && d[variable1] === "NA") v1 = gdpScale(d["income"])
      if(variable2 === "GDP" && d[variable2] === "NA") v2 = gdpScale(d["income"])
      try {
        // Apply a color if it's found, else apply our default null coloring(defined above)
        d.color =
          (v1 === undefined || v2 === undefined || isNaN(v1) || isNaN(v2))
            ? nullclr
            : colors2d[v2][v1];
      } catch (e) {
        console.error(
          "Error: Cannot map variables " + v1 + " " + v2 + " to map color"
        );
      }
    });

    // Create color distribution for later use in histogram
    let colorDist = d3.rollups(
      data,
      (v) => v.length - 1,
      (d) => d.color
    );

    // If a color has not been found from our 1d ledger, map it with an occurrence of 0
    colors1d.forEach((d, idx) => {
      if (colorDist.filter((e) => e[0] === d).length === 0)
        colorDist.push([d, 0]);
    });

    // Update 'global' vars that need to be reset on each new selection
    setCurrentSNA(data.filter((z) => z.color !== nullclr));

    // Now map colors into a usable object with values { color: x, value: y, place: sequential index of color in order }
    // We add one to place because our null color has an index of -1
    setDistribution(
      colorDist.map((e) => ({
        color: e[0],
        value: e[1],
        place: colors1d.indexOf(e[0]) + 1,
      }))
    );

    setCurrent(data);
  }

  return (
    <>
      <Grid item mb={2}>
        <Paper
          sx={{ p: 2 }}
          elevation={props.paperElevation}
          style={{ fontSize: "1em", fontWeight: "lighter" }}
        >
          <Typography variant={"h4"} style={{ textAlign: "center" }}>
            Using This Tool
          </Typography>

          <Typography variant={"p"}>
            In this interactive choropleth, bivariate relationships can be
            viewed in a global context. The legend on the right shows coloring
            from low to high in a 2-d grid, where higher values become a
            stronger color, and stronger relationships become a stronger blend
            of colors. Clicking on any square from the legend will highlight all
            countries on the map with that color. Clicking anywhere on the map
            or graphs will deselect a country. You can also select a country on
            the map to highlight it in the scatterplot. Hovering over any
            country will show a tooltip with information about the selected
            variables. Some countries that are missing one or both variables
            will be colored black.
          </Typography>
        </Paper>
      </Grid>

      <Grid mb={1} container spacing={2} sx={{ height: "70%" }}>
        <Grid item xs={9}>
          <Grid
            sx={{ height: "100%" }}
            container
            justifyContent="space-between"
            direction="column"
            spacing={0}
          >
            <NutriSelect
              setHighlight={setHighlight}
              selected={selected}
              setSelected={setSelected}
              year={year}
              setYear={setYear}
              years={years}
              source={source}
              setSource={setSource}
              sources={sources}
              variables={variables} // Single .csv file
              variable1={variable1}
              setVariable1={setVariable1}
              variable2={variable2}
              setVariable2={setVariable2}
              scaleType1={scaleType1}
              scaleType2={scaleType2}
              setScaleType1={setScaleType1}
              setScaleType2={setScaleType2}
              {...props}
            />

            <Paper elevation={props.paperElevation}>
              <Map
                className="viz"
                mapLoaded={mapLoaded}
                setMapLoaded={setMapLoaded}
                variable1={variable1}
                variable2={variable2}
                current={current} // Current data applied
                distribution={distribution}
                colors1d={colors1d}
                colors2d={colors2d}
                descriptors={descriptors}
                gdpScale={gdpScale}
                nullclr={nullclr}
                nullStroke={nullStroke}
                highlightClr={highlightClr}
                highlight={highlight}
                setHighlight={setHighlight}
                selected={selected}
                setSelected={setSelected}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid
            sx={{ height: "100%" }}
            container
            justifyContent="space-between"
            direction="column"
            spacing={0}
          >
            <MapGraphs
              highlightLegendWidth={highlightLegendWidth}
              mapLoaded={mapLoaded}
              setMapLoaded={setMapLoaded}
              selected={selected}
              setSelected={setSelected}
              highlightClr={highlightClr}
              highlight={highlight}
              setHighlight={setHighlight}
              className="viz"
              variable1={variable1}
              variable2={variable2}
              current={current} // Current data applied
              currentSNA={currentSNA} // Current data sans-NA/0 values
              distribution={distribution}
              colors1d={colors1d}
              colors2d={colors2d}
              nullclr={nullclr}
              paperElevation={props.paperElevation}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default MapController;
