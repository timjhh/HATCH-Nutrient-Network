require(dplyr)
require(tidyverse)


df <- lapply(paste('ie/', list.files(path='ie/'), sep =''), read_csv) %>% 
  bind_rows

write.csv(df, "FAO_pie_1980_2020.csv")