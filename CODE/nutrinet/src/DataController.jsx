import React, { useState } from 'react';
import './App.css';

import { Route, Routes } from 'react-router-dom';

import GraphController from './graph/GraphController.jsx'
import MapController from './map/MapController.jsx'

function DataController() {

  const [selected, setSelected] = useState(null);

  // What elevation each tile should have from the webpage
  const paperElevation = 6;

  var countries = [];
  var years = [];
  var methods = [];

  function importAll(r) {
    return r.keys();
  }


// NOTE: Removal of more variables in the map object
// NOTE: GraphController creates links using these nutrients and the FAO_CropName - if you wish to do further analysis of matrix variables, change code at start of
// GraphController to include nutrients, cropname and your desired vars
// 4.14 Removed "Omega.3..USDA.only.", "B12..USDA.only."
const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA"];

// Unused variables with names verbatim from the provided .csv file
// This is passed to MapController to control which variables are selectable in the Map element
const unused = ["", "Year", "Country", "M49.Code", "ISO2.Code", "ISO3_Code", "Source",	"income", "Kg_Omega.3..USDA.only.", "Kg_B12..USDA.only."];

  //const files = importAll(require.context(`${process.env.PUBLIC_URL}`+'./DATA_INPUTS_T/Tabular_data_inputs', false, /\.(csv)$/));
  // Old regex /\.(csv)$/
  const files = importAll(require.context('./DATA_INPUTS/Tabular_data_inputs/threshold', false, /^((?!.*DATA_INPUTS).)*\.(csv)$/));

  
  files.forEach(d => {
    let arr = d.substring(2).split("_");
    arr[2] = arr[2].split(".")[0];
    if(!countries.includes(arr[0])) countries.push(arr[0]);
    if(!methods.includes(arr[1])) methods.push(arr[1]);
    if(!years.includes(arr[2])) years.push(arr[2]);
  })

  return (


    <Routes>
        <Route path='/'
         element={<GraphController
         nutrients={nutrients}
         unused={unused}
         paperElevation={paperElevation}
         files={files} selected={selected} setSelected={setSelected}
         // country={country} setCountry={setCountry}
         // method={method} setMethod={setMethod}
         // year={year} setYear={setYear}
         countries={countries} methods={methods} years={years}/>}/>

        <Route path='/maps'
          element={<MapController
          unused={unused}
          files={files}
          nutrients={nutrients}
          paperElevation={paperElevation}
          selected={selected} setSelected={setSelected}
          // country={country} setCountry={setCountry}
          // method={method} setMethod={setMethod}
          // year={year} setYear={setYear}
          countries={countries} methods={methods} years={years}/>}/>

    </Routes>




  );
}

export default DataController;






