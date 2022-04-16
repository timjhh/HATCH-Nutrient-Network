import React, { useEffect, useState } from 'react';
import Graph from './Graph.jsx';
import FileSelect from './FileSelect.jsx';
import { Grid, Paper, Typography, Box } from '@mui/material/'


import * as d3 from "d3";


function GraphController(props) {

  // All link widths will be between [0,maxWidth]
  const maxWidth = 3;

  const minOpacity = 0.3;



  // I literally cannot believe I need an object for this
  var metadata = {
    crops: 0,
    links: 0,
    density: 0,
    avgWeight: 0,
    maxes: []
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

      let maxes = [];
      let sums = {};

      let nds = [];
      let lnks = [];
      let nodes = [];

      props.nutrients.forEach(e => {

        nds.push({id: e, group: 2, degree: 0 });
        nodes.push(e);

        // Find the cumulative sum of each nutrient's contents
        sums[e] = d3.sum(d, item => !Number.isNaN(item[e]) && item[e] !== "NA" ? parseFloat(item[e]) : 0);

        // Find the crop which contributes the most to each nutrient
        let max = d[d3.maxIndex(d, item => !Number.isNaN(item[e]) && item[e] !== "NA" ? parseFloat(item[e]) : 0)]

        // If there is an entry for this crop, save its name, % contribution and # of occurrences as the max contributor
        // The final state of this object should be:
        // max[Crop] = [
        //  [list of % contributions to nutrients],
        //  Avg % contributed -> this is a derived value after dictionary generation, of % contribution to nutrients it is the largest contributor to
        //  Avg % contributed total -> this is a derived value after dictionary generation
        //  # of links -> this is a derived value after dictionary generation
        // ]
        ///
        /// NOTE: The rest of maxes should be filled after links are calculated, for the quickest implementation of # connections by crop
        ///
        if(max["FAO_CropName"] && maxes[max["FAO_CropName"]]) {
          maxes[max["FAO_CropName"]][0].push(max[e]/sums[e]);

        } else {
          maxes[max["FAO_CropName"]] = [[max[e]/sums[e]], 0, 0, 0]; 
        }


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

      // For all max-contributing crops, ascertain the # of connections and avg % contributed
      Object.entries(maxes).forEach(f => {

        let cropLinks = lnks.filter(lnk => lnk.source === f[0]);

        maxes[f[0]][1] = d3.mean(maxes[f[0]][0]);
        maxes[f[0]][2] = d3.mean(cropLinks, d => d.width/maxWidth)
        maxes[f[0]][3] = cropLinks.length;
      })



      lnks.forEach(function(d){

        nds.find(e => e.id === d.source || e.id === d.target).degree++; // Add a degree attribute to each node

      });



      // Maximum amount of links is p*q where p = crop count, q = nutrient count
      metadata["density"] = ((lnks.length) / (props.nutrients.length * ((nds.length)-props.nutrients.length))).toFixed(3)*100; 
      metadata["crops"] = (nds.length)-props.nutrients.length;
      metadata["links"] = lnks.length;
      metadata["avgWeight"] = d3.mean(lnks, d => d.width);

      // Turn dictionary into key/value pair where key = name of crop
      // and value = array of crop metadata
      var statItems = Object.keys(maxes).map((key) => { return [key, maxes[key]] });
      statItems.sort((a,b) => b[1][0].length-a[1][0].length);
      metadata["maxes"] = statItems;


      // Update all data for graph and webpage
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




    <Grid container mb={2} spacing={2}>

      <Grid item>
        <Paper sx={{p:2}} elevation={props.paperElevation} style={{"fontSize": "1em", "fontWeight": "lighter"}}>
          <Typography variant={"h4"} style={{"textAlign": "center"}}>Using This Tool</Typography>
          
          <Typography variant={"p"}>
            In this interactive graph, the relationship between nutrients(blue) and crops(red) is represented with undirected, weighted edges. 
            Each edge weight represents the percent contribution each crop gives to a nutrient. For example, Iron may be provided equally by three crops.
            Their thicknesses will all be equally one third of the maximum width. The opacity or visibility of each link is also influenced by its strength. The Density of a graph is defined by the number of links, divided by the total amount possible.
             In a bipartite graph, this is equal to (|Crops| * |Nutrients|)<sup>1</sup>. Use the drop-down selections to change the country, food source, and year displayed. Or,
            use the "Highlight" dropdown to select a nutrient or crop specifically. You can zoom into the graph and drag nodes around, or click on a node to see its connections. Finally, try the bottom toggle to change graph views.
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











    </Grid>

    <Grid container spacing={2} sx={{dispaly: 'flex'}}>

      <Grid item xs={12} lg={9}>
        <Paper elevation={props.paperElevation} sx={{ height: '100%' }}>
          <Graph maxWidth={maxWidth} minOpacity={minOpacity} nutrients={props.nutrients} current={current} switch={bipartite} highlighted={highlighted} setHighlighted={setHighlighted} />
        </Paper>
      </Grid>


      <Grid item xs={12} lg={3} sx={{ height:'100%', alignContent: 'space-around', display: 'flex', flexDirection: 'column' }}>

        <Box sx={{ height: '100%' }}>
          <FileSelect 
          nutrients={props.nutrients}
          paperElevation={props.paperElevation}
          country={country} setCountry={setCountry}
          method={method} setMethod={setMethod}
          year={year} setYear={setYear}
          bipartite={bipartite} setBipartite={setBipartite}
          highlightOptions={nodes}
          highlighted={highlighted} setHighlighted={setHighlighted}
          {...props} />
        </Box>

        <Box sx={{ height: '100%', alignItems: 'stretch', display: 'flex', alignItems: 'stretch' }}>
          <Paper elevation={props.paperElevation} sx={{ mt:2, p:2 }}>
            <Grid container>
            <Grid item xs={6}>
              <Typography variant={"p"} style={{"fontSize": "1.2em", "textAlign": "center"}}><b>Crops</b></Typography>
              <p>{metaData["crops"]}</p>
            </Grid>
            <Grid item xs={6}>
              <Typography variant={"p"} style={{"fontSize": "1.2em", "textAlign": "center"}}><b>Links</b></Typography>
              <p>{metaData["links"]}</p>
            </Grid>
            <Grid item xs={6}>
              <Typography variant={"p"} style={{"fontSize": "1.2em", "textAlign": "center"}}><b>Density</b></Typography>
              <p>{metaData["density"]}%</p>
            </Grid>
            <Grid item xs={6}>
              <Typography variant={"p"} style={{"fontSize": "1.2em", "textAlign": "center"}}><b>Avg. Weight</b></Typography>
              <p className='text-wrap'>{(parseFloat(metaData["avgWeight"])/maxWidth).toFixed(4)}%</p>
            </Grid>
            </Grid>
          </Paper>
        </Box>


      </Grid>




      </Grid>

      <Grid container mt={1} spacing={2}>

      <Grid item xs={12}>
        <Paper elevation={props.paperElevation} sx={{ px:2, py:3 }}>
          <Typography mb={2} variant={"h4"} sx={{"textAlign": "center"}}>Keystone Crops</Typography>
          <Typography variant={"p"} my={1}>
            These crops are deemed to be significant to a country's food system as they are the largest contributor to one or more nutrients. Each nutrient has some amount of links with widths equal to that crop's percent contribution
            to providing said nutrient. It is helpful to note that in many cases, crops may contribute significantly to far fewer nutrients than others.
            <br/><br/>

            * LCt is defined as the Largest Contributor to n nutrients. The summation of all LCt's below should equal the total number of nutrients. Thus, Avg. LCt Weight is the contribution
            each crop makes on average to nutrients where it is the largest contributor. This is compared to the Avg. Weight of this crop to all of its connected nutrients
            <br/>
          </Typography>
          <Grid container mt={2}>
            {metaData["maxes"].map(z => (

              <Grid item key={z[0]} xs={3}>
                
                <Paper sx={{ p:1, m:1 }} elevation={props.paperElevation}>

                <b>{z[0]}</b>
                <p>LCt: {z[1][0].length}</p>
                <p>Avg. LCt Weight: {(z[1][1]*100).toFixed(3)}%</p>
                <p>Avg. Weight: {(z[1][2]*100).toFixed(3)}%</p>
                <p>Connections: {z[1][3]}</p>

                </Paper>

              </Grid>

            ))}

          </Grid>
        </Paper>
      </Grid>



      </Grid>

    </>


  );
}

export default GraphController;






