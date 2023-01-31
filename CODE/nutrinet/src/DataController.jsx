import React, { useEffect, useState } from 'react';
import './App.css';
import * as d3 from "d3";

import { Route, Routes } from 'react-router-dom';

import GraphController from './graph/GraphController.jsx'
import MapController from './map/MapController.jsx'
import DataDownloader from 'DataDownloader';
import Trends from './trends/Trends.jsx'

function DataController() {

  const [selected, setSelected] = useState(null);
  const [threshold,setThreshold] = useState(false);

  // What elevation each tile should have from the webpage
  const paperElevation = 6;

  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [methods, setMethods] = useState([]);

  const [bigData, setBigData] = useState([])

  const [loaded, setLoaded] = useState(false);

// NOTE: Removal of more variables in the map object
// NOTE: GraphController creates links using these nutrients and the FAO_CropName - if you wish to do further analysis of matrix variables, change code at start of
// GraphController to include nutrients, cropname and your desired vars
// 4.14 Removed "Omega.3..USDA.only.", "B12..USDA.only."
const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA"];

// Unused variables with names verbatim from the provided .csv file
// This is passed to MapController to control which variables are selectable in the Map element
const unused = ["", "Year", "Country", "M49.Code", "ISO2.Code", "ISO3.Code", "Source",	"income", "Kg_Omega.3..USDA.only.", "Kg_B12..USDA.only."];

  useEffect(() => {

    if(bigData.length === 0) {

      d3.csv("./DATA_INPUTS/LF_NoThreshold.csv").then(data => {

        // Year,Source,Country
        setBigData(data)
        setCountries([...new Set(data.map(d => d.Country))]);
        setMethods([...new Set(data.map(d => d.Source))]);
        setYears([...new Set(data.map(d => d.Year))].sort());

        setLoaded(true)
    
      }).catch(err => console.log(err))

    }


  }, [])



  return (

    <>
    <Routes>
        <Route path='/' exact
         element={<GraphController
         loaded={loaded}
         bigData={bigData}
         nutrients={nutrients}
         unused={unused}
         paperElevation={paperElevation}
         selected={selected} setSelected={setSelected}
         threshold={threshold} setThreshold={setThreshold}
         countries={countries} methods={methods} years={years}/>}/>

        <Route path='/maps'
          element={<MapController
          loaded={loaded}
          unused={unused}
          nutrients={nutrients}
          paperElevation={paperElevation}
          selected={selected} setSelected={setSelected}
          countries={countries} methods={methods}/>}/>

        <Route path='/data'
          element={<DataDownloader 
            loaded={loaded}
            data={bigData}
            paperElevation={paperElevation}
            countries={countries}
            methods={methods}
            years={years} />}/>

        <Route path='/trends'
          element={<Trends
            //loaded={loaded}
            //data={bigData}
            unused={unused}
            paperElevation={paperElevation}
            countries={countries}
            sources={methods}
            years={years} />}/>

    </Routes>


    </>




  );
}

export default DataController;






