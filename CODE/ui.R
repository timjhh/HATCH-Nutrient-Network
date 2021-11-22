library(shiny)
library(ggplot2)
library(tidyverse)
library(dplyr)
library(visNetwork)
library(rsconnect)

fluidPage(
  
  
  fluidRow(column(width=6 , titlePanel("NutriNet Visualizations")
    ,style=('text-align: center;'),),
    
    
    ),

  fluidRow(
    align="center",
    style="margin:1%",
    #actionButton('toggleBtn', 'Add Secondary Graph'), 
    uiOutput("showTwo")
    #tags$div(id = 'placeholder') 
  ),
  
  fluidRow(
    style=('background-color:coral;
    width:50%; display:flex; flex-wrap:wrap; margin:1%; padding:2%;'),
    uiOutput("countries"),
    uiOutput("countryTypes"),
    uiOutput("countryYears"),
    uiOutput("graphType")
    
  ),
  fluidRow(
    visNetworkOutput("dGraph")
  ),
  conditionalPanel(
    condition = ("'input.showTwo' == TRUE"),
    column(width=6 , visNetworkOutput("dGraph2")
                    ,style=('text-align: center;'))
    
    
  )

  # sidebarPanel(
  #   style=('background-color:coral;
  #   margin-top:40%; width:50%;'),
  #   uiOutput("countries"),
  #   uiOutput("countryTypes"),
  #   uiOutput("countryYears"),
  # 
  #   uiOutput("graphType")
  # 
  # 
  # ),
  
  #mainPanel( visNetworkOutput("dGraph"), height = "100%" )
)