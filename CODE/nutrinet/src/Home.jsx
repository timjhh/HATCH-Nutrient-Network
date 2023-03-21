import React from 'react';
import './App.css';

import { Grid, Paper, List, ListItem, Box, Button, ButtonGroup,Tooltip } from '@mui/material/';
import graphs from "./images/graph.png"
import maps from "./images/map.png"
import dl from "./images/dl.png"
import t2 from "./images/trends2.png"
import Typography from '@mui/material/Typography';


function Footer() {

    const descriptions = [
        [graphs,"Graphs", "Use the Graphs page to visualize crop and nutrient data in a bipartite or force-directed layout.", "/graphs"],
        [maps,"Maps","Use the Maps page to visualize nutrient and socio-economic data across the world with an interactive choropleth.", "/maps"],
        [t2,"Trends","Use the Trends page to create custom combinations of variables and visualize them across a timeline.", "/trends"],
        [dl, "Data", "Download custom versions of these datasets", "/data"]
    ]


  return (



    <Grid container spacing={2} sx={{ mt:2, p:1, display: "inline-flex", flexDirection: 'row', alignItems: 'center' }}>


    <Grid item xs={12} mb={5} sx={{border:1}}>
    
    <Typography mt={-2} style={{textAlign: "center", fontWeight: "lighter",fontSize:"6em"}} variant={'h1'}>NutriNet</Typography>
    <Typography mt={-2} mb={2} style={{textAlign: "center", fontWeight: "lighter",fontSize:"1.5em"}}>Global relationships between crop diversity and nutritional stability</Typography>
    
    </Grid>

    <Grid item mt={5} mb={5} p={2} xs={12}>
  
      <Paper mt={2} sx={{ width: 1 }} elevation={6} component="div">
      <Grid item xs={12} sx={{width:"100%"}}>
        <ButtonGroup m={0} p={0} sx={{width:"100%", height: "20%"}} variant="text" aria-label="text button group">
        {descriptions.map((d,idx) => (
            <Tooltip title={d[2]} key={"tooltiphome"+idx}>
                <Button
                href={d[3]}
                aria-labelledby={"button " + d[2]}
                px={0}
                sx={{
                    ':hover': {
                      boxShadow:'0 10px 0px rgba(0,0,0, .4)',
                    }
                  }}
                style={{ color: 'black',fontWeight: "bold", minWidth: "25%",minHeight: "100px", backgroundImage: `url(${d[0]})`}}><mark style={{backgroundColor: "rgba(255, 255, 255, 0.9)", border:'0.25em solid black', padding: '0.2em'}}>{d[1]}</mark></Button>
            </Tooltip>
        
        ))}

        </ButtonGroup>
        </Grid>
      </Paper>

    </Grid>
    <Grid item xs={12} mt={5}>
    <Paper sx={{ width: 1, py:1 }} elevation={6} component="div">
          
          <Box sx={{p:2}}>
        
        <Typography variant={"p"}><b>Welcome </b> to the NutriNet visualizations on Crop Diversity and Nutritional Stability. To get started, see the buttons or navigation bar above.</Typography><br/><br/>
          
          <Typography variant={"p"}>
            <b>Nutritional stability</b> is defined as a food system's capability to provide sufficient nutrients despite disturbance. Our research has shown that despite a possible increase in
            crop imports, nutrintional stability has either stagnated or decreased in some countries. With a growing focus on nutritional diversity, it may be difficult to distinguish
            crop diversity from nutritional diversity. To that end, this web-app was developed to visualize food system diversity and stability.
        
            In our first paper, bipartite graphs were algorithmically deconstructed to test the robustness of a country's imports and production. In this continuation
            of research, we can see numerous relationships between crops, nutrients, and extraneous variables. This gives us the ability to find new variable relationships, or look at what nutrients may be in danger of extinction. Visualizing graphs also
            allows us to easily see the robustness or size of a country's crop network with helpful diagnostic information.
            <br/><br/>
            This is an open-source application lisenced under GNU General Public License v2.0. Data was gathered from publicly available sources at the following locations:
          </Typography>
          <List>
            <ListItem>Crop Production Quantity Data From the FAO Stat Databse [<a rel='noreferrer' target="_blank" href="https://www.fao.org/faostat/en/#data/QCL">Link</a>]</ListItem>
            <ListItem>GENuS Nutrient Composition Data from the Harvard Dataverse [<a rel='noreferrer' target="_blank" href="https://dataverse.harvard.edu/dataverse/GENuS">Link</a>]</ListItem>
            <ListItem>Intake Data from the USDA Branded Food Products Database [<a rel='noreferrer' target="_blank" href="https://data.nal.usda.gov/dataset/usda-branded-food-products-database">Link</a>]</ListItem>
          </List>
  
          <Typography variant={"p"}>
              For more information about this project, see our first paper <a href="https://www.nature.com/articles/s41467-021-25615-2" rel='noreferrer' target={"_blank"}>here</a> or source code <a href="https://github.com/timjhh/HATCH-Nutrient-Network" rel="noreferrer" target="_blank">here</a>.
            </Typography>
  
          </Box>
  
        </Paper>
        </Grid>
      

  </Grid>



  );
}

export default Footer;






