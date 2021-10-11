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
library(dplyr)
source("directed_graph.R")


# Load data
agData <- read.csv("../../DATA_INPUTS/Spatial_data_inputs/Afghanistan_ImportsGlobalConstrained_2019.csv")

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

        #Show a plot of the generated distribution
        mainPanel(
           plotOutput("distPlot")
        )
    )
)

# Define server logic required to draw a histogram
server <- function(input, output) {

  

    agData

  
    output$distPlot <- renderPlot({
      
      ggplot(data = agData,
             mapping=aes(x = Country, y=FAO_CropName))+ geom_bar()
      #x <- as.numeric(data$Potassium)
      #bins <- seq(min(x), max(x), length.out = input$bins + 1)
    
      #hist(x, breaks = bins, col = 'darkgray', border = 'white')
    })


}

# Run the application 
shinyApp(ui = ui, server = server)
