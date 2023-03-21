import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Paper,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { ref, equalTo, query, orderByChild, get } from "firebase/database";

import Typography from "@mui/material/Typography";
import { CSVLink } from "react-csv";
import ListSelect from "ListSelect";

function DataDownloader(props) {
  const [countriesDL, setCountriesDL] = useState([]);
  const [yearsDL, setYearsDL] = useState([]);
  const [sourcesDL, setSourcesDL] = useState([]);
  const [canDownload, setCanDownload] = useState(false);
  const [dataSource, setDataSource] = useState("database");
  const [downloading, setDownloading] = useState(false);
  const [dlLabel, setDlLabel] = useState("Select Data to Download");

  const [dlData, setDLData] = useState([]);

  const csvLink = React.createRef();

  // Set download button state, downloading state, and can download state from one place
  // props: whether a download is happening right now
  function updateCanDownload(dl) {
    if (!dl) {
      setDownloading(false);
      setCanDownload(
        yearsDL.length > 0 && countriesDL.length > 0 && sourcesDL.length > 0
      );
      setDlLabel(
        yearsDL.length > 0 && countriesDL.length > 0 && sourcesDL.length > 0
          ? "Download"
          : "Select Data to Download"
      );
    } else {
      setDlLabel("Downloading....");
      setDownloading(true);
    }
  }

  useEffect(() => {
    // props.setFooterText("Hello World")
  }, [])

  useEffect(() => {
    updateCanDownload(downloading);
  }, [countriesDL, yearsDL, sourcesDL]);

  useEffect(() => {
    if (dlData.length > 0) {
      csvLink.current.link.click();
      updateCanDownload(false);
      setDLData([])
    }
  }, [dlData]);

  // Queries firebase for data to be downloaded by iterating through countries, filtering returned data by year,
  // then by source requested
  // If maps is selected, loads data from csv, filters for desired countries and source requested
  function downloadData() {
    if (!props.database) return;

    updateCanDownload(true);

    // Data is sourced from firebase db
    if (dataSource === "database") {
      Promise.all(
        countriesDL.map((country) => {
          return fetchDataByCountry(country);
        })
      ).then((data) => {
        if (data.length > 0) {
          setDLData(data.flat());
        } else {
          props.setSnackBar("Warning: 0 Records Found for Request");
        }
      });
    } else {
      // Data being downloaded must be from maps dataset
      d3.csv(
        `${process.env.PUBLIC_URL}` + "./DATA_INPUTS/SocioEconNutri.csv"
      ).then((res, err) => {
        console.log(res)
        console.log(countriesDL)
        console.log(yearsDL)
        console.log(sourcesDL)
        let datum = res.filter((e) => (
          (countriesDL.length > 0 && countriesDL.includes(e.Country)) &&
          (yearsDL.length > 0 && yearsDL.includes(e.Year)) &&
          (sourcesDL.length > 0 && sourcesDL.includes(e.Source))
        ))
        if (datum.length > 0 && !err) {
          setDLData(datum.flat());
        } else {
          props.setSnackBar("Warning: 0 Records Found for Request");
          updateCanDownload(false)
        }
        


      });
    }
  }

  async function fetchDataByCountry(country) {
    const rf = query(
      ref(props.database, "/"),
      orderByChild("Country"),
      equalTo(country)
    );
    return get(rf)
      .then((snapshot) => {
        return Object.values(snapshot.val()).filter(
          (e) =>
            yearsDL.length > 0 &&
            yearsDL.includes(String(e.Year)) &&
            sourcesDL.length > 0 &&
            sourcesDL.includes(e.Source)
        );
      })
      .catch((e) => {
        console.warn(e);
        props.setSnackBar("Error: Database Call Failed");
        return [];
      });
  }

  return (
    <Paper
      elevation={props.paperElevation}
      sx={{ my: 2, p: 2, background: "primary.main" }}
    >
      {props.loaded ? (
        <>
          <Typography mb={2} variant={"h4"} sx={{ textAlign: "center" }}>
            Download This Data
          </Typography>
          <Typography variant={"p"} sx={{ textAlign: "center" }}>
            Download data used for the "graphs" page containing many crops
            across years, and nutrients provided by this crop. Some general data
            like serving size for that crop and population of countries are
            provided.
          </Typography>

          <FormControl
            sx={{ mt: 3, display: "inline-flex", justifyContent: "flex-start" }}
          >
            <RadioGroup
              sx={{ display: "inline-flex", justifyContent: "flex-start" }}
              row
              aria-labelledby="data-source-radio-group"
              value={dataSource}
              name="data-source-radio-group"
              onChange={(event) => setDataSource(event.target.value)}
            >
              <FormControlLabel
                selected
                value="database"
                control={<Radio />}
                label="By Crop (Used in Graphs)"
              />
              <FormControlLabel
                value="map"
                control={<Radio />}
                label="Summarized, Across Crops (Used in Maps and Trends)"
              />
            </RadioGroup>
          </FormControl>
          <Box
            sx={{
              width: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <ListSelect
              label={"Countries"}
              data={countriesDL}
              setData={setCountriesDL}
              options={props.countries}
              aria-labelledby="countries-picker"
            />

            <Divider orientation="vertical" flexItem />

            <ListSelect
              label={"Years"}
              data={yearsDL}
              setData={setYearsDL}
              options={props.years}
              aria-labelledby="years-picker"
            />

            <Divider orientation="vertical" flexItem />

            <ListSelect
              label={"Sources"}
              data={sourcesDL}
              setData={setSourcesDL}
              options={props.sources}
              aria-labelledby="sources-picker"
            />
          </Box>
          <Button
            disabled={!canDownload || downloading}
            variant="contained"
            onClick={downloadData}
            aria-labelledby="download-button"
            type="submit"
          >
            {dlLabel}
            {downloading && <CircularProgress color="inherit" size="1rem" />}
          </Button>
          <CSVLink
            ref={csvLink}
            style={{ display: "none" }}
            asyncOnClick={true}
            filename={"nutrinet-custom-data.csv"}
            data={dlData}
          />
        </>
      ) : (
        <LinearProgress />
      )}
    </Paper>
  );
}

export default DataDownloader;
