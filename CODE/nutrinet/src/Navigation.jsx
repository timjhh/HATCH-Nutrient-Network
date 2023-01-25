import React from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import gh from './images/GitHub-Mark-32px.png';

const Navigation = () => {


    return (



        <Box spacing={0}  sx={{ width: 1, mb: 4, bgcolor: '#8f97cf', display: 'inline-flex', alignItems: 'center' }}>
        
        <Typography sx={{ fontWeight: 'light', ml:2, fontSize: "2.5em" }} variant="p" gutterBottom component="div">NutriNet</Typography>


        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "flex-start", alignItems: 'flex-center' }}>
            <Button sx={{ml: 2}} href="/" variant="text">Graphs</Button>  
        </Box>

        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
            <Button href="/maps" variant="text">Maps</Button>    
        </Box>

        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
            <Button href="/data" variant="text">Data</Button>    
        </Box>
        
        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
            <Button href="/trends" variant="text">Trends</Button>    
        </Box>

        <Box sx={{ width: 1, display: "inline-flex", justifyContent: "flex-end", px:4 }}>

            <Typography variant="h6" sx={{mx: 1}}>Code</Typography>
            <a href="https://github.com/timjhh/HATCH-Nutrient-Network" rel="noopener noreferrer" target="_blank">
                <img src={gh} alt="Github Logo" />
            </a>
       
        </Box >

          

      </Box>
    )

}

export default Navigation;