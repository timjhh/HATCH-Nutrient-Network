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



# Define UI for application that draws a histogram
ui <- fluidPage(

    titlePanel("HATCH Project"),

    sidebarPanel(

        
        uiOutput("countries"),
        uiOutput("countryTypes"),
        uiOutput("countryYears")
    # selectInput('selectfile','Select Country',input$countries),

    ),
    mainPanel( visNetworkOutput("dGraph") )
    
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
   

    output$dGraph <- renderVisNetwork({

    visNetwork(nodes, edges, height = "100%", width = "100%", main="HATCH Graph") %>%
        visOptions(highlightNearest = TRUE,
               selectedBy = list(
                 variable = "Themes",
                 style = "width:500px",
                 values = c("cars", "train", "walk", "bike", "bus", "car"),
                 multiple = TRUE
                   
               )
                   
                   
                   
                   ) %>%
        visHierarchicalLayout(sortMethod = "directed",levelSeparation = 750,nodeSpacing=200, parentCentralization= FALSE)
        #visPhysics(solver = "forceAtlas2Based",
        # forceAtlas2Based = list(gravitationalConstant = -500, centralGravity=0.05))

    }) 
    
    output$dInput <- reactive({
      paste0('You have selected: ', input$selectfile)

    })
    
    output$table <- renderDataTable(agData)
    
    output$ntable <- renderDataTable(nodes)
    
    
    
    
    
    # Load data
    #agData <- read.csv("../../DATA_INPUTS/Tabular_data_inputs/Afghanistan_ImportsGlobalConstrained_2019.csv")
    #agData <- read.csv("../../DATA_INPUTS/Tabular_data_inputs/Algeria_Production_2019.csv")
    #agData <- read.csv("../../DATA_INPUTS/Tabular_data_inputs/Mexico_Production_2019.csv")
    
    agData <- read.csv("../../DATA_INPUTS/Tabular_data_inputs/Madagascar_ProductionImportsGlobalConstrained_2019.csv")
    
    
    # List of nutrient names
    nnames <- c("Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
                "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
                "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only.")
    
    #nutrients <- agData %>% select(all_of(nnames))
    nutrients <- as.data.frame(nnames)
    nutrients$group = "N"
    #nutrients$Nutrient <- agData$nnames
    nutrients <- rename(nutrients, Nutrient = nnames)
    #names(nutrients)[1] <- "Label"
    
    # Optional hard-coded nutrient selection
    #nutrients <- data.frame(names(agData[12:37]), group="N")
    
    #colnames(nutrients) <- c("Nutrient", "group")
    agData$group = "C"
    agData$level = 1
    
    
    # Maximum length of edges
    MAX_LEN <- 100
    MIN_LEN <- 10
    
    
    
    # num of unique crops in data set
    numNR <- nrow(agData)
    
    # Assign unique id # to each, for binding to edges
    agData$Nutrient = agData$FAO_CropName
    agData <- agData %>% rename(id = X)
    
    # Do the same for each nutrient
    nutrients$id = 0
    nutrients$level = 2
    nutrients <- nutrients %>% mutate(id = (numNR+1):(n()+numNR))
    
    
    # Unique id #s for crop data
    agList <- as.list(agData$id)
    
    nn <- dplyr::bind_rows(nutrients, agData)
    
    
    # Define graph nodes
    nodes <- data.frame(
      id = nn$id,
      label = nn$Nutrient,
      group = nn$group,
      font.size = 40,
      size=50
      
    )
    
    
    
    # Create data frame with nutrients as rows, crops as columns
    
    nutr <- as.data.frame(t(agData %>% select(all_of(nnames))))
    colnames(nutr) <- as.list(agData$FAO_CropName)
    
    
    # Name the new crop columns
    #colnames(nutr) <- as.list(agData$FAO_CropName)
    #nutr <- cbind(nnames, nutr)
    
    # Create shell for edges data with column names
    edges <- data.frame(matrix(ncol=3,nrow=0, dimnames=list(NULL, c("from", "to", "strength"))))
    
    for(i in 1:nrow(nutr)) {
      
      
      # Select each nutrient row, remove missing values
      nums <- unlist(nutr[i,])
      nums <- nums[!is.na(nums)]
      
      # Find the maximum of each link to adjust the edge length accordingly
      maximum <- max(nums)
      minimum <- min(nums)
      
      # To normalize the data, we'll need
      stddev <- sd(nums)
      mean <- mean(nums)
      
      
      for(j in 1:(ncol(nutr))) {  
        
        # Strength is the intersection of:
        # i - The nutrient
        # j - The crop
        str <- nutr[i,j]
        
        # Check for validity / existence of this node
        if(!(is.na(str)) && as.numeric(str) > 0) {
          
          # Create a new row with the nutrient information
          nr <- nutr[i,]
          
          # The link will come from a nutrient
          nr$from <- i+numNR
          
          # The link will lead to a crop
          nr$to <- j
          
          # This is the cell connecting [crop,nutrient], how much one contains
          nr$strength <- (str / maximum)
          
          #Alternatively, normalize the data point by its nutritional value
          #nr$strength <- (str-minimum)/(maximum-minimum)
          
          
          
          
          # Assign a strength based on the maximum
          ### NOTE - A better weighting system will have to be applied, as most links are not strong
          nr$length <- ((MAX_LEN/2) - (nr$strength * MAX_LEN)) + MIN_LEN
          
          
          # Finally, bind this row to the edge collection
          edges <- dplyr::bind_rows(edges, nr)
          
        }
      }
    }
    
    
    ###
    ### GET AVAILABLE FILE OPTIONS
    ###
    allFiles <- tools::file_path_sans_ext(list.files("../../DATA_INPUTS/Tabular_data_inputs/"))
    
    # Function to get the country name from a string
    # By splitting with our separator _ and returning the first word
    getToken <- function(d, idx) {
      unlist(strsplit(d, '_'))[idx]
    }

    # Dynamic UI rendering for country types
    output$countries <- renderUI({
      countries <- unique(lapply(allFiles, getToken, idx = 1))
      selectInput('country','Select Country',countries)
    })
    
    # Dynamic UI rendering for country types
    output$countryTypes <- renderUI({

      # Get selected country
      selected <- input$country

      # Find all files for each country
      possible <- grep(selected, allFiles, value=TRUE)

      # Find unique file types from the second token in each string
      ctypes <- unique(lapply(possible, getToken, idx = 2))
      
      if(length(ctypes) > 0) {
        selectInput('ctypes','Select Type',ctypes)
      }
    })
    
    
    
    
    # Dynamic UI rendering for years
    output$countryYears <- renderUI({
      
      # Get selected country
      selectedC <- input$country
      selectedT <- input$ctypes
      
      # Find all files for each country
      possibleC <- grep(selectedC, allFiles, value=TRUE)
      
      # Find all years for each type
      possible <- grep(selectedT, possibleC, value=TRUE)
      
      # Find unique file types from the second token in each string   
      cyears <- unique(lapply(possible, getToken, idx = 3))
    
      
      if(length(cyears) > 0) {
        selectInput('cyears','Select Year',cyears)
      }
      

          })
    
  
    
    
    
    
    
    
    
    
    
    
}

# Run the application 
shinyApp(ui = ui, server = server)
