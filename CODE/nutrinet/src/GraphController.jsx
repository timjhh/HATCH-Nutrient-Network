import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './Graph.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';


import * as d3 from "d3";



import Papa from 'papaparse';

function GraphController(props) {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);
  const [current, setCurrent] = useState([]);

  //`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+d

const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only."];

const [country, setCountry] = useState(props.countries[0]);
const [method, setMethod] = useState(props.methods[0]);
const [year, setYear] = useState(props.years[0]);

useEffect(() => {

  console.log("Country: " + country + "\nMethod: " + method + "\nYear: " + year);


    (async () => {


      try {

        let regex = new RegExp(`${country}_${method}_${year}`);

        var filtered = props.files.filter(f => f.match(regex));

        //const d = await getData('./Afghanistan_ImportsGlobalConstrained_2019.csv');
        // `${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+filtered[0]
        const d = await getData("./DATA_INPUTS/Tabular_data_inputs/"+filtered[0]);

        const w = await wrangle(d);
          
        // await setCurrent({nodes: w[0], links: w[1]});
        //const g = await genGraph(w);

      } catch(err) {
        console.log(err);
      }


    }) ();


      // yee haw!!
      async function wrangle(d) {

      let maxes = {};

      let nds = [];
      let lnks = [];

      nutrients.forEach(e => {
        //console.log(d.e)
        nds.push({id: e, group: 2 });
        // maxes.e = d3.max(d => Object.entries(d).e);
        maxes[e] = d3.max(d, item => !Number.isNaN(item[e]) && item[e] != "NA" ? parseFloat(item[e]) : 0);

      })


      d.forEach(e => {

        nds.push({id: e.FAO_CropName, group: 1 })
        
        Object.entries(e).forEach(f => {

            if(!Number.isNaN(f[1]) && f[1] > 0) {
              if(nutrients.includes(f[0])) lnks.push({ source: e.FAO_CropName, target: f[0], value: f[1], width: (f[1]/maxes[f[0]])*3 })
            }
            

        })
        

      })




      //return [nds,lnks];
      setCurrent([nds,lnks])

      }




      async function getData(link) {

        //var csvFilePath = require('./Afghanistan_ImportsGlobalConstrained_2019.csv');
        //var csvFilePath = require(link);


          return d3.csv(link).then((res, idz) => {

            return res;

          });

          // return new Promise(function(resolve, error) {
            
          //   Papa.parse(csvFilePath, {
          //     header: true,
          //     download: true,
          //     skipEmptyLines: true,
          //     dynamicTyping: true,
          //     complete: (res) => { resolve(res.data) }
          //   }); 

          // });



      }




}, [country, method, year])





  return (

    <>

    <Grid container spacing={2}>

      <Grid item xs={12} md={9}>
        <Graph current={current} switch={bipartite} />
      </Grid>
      <Grid item xs={12} md={3}>
        <FileSelect 
        country={country} setCountry={setCountry}
        method={method} setMethod={setMethod}
        year={year} setYear={setYear}
        bipartite={bipartite} setBipartite={setBipartite}
      {...props} />
      </Grid>









      </Grid>

    </>


  );
}

export default GraphController;






