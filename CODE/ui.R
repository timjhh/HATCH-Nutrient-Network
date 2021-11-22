library(shiny)
library(ggplot2)
library(tidyverse)
library(dplyr)
library(visNetwork)
library(rsconnect)

fluidPage(
  
  #titlePanel("HATCH Project"),
  
  sidebarPanel(
    style=('background-color:coral;
    margin-top:40%; width:50%;'),
    uiOutput("countries"),
    uiOutput("countryTypes"),
    uiOutput("countryYears"),
    
    uiOutput("graphType")
    
    
  ),
  
  mainPanel( visNetworkOutput("dGraph"), height = "100%" )
)