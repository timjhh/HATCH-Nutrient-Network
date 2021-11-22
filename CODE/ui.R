library(shiny)
library(ggplot2)
library(tidyverse)
library(dplyr)
library(visNetwork)
library(rsconnect)

fluidPage(
  
  
  fluidRow(column(12, titlePanel("NutriNet Visualizations")
    ,style=('text-align: center;'),),
    
    
    ),
  # fluidRow(
  #   align="center",
  #   style="margin:1%",
  #   actionButton('insertBtn', 'Insert Graph'), 
  #   actionButton('removeBtn', 'Remove Graph'), 
  #   tags$div(id = 'placeholder') 
  # ),
  fluidRow(
    align="center",
    style="margin:1%",
    actionButton('toggleBtn', 'Add Secondary Graph'), 
    tags$div(id = 'placeholder') 
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