import React, { useEffect, useState } from 'react';
import Graph from './Graph.jsx';
import FileSelect from './FileSelect.jsx';
//import Grid from '@mui/material/Grid';
import { Grid, Paper, Typography } from '@mui/material/'


import * as d3 from "d3";


function GraphController(props) {

  // All link widths will be between [0,maxWidth]
  const maxWidth = 3;



  // I literally cannot believe I need an object for this
  var metadata = {
    crops: 0,
    links: 0,
    density: 0,
    avgWeight: 0,
    significant: []
  }

  // Metadata about graph such as node/link count, density, etc.
  const [metaData, setMetaData] = useState(metadata);

  const [bipartite, setBipartite] = useState(false);
  const [current, setCurrent] = useState([]);
  const [nodes, setNodes] = useState([]); // Simple list of all node nodes

  //`${process.env.PUBLIC_URL}`+"/DATA_INPUTS/Tabular_data_inputs/"+d

// const nutrients = ["Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
//             "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
//             "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only."];

const [country, setCountry] = useState(props.countries[0]);
const [method, setMethod] = useState(props.methods[0]);
const [year, setYear] = useState(props.years[0]);
const [highlighted, setHighlighted] = useState(null);

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
      let sums = {};

      let nds = [];
      let lnks = [];
      let nodes = [];

      props.nutrients.forEach(e => {

        nds.push({id: e, group: 2, degree: 0 });
        nodes.push(e);

        // maxes[e] = d3.max(d, item => !Number.isNaN(item[e]) && item[e] != "NA" ? parseFloat(item[e]) : 0);
        sums[e] = d3.sum(d, item => !Number.isNaN(item[e]) && item[e] != "NA" ? parseFloat(item[e]) : 0);

      })


      d.forEach(e => {

        nds.push({id: e.FAO_CropName, group: 1, degree: 0 })
        nodes.push(e.FAO_CropName);
        
        Object.entries(e).forEach(f => {


            // Links are constructed from a crop to a nutrient
            // Values are the explicit cell values of link strength
            // Width is the value expressed from [0,maxWidth]
            if(!Number.isNaN(f[1]) && f[1] > 0) {
              // if(props.nutrients.includes(f[0])) lnks.push({ source: e.FAO_CropName, target: f[0], value: f[1], width: (f[1]/maxes[f[0]])*maxWidth })
              if(props.nutrients.includes(f[0])) lnks.push({ source: e.FAO_CropName, target: f[0], value: f[1], width: (f[1]/sums[f[0]])*maxWidth })
            }
            

        })
        

      })

      lnks.forEach(function(d){

        nds.find(e => e.id === d.source || e.id === d.target).degree++; // Add a degree attribute to each node
        

      });

      // Maximum amount of links is p*q where p = crop count, q = nutrient count
      metadata["density"] = ((lnks.length) / (props.nutrients.length * ((nds.length)-props.nutrients.length))).toFixed(3)*100; 
      metadata["crops"] = (nds.length)-props.nutrients.length;
      metadata["links"] = lnks.length;
      metadata["avgWeight"] = d3.mean(lnks, d => d.width);

      setMetaData(metadata);

      setCurrent([nds,lnks]);
      setNodes(nodes);
      molloy_reed([nds,lnks]);

      }

      // The mathematical derivation for the threshold at which a complex network will lose its giant component is based on the Molloy–Reed criterion.

      // The Molloy–Reed criterion is derived from the basic principle that in order for a giant component to exist, on average each node in the network
      // must have at least two links. This is analogous to each person holding two others' hands in order to form a chain.

      // Using this criterion and an involved mathematical proof, one can derive a critical threshold for the fraction of nodes needed to
      // be removed for the breakdown of the giant component of a complex network.
      async function molloy_reed(data) {

        let nodes = data[0];
        let links = data[1];

        let mean = d3.mean(nodes, d => d.degree);

        let MR = (mean**2+1)/mean;
        console.log("Molloy-Reed Number: " + MR)

        let fraction = 1 - (1/(MR-1));
        
        // console.log(fraction);

        // console.log(nodes);
        


      }



      async function getData(link) {


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

      <Grid item>
        <Paper sx={{width: 1, p:2}} elevation={props.paperElevation} style={{"fontSize": "1em", "fontWeight": "lighter"}}>
          <Typography variant={"h4"} style={{"textAlign": "center"}}>Using This Tool</Typography>
          
          <Typography variant={"p"}>
            In this interactive graph, the relationship between nutrients(blue) and crops(red) is represented with undirected, weighted edges. 
            Each edge weight represents the percent contribution each crop gives to a nutrient. For example, Iron may be provided equally by three crops.
            Their thicknesses will all be equally one third of the maximum width. The Density of a graph is defined by the number of links, divided by the total amount possible.
             In a bipartite graph, this is equal to (|Crops| * |Nutrients|)<sup>1</sup>. Use the drop-down selections to change the country, food source, and year displayed. Or,
            use the "Highlight" dropdown to select a nutrient or crop specifically. Finally, try the bottom toggle to change graph views.
            <br/>
            <br/>
            <b>Bipartite </b> graphs align two distinct categories to separate sides. Beacuse no link can exist between two crops or two nutrients, this classic view makes the
            comparison between two groups simple.          
            <br/>
            <br/>
            <b>Force-Directed </b> graphs use the weight of each edge as the 'force' between two nodes. As they are free to move, clustering naturally occurs
            in this view with more connected nodes usually appearing closer to the center.
            <br/>
            <br/>
            <small><sup>1</sup>|X| = Cardinality, or amount of items in of X</small>
          </Typography>
      </Paper>
      </Grid>

      <Grid item xs={12} lg={9} mb={1}>
        <Paper elevation={props.paperElevation} sx={{ p:2 }}>
          <Grid container>
          <Grid item xs={3}>
            <Typography mb={1} mt={-2} variant={"p"} style={{"fontSize": "1.2em", "fontWeight": "lighter", "textAlign": "center"}}>Crops</Typography>
            <p>{metaData["crops"]}</p>
          </Grid>
          <Grid item xs={3}>
            <Typography mb={1} mt={-2} variant={"p"} style={{"fontSize": "1.2em", "fontWeight": "lighter", "textAlign": "center"}}>Links</Typography>
 
            <p>{metaData["links"]}</p>
          </Grid>
          <Grid item xs={3}>
            <Typography mb={1} mt={-2} variant={"p"} style={{"fontSize": "1.2em", "fontWeight": "lighter", "textAlign": "center"}}>Density</Typography>
         
            <p>{metaData["density"]}%</p>
          </Grid>
          <Grid item xs={3}>
            <Typography mb={1} mt={-2} variant={"p"} style={{"fontSize": "1.2em", "fontWeight": "lighter", "textAlign": "center"}}>Avg. Weight</Typography>
       
            <p>{metaData["avgWeight"]} (Max {maxWidth})</p>
          </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
    <Grid container spacing={2}>

      <Grid item xs={12} lg={9}>
        <Paper  sx={{ elevation: 24 }}>
          <Graph nutrients={props.nutrients} current={current} switch={bipartite} highlighted={highlighted} setHighlighted={setHighlighted} />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={3} sx={{height:'100%'}}>
        <FileSelect 
        nutrients={props.nutrients}
        country={country} setCountry={setCountry}
        method={method} setMethod={setMethod}
        year={year} setYear={setYear}
        bipartite={bipartite} setBipartite={setBipartite}
        highlightOptions={nodes}
        highlighted={highlighted} setHighlighted={setHighlighted}
        {...props} />
      </Grid>


      </Grid>

    </>


  );
}

export default GraphController;






