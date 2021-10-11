#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(ggplot2)
library(tidyverse)
library(dplyr)
library(visNetwork)
source("directed_graph.R")


# Load data
agData <- read.csv("../../DATA_INPUTS/Spatial_data_inputs/Afghanistan_ImportsGlobalConstrained_2019.csv")

# Define graph nodes
nodes <- data.frame(
  id=agData$X,
  label = toString(agData$X),
  group=nchar(agData$FAO_CropName))



# Define UI for application that draws a histogram
ui <- fluidPage(

    # Application title
    titlePanel("HATCH Project"),

    # Sidebar with a slider input for number of bins 
    sidebarLayout(
        sidebarPanel(
            sliderInput("bins",
                        "Number of bins:",
                        min = 1,
                        max = 50,
                        value = 30)
        ),
        sidebarPanel(
          fluidRow(
            column(12,
                   dataTableOutput('table')
            )
           )
        )
    ),
        #Show a plot of the generated distribution
        mainPanel(
           plotOutput("dGraph")
        )
    
)

# Define server logic required to draw a histogram
server <- function(input, output) {

    
  
    output$distPlot <- renderPlot({
      

      ggplot(data = agData,
             mapping=aes(x=FAO_CropName, y=Calories))+ geom_area()
      #x <- as.numeric(data$Potassium)
      #bins <- seq(min(x), max(x), length.out = input$bins + 1)
    
      #hist(x, breaks = bins, col = 'darkgray', border = 'white')
    })
   

    output$dGraph <- renderPlot({
      
      visNetwork(nodes, height = "500px", width = "100%", main="Bipartite Graph") %>%
        visPhysics(solver = "forceAtlas2Based", 
                   forceAtlas2Based = list(gravitationalConstant = -500))
      
    })
    
    
    output$table <- renderDataTable(agData)
    
    
}

# Run the application 
shinyApp(ui = ui, server = server)
