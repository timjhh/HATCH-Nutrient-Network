import React from "react";
import { Typography, Button, Box, Link } from "@mui/material";

import gh from './images/GitHub-Mark-32px.png';

const Navigation = () => {


    return (

        <nav>
        <Box spacing={0}  sx={{ width: 1, mb: 4, bgcolor: '#8f97cf', display: 'inline-flex', alignItems: 'center' }}>
        
        <Typography sx={{ fontWeight: 'light', ml:2, fontSize: "2.5em" }} variant="p" gutterBottom component="div">
            <Link underline="none" style={{ color: '#003837', textDecoration: 'none' }} href="/">NutriNet</Link>
        </Typography>


        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "flex-start", alignItems: 'flex-center' }}>
            <Button aria-labelledby={"nav button"} sx={{ml: 2, color:"#003837"}} className="navButton" href="/graphs" variant="text">Graphs</Button>  
        </Box>

        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
            <Button aria-labelledby={"nav button"} sx={{color:"#003837"}} className="navButton" href="/maps" variant="text">Maps</Button>    
        </Box>

        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
            <Button aria-labelledby={"nav button"} sx={{color:"#003837"}} className="navButton" href="/trends" variant="text">Trends</Button>    
        </Box>

        <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
            <Button aria-labelledby={"nav button"} sx={{color:"#003837"}} className="navButton" href="/data" variant="text">Data</Button>    
        </Box>
    
        <Box sx={{ width: 1, display: "inline-flex", justifyContent: "flex-end", px:4 }}>

            <Typography variant="h6" sx={{mx: 1}}>Code</Typography>
            <a aria-labelledby="github repo link" href="https://github.com/timjhh/HATCH-Nutrient-Network" rel="noopener noreferrer" target="_blank">
                <img src={gh} alt="Github Logo" />
            </a>
       
        </Box >

          

      </Box>
      </nav>
    )

}

export default Navigation;