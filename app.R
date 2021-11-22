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
library(rsconnect)


# Define UI for application that draws a histogram
ui <- fluidPage(

    #titlePanel("HATCH Project"),

    sidebarPanel(

        uiOutput("countries"),
        uiOutput("countryTypes"),
        uiOutput("countryYears"),
        
        uiOutput("graphType")


    ),

    mainPanel( visNetworkOutput("dGraph"), height = "100%" )
)


# Define server logic required to draw a histogram
server <- function(input, output) {

  
    output$distPlot <- renderPlot({
      

      ggplot(data = agData,
             mapping=aes(x=FAO_CropName, y=Calories))+ geom_area()

    })
   
    

    output$dGraph <- renderVisNetwork({
      
      
      #nutr <- getNutr()
      #nodes <- getNodes()
      
      # Create data frame with nutrients as rows, crops as columns
  
      nodesNutr <- getNodes()
      nodes <- nodesNutr[['nodes']]
      nutr <- nodesNutr[['nutr']]

      MAX_LEN <- 200
      MIN_LEN <- 10
      numNR <- nrow(nodes)-nrow(nutr)
      
      
      
      
        
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
              
              # Constant for maximum link width
              # This will scale strength[0,1] by a scalar factor so
              # stronger connections appear thicker
              nr$width <- nr$strength*7
              
              # Constant edge color
              #nr$color <- "rgba(75, 59, 115,0.6)"
              #nr$color <- "rgba(160,160,160,0.8)"
              nr$color <- "rgba(62,125,196,0.8)"
              
              # Assign a strength based on the maximum
              ### NOTE - A better weighting system will have to be applied, as most links are not strong
              nr$length <- ((MAX_LEN) - (nr$strength * MAX_LEN)) + MIN_LEN
              
              
              # Finally, bind this row to the edge collection
              edges <- dplyr::bind_rows(edges, nr)
              
            }
          }
        }
        

        
        
        if(input$gtype == "Force-Directed") {
          
          

          nodes$font.size = 80
          nodes$size=80          
          
          #
          # To further increase performance, consider placing ', stabilization = FALSE' into visPhysics()
          # Or use option visEdges(smooth = FALSE)
          # Or visEdges(smooth = list(enabled = FALSE, type = "cubicBezier")) %>%
          # 
          visNetwork(nodes, edges, height = 3200, width = "100%",
                     # Append title dynamically from selected country
                     main=paste(input$country, input$ctypes, input$cyears, sep=" | ")) %>%
            visOptions(highlightNearest = list(enabled = TRUE, algorithm="hierarchical", degree=list(from=1,to=1)), 
                       height=dev.size("px")[1]*1.5) %>%
            visEvents(type = "once", afterDrawing = "function() {
            this.moveTo({scale:0.05})}") %>%
            visPhysics(solver = "forceAtlas2Based", stabilization = FALSE,
                       forceAtlas2Based = list(gravitationalConstant = -500, centralGravity=0.05))   
          
          
        } else {
          
          
          
          nodes$font.size = 10
          nodes$font.align = "top"
          nodes$size=10
          
          # Generate random level from [2,4] for more readable hierarchal view
          # randLevel <- function(d) {
          #   if(d != 1) {
          #     d = sample(2:4,1)
          #   }
          #   else {
          #     d = 1
          #   }
          # }
          
          # Generate a level by sorting labels alphabetically
          getLevel <- function(d) {
            if(!d %in% nnames) {
              letter = tolower(substr(d,1,1))
              if(letter < 'g') {
                return(2)
              } else if(letter >= 'g' && letter < 'p') {
                return(3)
              } else {
                return(4)
              }
            } else {
              return(1)
            }
            
          }
          
          nodes$level <- as.numeric(lapply(nodes$label, getLevel))
          
          #nodes$level <- as.numeric(lapply(nodes$level, randLevel))
          
          #
          # To further increase performance, consider placing ', stabilization = FALSE' into visPhysics()
          # Or use option visEdges(smooth = FALSE)
          # Or visEdges(smooth = list(enabled = FALSE, type = "cubicBezier")) %>%
          # 
          visNetwork(nodes, edges, width = "100%",
                     # Append title dynamically from selected country
                     main=paste(input$country, input$ctypes, input$cyears, sep=" | ")) %>%
            visOptions(highlightNearest = list(enabled = TRUE, algorithm="hierarchical", degree=list(from=1,to=1)), 
            height=dev.size("px")[1]*1.5) %>%
            visHierarchicalLayout(direction="LR",levelSeparation = 500,nodeSpacing=10, parentCentralization= FALSE)
          
          
          
        }
        

        

    })
    
    
    getNodes <- reactive({
      
      
      # Load data
      file_ext <- paste(input$country, input$ctypes, input$cyears, sep="_")
      
      
      agData <- read.csv(paste("../DATA_INPUTS/Tabular_data_inputs/",file_ext,".csv",sep=""))
      
      # List of nutrient names
      nnames <- c("Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
                  "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
                  "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only.")
      
      
      nutrients <- as.data.frame(nnames)
      nutrients$group = "N"
      
      nutrients <- rename(nutrients, Nutrient = nnames)
      
      
      # Optional hard-coded nutrient selection
      #nutrients <- data.frame(names(agData[12:37]), group="N")
      
      #colnames(nutrients) <- c("Nutrient", "group")
      agData$group = "C"
      agData$level = 2
      
      
      
      
      # Maximum length of edges
      MAX_LEN <- 100
      MIN_LEN <- 10
      
      
      # num of unique crops in data set
      numNR <- nrow(agData)
      #numNR <- nrow(nodes)-nrow(nutr)
      
      # Assign unique id # to each, for binding to edges
      agData$Nutrient = agData$FAO_CropName
      agData <- agData %>% rename(id = X)
      
      # Do the same for each nutrient
      nutrients$id = 0
      nutrients$level = 1
      nutrients <- nutrients %>% mutate(id = (numNR+1):(n()+numNR))
      
      
      # Unique id #s for crop data
      agList <- as.list(agData$id)
      
      nn <- dplyr::bind_rows(nutrients, agData)
      

      
      nodes <- data.frame(
        id = nn$id,
        level = nn$level,
        label = nn$Nutrient,
        group = nn$group,
        font.strokeWidth = 4
        
      )
      
      nutr <- as.data.frame(t(agData %>% select(all_of(nnames))))
      colnames(nutr) <- as.list(agData$FAO_CropName)
      
      # Return nodes
      list(nodes=nodes,nutr=nutr)
      
      
    })
    
    
    
    
    
    
    
    
    
    getNutr <- reactive({

      
      # Load data
      file_ext <- paste(input$country, input$ctypes, input$cyears, sep="_")
      
      
      agData <- read.csv(paste("../DATA_INPUTS/Tabular_data_inputs/",file_ext,".csv",sep=""))
      
      # List of nutrient names
      nnames <- c("Calories", "Protein", "Fat", "Carbohydrates", "Vitamin.C", "Vitamin.A", "Folate", "Calcium", "Iron", "Zinc", "Potassium", 
                  "Dietary.Fiber", "Copper", "Sodium", "Phosphorus", "Thiamin", "Riboflavin", "Niacin", "B6", "Choline",
                  "Magnesium", "Manganese", "Saturated.FA", "Monounsaturated.FA", "Polyunsaturated.FA", "Omega.3..USDA.only.", "B12..USDA.only.")
      
      
      nutrients <- as.data.frame(nnames)
      nutrients$group = "N"
      
      nutrients <- rename(nutrients, Nutrient = nnames)
      
      
      # Optional hard-coded nutrient selection
      #nutrients <- data.frame(names(agData[12:37]), group="N")
      
      #colnames(nutrients) <- c("Nutrient", "group")
      agData$group = "C"
      agData$level = 2
      
      
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
      nutrients$level = 1
      nutrients <- nutrients %>% mutate(id = (numNR+1):(n()+numNR))
      
      
      # Unique id #s for crop data
      agList <- as.list(agData$id)
      
      nn <- dplyr::bind_rows(nutrients, agData)
      
      
      
      # Create data frame with nutrients as rows, crops as columns
      
      nutr <- as.data.frame(t(agData %>% select(all_of(nnames))))
      colnames(nutr) <- as.list(agData$FAO_CropName)
      
      
      nutr
      
      
      
    })
    
    
    output$table <- renderDataTable(agData)
    
    output$ntable <- renderDataTable(nodes)
    
    
    

    
    
    ###
    ### GET AVAILABLE FILE OPTIONS
    ### STRIP EXTENSIONS FROM FILE NAMES
    ###
    allFiles <- tools::file_path_sans_ext(list.files("../DATA_INPUTS/Tabular_data_inputs/"))
    
    # Function to get the country name from a string
    # By splitting with our separator _ and returning the first word
    getToken <- function(d, idx) {
      unlist(strsplit(d, '_'))[idx]
    }

      # Dynamic UI rendering for country types
      output$countries <- renderUI({
        
        # Get unique countries from all file list
        countries <- unique(lapply(allFiles, getToken, idx = 1))
        
        # Render only if countries exist in list
        if(length(countries) > 0) {
          selectInput('country','Select Country',countries)
        }
        
      })
    
      # Dynamic UI rendering for country types
      output$countryTypes <- renderUI({

      # Get selected country
      selected <- input$country

      # Find all files for each country
      possible <- grep(selected, allFiles, value=TRUE)

      # Find unique file types from the second token in each string
      ctypes <- unique(lapply(possible, getToken, idx = 2))
      
      # Render only if elements exist
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
      
        # Render only if elements exist
        if(length(cyears) > 0) {
          selectInput('cyears','Select Year',cyears)
        }
      

      })
    
    # Dynamic UI rendering for years
    output$graphType <- renderUI({
      
      radioButtons('gtype', 'Graph Type', c('Bipartite', 'Force-Directed'),
          'Bipartite', inline=TRUE) 

      
      
    })
    
    
    
}

# Run the application 
shinyApp(ui = ui, server = server)
