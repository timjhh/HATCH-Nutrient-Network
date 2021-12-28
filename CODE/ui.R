library(shiny)
library(ggplot2)
library(tidyverse)
library(dplyr)
library(visNetwork)
library(rsconnect)

fluidPage(
  
  

  fluidRow(
    
    titlePanel("NutriNet Visualizations"),
    align="center",
    style="margin:1%",
    #actionButton('toggleBtn', 'Add Secondary Graph'), 
    uiOutput("showTwo")
    #tags$div(id = 'placeholder') 
  ),
  
  # MAIN FLUID ROW
  fluidRow(
  
  uiOutput("mainBox"),
  # BEGIN FIRST GRAPH

  # END FIRST GRAPH
  

  # BEGIN SECOND GRAPH

  
  column(width=6,
  conditionalPanel(
    condition = ("input.showTwo"),
    fluidRow(
      style=('background-color:coral;
      display:flex; flex-wrap:wrap; margin:1%; padding:2%;'),
      uiOutput("countries2"),
      uiOutput("countryTypes2"),
      uiOutput("countryYears2"),
      uiOutput("graphType2")

    )
  ),
    fluidRow(
    conditionalPanel(
      condition = ("input.showTwo"),
      column(width=12 , visNetworkOutput("dGraph2")
             ,style=('text-align: center;'))

    )
  )
  )

  )
)



