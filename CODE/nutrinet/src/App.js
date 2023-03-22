import React, { useState } from "react";
import "./App.css";

import Grid from "@mui/material/Grid";
import Footer from "Footer";
import Navigation from "./Navigation.jsx";
import DataController from "./DataController.jsx";
import { createTheme, ThemeProvider } from "@mui/material";
const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", "lighter"].join(","),
  },
});



function App() {
  const [footerText, setFooterText] = useState(null)

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navigation />
        <main>
        <Grid container spacing={0}>
          <Grid item xs={1} xl={2}></Grid>
          <Grid item xs={10} xl={8} justify="center" alignItems="center">
            <DataController setFooterText={setFooterText} />
          </Grid>

          <Grid item xs={1} xl={2}></Grid>
        </Grid>
        </main>
      </div>
      <Footer text={footerText}/>
    </ThemeProvider>
  );
}

export default App;
