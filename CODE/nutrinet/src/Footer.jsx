import React, { useEffect, useState } from 'react';
import './App.css';

import { Grid, Paper, List, ListItem, Box } from '@mui/material/';

import Typography from '@mui/material/Typography';


function Footer() {



  return (



    <Grid container spacing={2} sx={{ mt:2, p:1, bgcolor: '#8f97cf', display: 'block', display: "inline-flex", flexDirection: 'row', alignItems: 'center' }}>

    {/* <Grid item xs={4} sx={{ display: 'inline-flex' }}>

        <Paper sx={{width: 1, p:1}} elevation={6}>
            <Typography variant={"p"}>
            This material is based upon work supported by the USDA Hatch Program(grant numbers VT-H02303 and VT-02709). Any opinions, findings, conclusions, or recommendations
            expressed in this publication are those of the author(s) and do not necessarily reflect the view of the U.S. Department of Agriculture. 

            For more information about this project, see our first paper <a href="https://www.nature.com/articles/s41467-021-25615-2" rel='noreferrer' target={"_blank"}>here</a>.
          </Typography>
        </Paper>
        
    </Grid> */}


    <Grid item xs={0} md={2}></Grid>

    <Grid item xs={12} md={8} sx={{ p:2 }}>
  
      <Paper sx={{ width: 1, py:1 }} elevation={6} component="div">
          
        <Box sx={{p:2}}>

        <Typography mb={2} variant={"h5"} style={{"textAlign": "center"}}>About the Project</Typography>
        
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
          <ListItem>Crop Production Quantity Data From the FATO Stat Databse [<a rel='noreferrer' target="_blank" href="https://www.fao.org/faostat/en/#data/QCL">Link</a>]</ListItem>
          <ListItem>GENuS Nutrient Composition Data from the Harvard Dataverse [<a rel='noreferrer' target="_blank" href="https://dataverse.harvard.edu/dataverse/GENuS">Link</a>]</ListItem>
          <ListItem>Intake Data from the USDA Branded Food Products Database [<a rel='noreferrer' target="_blank" href="https://data.nal.usda.gov/dataset/usda-branded-food-products-database">Link</a>]</ListItem>
        </List>

        <Typography variant={"p"}>
            This material is based upon work supported by the USDA Hatch Program(grant numbers VT-H02303 and VT-02709). Any opinions, findings, conclusions, or recommendations
            expressed in this publication are those of the author(s) and do not necessarily reflect the view of the U.S. Department of Agriculture. 

            For more information about this project, see our first paper <a href="https://www.nature.com/articles/s41467-021-25615-2" rel='noreferrer' target={"_blank"}>here</a>.
          </Typography>

        </Box>

      </Paper>


    </Grid>
      
    <Grid item xs={0} md={2}></Grid>
      

  </Grid>



  );
}

export default Footer;






