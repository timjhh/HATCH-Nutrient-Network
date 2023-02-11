import React, { useEffect, useState } from 'react';
import './App.css';

import { Route, Routes } from 'react-router-dom';

import GraphController from './graph/GraphController.jsx'
import MapController from './map/MapController.jsx'
import DataDownloader from 'DataDownloader';
import Trends from './trends/Trends.jsx'
import { initializeApp } from "firebase/app";
import { Snackbar, Alert } from '@mui/material';
import { getDatabase } from "firebase/database";

function DataController() {

  const [selected, setSelected] = useState(null);
  const [threshold,setThreshold] = useState(false);

  // What elevation each tile should have from the webpage
  const paperElevation = 6;

  const [countries, setCountries] = useState(["Afghanistan","Albania","Algeria","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belgium-Luxembourg","Belize","Benin","Bhutan","Bolivia (Plurinational State of)","Bosnia and Herzegovina","Botswana","Brazil","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China, Hong Kong SAR","China, Macao SAR","China, mainland","China, Taiwan Province of","Colombia","Comoros","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Czechoslovakia","Democratic People's Republic of Korea","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Ethiopia PDR","Faroe Islands","Fiji","Finland","France","French Guyana","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guadeloupe","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran (Islamic Republic of)","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mexico","Micronesia (Federated States of)","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","North Macedonia","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Republic of Korea","Republic of Moldova","Réunion","Romania","Russian Federation","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Serbia and Montenegro","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Sudan (former)","Suriname","Sweden","Switzerland","Syrian Arab Republic","Tajikistan","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom of Great Britain and Northern Ireland","United Republic of Tanzania","United States of America","Uruguay","USSR","Uzbekistan","Vanuatu","Venezuela (Bolivarian Republic of)","Viet Nam","Yemen","Yugoslav SFR","Zambia","Zimbabwe",]);
  const [years, setYears] = useState([...Array(41).keys()].map(i => String(i + 1980)));
  const [sources, setSources] = useState([
    "Production_kg",
    "Import_kg",
    "Export_kg"
  ]);

  const [bigData, setBigData] = useState([])

  const [loaded, setLoaded] = useState(false);

  const [database,setDatabase] = useState(null)


  // Is error snackbar open?
  const [open, setOpen] = useState(false);

  // Error snackbar message, should be null if it is closed
  const [snackBar, setSnackBar] = useState(null);

  const handleSBClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  
    setSnackBar(null);
  };


// NOTE: Removal of more variables in the map object
// NOTE: GraphController creates links using these nutrients and the FAO_CropName - if you wish to do further analysis of matrix variables, change code at start of
// GraphController to include nutrients, cropname and your desired vars
// 4.14 Removed "Omega.3..USDA.only.", "B12..USDA.only."
const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin_C", "Vitamin_A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary_Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated_FA", "Monounsaturated_FA", "Polyunsaturated_FA"];

// Unused variables with names verbatim from the provided .csv file
// This is passed to MapController to control which variables are selectable in the Map element
const unused = ["", "Year", "Country", "M49.Code", "ISO2.Code", "ISO3.Code", "Source",	"income", "Kg_Omega.3..USDA.only.", "Kg_B12..USDA.only."];



  useEffect(() => {

    const firebaseConfig = {
      databaseURL: process.env.REACT_APP_DATABASE_URL,
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    
    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);
    setDatabase(db)
    setLoaded(true)
  }, [])

  return (

    <>
    <Routes>
        <Route path='/' exact
         element={<GraphController
         snackBar={snackBar}
         setSnackBar={setSnackBar}
         database={database}
         loaded={loaded}
         bigData={bigData}
         nutrients={nutrients}
         unused={unused}
         paperElevation={paperElevation}
         selected={selected} setSelected={setSelected}
         threshold={threshold} setThreshold={setThreshold}
         countries={countries} sources={sources} years={years}/>}/>

        <Route path='/maps'
          element={<MapController
          loaded={loaded}
          unused={unused}
          nutrients={nutrients}
          paperElevation={paperElevation}
          selected={selected} setSelected={setSelected}
          countries={countries} sources={sources}/>}/>

        <Route path='/data'
          element={<DataDownloader 
            snackBar={snackBar}
            setSnackBar={setSnackBar}
            loaded={loaded}
            database={database}
            paperElevation={paperElevation}
            countries={countries}
            sources={sources}
            years={years} />}/>

        <Route path='/trends'
          element={<Trends
            //loaded={loaded}
            //data={bigData}
            unused={unused}
            paperElevation={paperElevation}
            countries={countries}
            sources={sources}
            years={years} />}/>

    </Routes>

    <Snackbar open={snackBar!==null} autoHideDuration={5000} onClose={handleSBClose}>
      <Alert
        onClose={handleSBClose}
        severity="error"
        sx={{ width: "100%" }}
      >
        {snackBar}
      </Alert>
    </Snackbar>


    </>




  );
}

export default DataController;






