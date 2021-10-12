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
nutrients <- data.frame(names(agData[12:37]), group="N")
colnames(nutrients) <- c("Nutrient", "Group")
agData$Group <- "C"

numNR <- nrow(agData)
agData$id = 0
agData$Nutrient = agData$FAO_CropName
agData <- agData %>% mutate(id = 1:n())
nutrients$id = 0
nutrients <- nutrients %>% mutate(id = (numNR+1):(n()+numNR))

nn <- dplyr::bind_rows(agData, nutrients)




# Define graph nodes
nodes <- data.frame(
  id = nn$id,
  label = nn$Nutrient,
  group = nn$Group
  )


# Define graph edges
edges <- data.frame(
  from = nutrients$id,
  Group = nutrients$Group,
  Nutrient = nutrients$Nutrient
  
)

edges <- edges %>%
  group_by(id) %>%
  summarise(to = seq(1, numNR, 1))

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
      
      visNetwork(nodes, edges, height = "500px", width = "100%", main="Bipartite Graph") %>%
        #visHierarchicalLayout(sortMethod = "hubsize", direction = "LR") 
        visPhysics(solver = "forceAtlas2Based",
                   forceAtlas2Based = list(gravitationalConstant = -500))
      
    })
    
    
    output$table <- renderDataTable(agData)
    
    output$ntable <- renderDataTable(nodes)
    
}

# Run the application 
shinyApp(ui = ui, server = server)
