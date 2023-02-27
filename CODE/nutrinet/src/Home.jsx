import React from 'react';
import './App.css';

import { Grid, Paper, List, ListItem, Box, Button, ButtonGroup, ButtonBase,Tooltip } from '@mui/material/';
import graphs from "./images/graph.png"
import maps from "./images/map.png"
import trends from "./images/trends.png"
import t2 from "./images/trends2.png"
import { Image } from '@mui/icons-material';
import Typography from '@mui/material/Typography';


function Footer() {

    const descriptions = [
        [graphs,"Graphs", "Use the Graphs page to visualize crop and nutrient data in a bipartite or force-directed layout.", "/graphs"],
        [maps,"Maps","Use the Maps page to visualize nutrient and socio-economic data across the world with an interactive choropleth.", "/maps"],
        [t2,"Trends","Use the Trends page to create custom combinations of variables and visualize them across a timeline.", "/trends"],
        [null, "Data", "Download custom versions of these datasets", "/data"]
    ]


  return (



    <Grid className='footer-sticky' container spacing={2} sx={{ mt:2, p:1, display: "inline-flex", flexDirection: 'row', alignItems: 'center' }}>


    {/* <Grid item xs={4} sx={{ display: 'inline-flex' }}>

        <Paper sx={{width: 1, p:1}} elevation={6}>
            <Typography variant={"p"}>
            This material is based upon work supported by the USDA Hatch Program(grant numbers VT-H02303 and VT-02709). Any opinions, findings, conclusions, or recommendations
            expressed in this publication are those of the author(s) and do not necessarily reflect the view of the U.S. Department of Agriculture. 

            For more information about this project, see our first paper <a href="https://www.nature.com/articles/s41467-021-25615-2" rel='noreferrer' target={"_blank"}>here</a>.
          </Typography>
        </Paper>
        
    </Grid> */}

    <Grid item xs={12} mb={5}>
    
    <Typography style={{textAlign: "center", fontWeight: "lighter",fontSize:"6em"}}>NutriNet</Typography>
    <Typography mt={-2} style={{textAlign: "center", fontWeight: "lighter",fontSize:"1.5em"}}>Global relationships between crop diversity and nutritional stability</Typography>
    </Grid>
    <Grid item mt={5} xs={12} sx={{ p:2 }}>
  

      {/* <Paper sx={{ width: 1, py:1 }} elevation={6} component="div">
          
        <Box sx={{p:2}}>

        
            <hr/>
        <Typography variant={"p"}>  
          <b>Nutritional stability</b> is defined as a food system's capability to provide sufficient nutrients despite disturbance. Our research has shown that despite a possible increase in
          crop imports, nutrintional stability has either stagnated or decreased in some countries. With a growing focus on nutritional diversity, it may be difficult to distinguish
          crop diversity from nutritional diversity. To that end, this web-app was developed to visualize food system diversity and stability. The 40 year dataset used has been constructed with open-sourced data from the FAO, GeNuS data on nutrient composition, and USDA branded foods data.
        </Typography>
                
        <br/><br/>
          This is an open-source application lisenced under GNU General Public License v2.0. Data was gathered from publicly available sources at the following locations:
        <List>
          <ListItem>Crop Production Quantity Data From the FAO Stat Databse [<a rel='noreferrer' target="_blank" href="https://www.fao.org/faostat/en/#data/QCL">Link</a>]</ListItem>
          <ListItem>GENuS Nutrient Composition Data from the Harvard Dataverse [<a rel='noreferrer' target="_blank" href="https://dataverse.harvard.edu/dataverse/GENuS">Link</a>]</ListItem>
          <ListItem>Intake Data from the USDA Branded Food Products Database [<a rel='noreferrer' target="_blank" href="https://data.nal.usda.gov/dataset/usda-branded-food-products-database">Link</a>]</ListItem>
        </List>

        <Typography variant={"p"}>
            This material is based upon work supported by the USDA Hatch Program(grant numbers VT-H02303 and VT-02709). Any opinions, findings, conclusions, or recommendations
            expressed in this publication are those of the author(s) and do not necessarily reflect the view of the U.S. Department of Agriculture. 

            For more information about this project, see our first paper <a href="https://www.nature.com/articles/s41467-021-25615-2" rel='noreferrer' target={"_blank"}>here</a>.
          </Typography>

        </Box>

      </Paper> */}

      <Paper mt={2} sx={{ width: 1, py:1 }} elevation={6} component="div">
      <Grid p={0} item xs={12} sx={{width:"100%"}}>
        <ButtonGroup sx={{width:"100%", height: "20%"}} variant="text" aria-label="text button group">
        {descriptions.map((d,idx) => (
            <Tooltip title={d[2]}>
                <Button
                href={d[3]}
                sx={{
                    ':hover': {
                      bgcolor: 'primary.main', // theme.palette.primary.main
                      color: 'white',
                    },
                  }}
                style={{ color: 'black',fontWeight: "bold", minWidth: "25%",minHeight: "100px", backgroundImage: `url(${d[0]})`,}}>{d[1]}</Button>
            </Tooltip>
        
        ))}

        </ButtonGroup>
        </Grid>
      </Paper>

    </Grid>
      

  </Grid>



  );
}

export default Footer;






