import React from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navigation = () => {


    return (
        <Box sx={{ py:2, mb: 4, bgcolor: '#c5cae9', display: 'block' }}>
            <Box sx={{ display: 'inline-flex' }}>

            <Typography sx={{ fontWeight: 'light', ml:5, fontSize: "4em" }} variant="p" gutterBottom component="div">NutriNet</Typography>
            </Box>

            <Box sx={{ display: "inline-flex", flexDirection: "column", justifyContent: "center" }}>
            <Button sx={{mx: 2}} href="/" variant="outlined">Graphs</Button>    
                
            </Box>
            <Box sx={{ display: 'inline-flex' }}>
            <Button sx={{mx: 2}} href="/maps" variant="outlined">Maps</Button>    

                
            </Box>




        </Box>
    )

}

export default Navigation;