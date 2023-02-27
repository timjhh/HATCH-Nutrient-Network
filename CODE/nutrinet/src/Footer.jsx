import React from 'react';
import './App.css';

import { Grid, Paper, List, ListItem, Box } from '@mui/material/';

import Typography from '@mui/material/Typography';


function Footer(props) {



  return (



    <Grid className='footer-sticky' container spacing={2} sx={{ mt:2, p:1, bgcolor: '#8f97cf', display: "inline-flex", flexDirection: 'row', alignItems: 'center' }}>


    <Grid item xs={0} md={2}></Grid>

    <Grid item xs={12} md={8} sx={{ p:2 }}>
  
      <Paper sx={{ width: 1, py:1 }} elevation={6} component="div">         
        <Box sx={{p:2}}>
        <Typography mb={2} variant={"p"}>
          {props.text}
        </Typography>
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






