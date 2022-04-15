import React from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import gh from './images/GitHub-Mark-32px.png';

const Navigation = () => {


    return (

        <Grid container spacing={2}  sx={{ mb: 4, bgcolor: '#c5cae9', display: 'inline-block' }}>
        <Grid item sx={{ display: 'inline-flex' }} xs={6}>
  
            <Typography sx={{ fontWeight: 'light', ml:5, fontSize: "4em" }} variant="p" gutterBottom component="div">NutriNet</Typography>

        </Grid>

        <Grid item xs={2} sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>

  
        <Button sx={{mx: 2}} href="/" variant="outlined">Graphs</Button>  
        
  
        </Grid>
  
        <Grid item xs={2} sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
        <Button sx={{mx: 2}} href="/maps" variant="outlined">Maps</Button>    

        </Grid>
        <Grid item sx={{ display: "inline-flex", justifyContent: "flex-end" }}>
            <a href="https://github.com/timjhh/HATCH-Nutrient-Network" rel="noopener noreferrer" target="_blank">
                <img src={gh} />
            </a>
        </Grid>

          

      </Grid>


        // <Box sx={{ py:2, mb: 4, bgcolor: '#c5cae9', display: 'block' }}>
        //     <Box sx={{ display: 'inline-flex' }}>
        //         <Typography sx={{ fontWeight: 'light', ml:5, fontSize: "4em" }} variant="p" gutterBottom component="div">NutriNet</Typography>
        //     </Box>

        //     <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
        //         <Button sx={{mx: 2}} href="/" variant="outlined">Graphs</Button>    
        //     </Box>
        //     <Box sx={{ display: 'inline-flex' }}>
            
        //         <Button sx={{mx: 2}} href="/maps" variant="outlined">Maps</Button>    
                
        //     </Box>
        //     {/* style={{ "align-content": "flex-end"}} */}
        //     <Box  display="flex" justifyContent="flex-end" sx={{ flexDirection: "column", justifyContent: "center", width:1/64 }}>
        //         <img src={gh} />
        //     </Box>


        // </Box>
    )

}

export default Navigation;