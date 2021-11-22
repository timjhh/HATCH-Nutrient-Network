directed_graph <- function() {
  
  library(ggplot2)
  library(dplyr)
  
  agData <- read.csv("../../DATA_INPUTS/Spatial_data_inputs/Afghanistan_ImportsGlobalConstrained_2019.csv")
  
  ggplot(data = agData,
         mapping=aes(x = Country, y=FAO_CropName))+ geom_bar()
  
}
