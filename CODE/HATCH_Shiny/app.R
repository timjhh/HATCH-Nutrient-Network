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
nutrients <- data.frame(names(agData[12:37]), Group="N")

colnames(nutrients) <- c("Nutrient", "Group")
agData$Group <- "C"

# List of nutrient names
# Note: This MANUALLY reads in cols 12:37, it is not a smart search
# This will need to be adjusted if data is adjusted
nnames <- names(agData[12:37])

# num of unique crops in data set
numNR <- nrow(agData)

# Assign unique id # to each, for binding to edges
agData$Nutrient = agData$FAO_CropName
agData <- agData %>% rename(id = X)


# Do the same for each nutrient
nutrients$id = 0
nutrients <- nutrients %>% mutate(id = (numNR+1):(n()+numNR))

# Unique id #s for crop data
agList <- list(agData$id)

nn <- dplyr::bind_rows(agData, nutrients)

# tmp <- data.frame(
#   from = nutrients$id,
#   Group = nutrients$Group,
#   Nutrient = nutrients$Nutrient,
#   value=8
# )

# Define graph nodes
nodes <- data.frame(
  id = nn$id,
  label = nn$Nutrient,
  group = nn$Group,
  value = 6
)

# # O(N^2) loop to create edges
# # Find each instance of nutrient, find its associated value and bind new row to edges
# for(i in 1:nrow(tmp)) {
#   for(j in 1:nrow(agData)) {
#     
#     strength <- agData[j,i+11]
#     if(!(is.na(strength)) && strength > 0) {
#       
#       nr <- tmp[i,]
#       
#       nr$to <- agData[j,"id"]
#       
#       
#       # What amount of nutrient does this crop have
#       # NOTE: 11 is hardcoded, consider replacing with computed value
#       nr$strength <- agData[j,i+11]  
#       
#       edges <- dplyr::bind_rows(edges, nr)
#       
#     }
#     
#   }
# }
nutr <- as.data.frame(t(agData[12:37]))
colnames(nutr) <- as.list(agData$FAO_CropName)
nutr <- cbind(nnames, nutr)

edges <- data.frame()

for(i in 1:nrow(nutr)) {
  for(j in 2:ncol(nutr)) {
    
    
    strength <- nutr[i,j]
    if(!(is.na(strength)) && strength > 0) {
      
      nr <- nutr[i,]
      nr$from <- i+numNR
      nr$to <- j
      
      
      edges <- dplyr::bind_rows(edges, nr)
      
    }
    
    
  }
}


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
      
      visNetwork(nodes, edges, height = "1000px", width = "100%", main="Bipartite Graph") %>%
        #visHierarchicalLayout(sortMethod = "hubsize", direction = "LR") 
        visPhysics(solver = "forceAtlas2Based",
                   forceAtlas2Based = list(gravitationalConstant = -500))
      
    })
    
    
    output$table <- renderDataTable(agData)
    
    output$ntable <- renderDataTable(nodes)
    
}

# Run the application 
shinyApp(ui = ui, server = server)
