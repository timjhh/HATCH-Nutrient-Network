import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './Graph.jsx';
import FileSelect from './FileSelect.jsx';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import * as d3 from "d3";

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Papa from 'papaparse';

function GraphController(props) {

  const [selected, setSelected] = useState(null);
  const [bipartite, setBipartite] = useState(false);
  const [current, setCurrent] = useState([]);

  //`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+d

const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
            "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
            "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only."];


useEffect(() => {

    (async () => {


      try {

        let regex = new RegExp(`${props.country}_${props.method}_${props.year}`);

        var filtered = props.files.filter(f => f.match(regex));
 
        //const d = await getData('./Afghanistan_ImportsGlobalConstrained_2019.csv');
        // `${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+filtered[0]
        const d = await getData(`${process.env.PUBLIC_URL}`+"./DATA_INPUTS/Tabular_data_inputs/"+filtered[0]);

        console.log(d);
        const w = await wrangle(d);

        await setCurrent({nodes: w[0], links: w[1]});
        //const g = await genGraph(w);
        console.log(current);

      } catch(err) {
        console.log(err);
      }


    }) ();


      // yee haw!!
      async function wrangle(d) {


      let nds = [];
      let lnks = [];

      nutrients.forEach(e => {
        nds.push({id: e, group: 2 });
      })

      d.forEach(e => {

        nds.push({id: e.FAO_CropName, group: 1 })
        
        Object.entries(e).forEach(f => {
    
            if(!Number.isNaN(f[1]) && f[1] > 0) {
              if(nutrients.includes(f[0])) lnks.push({ source: e.FAO_CropName, target: f[0], value: f[1] })
            }
            

        })
        

      })




      return [nds,lnks];
      //setCurrent([nds,lnks])

      }




      async function getData(link) {

        //var csvFilePath = require('./Afghanistan_ImportsGlobalConstrained_2019.csv');
        var csvFilePath = require(link);


          d3.csv(link).then((res, idz) => {


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




}, [props.country])





  return (

    <>

    <FileSelect {...props} />


      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Bipartite</Typography>
          <Switch id="bipSwitch" checked={bipartite} onChange={() => { setBipartite(!bipartite) }} name="bipartite" />
        <Typography>Force-Directed</Typography>
      </Stack>


      <Graph current={current} switch={bipartite} />

    </>


  );
}

export default GraphController;






