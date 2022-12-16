#### HATCH OBJECTIVE 1: Data cleaning ####
### 23/6/2021 CCN 
rm(list = ls(all=TRUE))

#### Dependencies ####
require(WDI)
require(wbstats)
require(tidyverse)


#### Data inputs ####
faoProd.raw <- read.csv("YOUR_PRODUCTION_CSV.csv",
                            stringsAsFactors = F)
faoImpExp.raw <- read.csv("YOUR_ImExPORT_CSV.csv",
                              stringsAsFactors = F)
pop.raw <- read.csv("YOUR_Population_CSV.csv",
                        stringsAsFactors = F)

FCT.raw <- read.csv("Data/Raw_data/FoodCompositionTable.csv",
                    stringsAsFactors = F)%>% dplyr::select(-X)

foodNames.df <- read.csv("Data/Raw_data/FoodNames_FAOGENuS_LookupTable.csv",
                         stringsAsFactors = F) %>% dplyr::select(-X)

CountryGroups.df <- read.csv("Data/Raw_data/FAOSTAT_CountryGroup_data_6-25-2021.csv",
                             stringsAsFactors = F)
servingSize.df <- read.csv("Data/Raw_data/ServingSizes_FAOGENuS_LookupTable.csv",
                           stringsAsFactors = F)%>% dplyr::select(-X)

#### Cleaning ####

### Clean country names ###
# Create a vector of countries in prodcution data
Countries.vec <- unique(faoProd.raw$Area)

# Country group data
CountryCodes.df <- CountryGroups.df %>% 
  filter(Country %in% Countries.vec) %>% # filter to only those countries w/ prodcution data
  filter(Country.Group == "World") %>% # drop other group categories
  filter(!is.na(M49.Code)) # Filter to only those countries with M49 codes, drops "China"

### Clean population data ###
pop.df <- pop.raw %>% 
  dplyr::rename(Country = Area) %>%
  filter(Country %in% Countries.vec) %>% # filter to only those countries w/ prodcution data
  mutate(Population = Value * 1000) %>% # convert from "1000 persons"
  dplyr::select(Year, Country, Country_FAOcode = `Area.Code..FAO.`,
                Population) %>% 
  arrange(Country, desc(Population))

### Clean food item data

### Drop non-edible crop foods ###
# There are many more crops and crop products listed in the import export database
# need to harmonize these via crosswalk lookup table

# As we only concerned with crop products available for human consumption
#There are some products that should be removed
# also removing animal products, as our focus is crops
foodProduct.vec <- sort(unique(c(faoImpExp.raw$Item, 
                                 faoProd.raw$Item)))

dropTerms <- paste(c("Meat", "meat", "Bacon", "Eggs", "Fat", "Cream", "Whey", "Buttermilk", "Milk", "Butter", "Cheese", "Yoghurt", "Lactose",
                     "liver", "Offals", "Lard", "Tallow", "Grease", "Honey, natural",
                     "Hides", "Skins", "Wool", "Silk", "Hair", "animal", "Beeswax",
                     "fibre", "Ramie", "Sisal", "Coir", "Hemp", "Jute", "Silk-worm", "unreelable", "Rubber", "Fibre", "Cotton ", "Cotton,",
                     "Dregs", "husks", "Waters", "Waxes vegetable", 
                     "Tobacco", "Pyrethrum", "Cigars", "Cigarettes", 
                     "Hay", "Forage products", "Canary seed", "Feed", "Pet food", 
                     "Wine", "Hops", "Vermouths & similar", "Beverages, non alcoholic", "Beverages, fermented rice", "Beverages, distilled alcoholic", "Beer of barley",
                     "Molasses", "Malt", "Maple sugar and syrups", #"Sugar", 
                     "Areca nuts", "Tung nuts", "Oil, castor beans", "Oil, citronella", "Oil, essential nes",
                     "Bread", "Wafers", "Pastry", "Cereals, breakfast", "Mixes and doughs", "Macaroni", 
                     "Infant food", "Food prep", "Food wastes", "Ice cream and edible ice"),
                   collapse = "|", sep = "")

dropProducts.vec <- foodProduct.vec[grepl(dropTerms, foodProduct.vec)]
foodProduct.vec <- foodProduct.vec[!grepl(dropTerms, foodProduct.vec)]

### Clean serving size data

# Are all the serving size cropID in our FAO production data?
servingSize.df %>% filter(!FAO_CropName %in% foodProduct.vec) %>% arrange(FAO_CropName) # fix this name below

# Are all the FAO cropIDs in our serving size data?
foodProduct.vec[!foodProduct.vec %in% servingSize.df$FAO_CropName] # No, but this is bc we matched on GENuS product names 

# What import products are not in production data?  Lots of derived and processed products. We should include dried fruits and shelled things
prodFood.vec <- sort(unique(faoProd.raw$Item))

impoFood.vec <- sort(unique((faoImpExp.raw %>%
                               filter(Item %in% foodProduct.vec) %>% # Drop non-edible crops and animal products
                               filter(Element == "Import Quantity"))$Item))

impoOnly.df <- data.frame(importItem = sort(impoFood.vec[!impoFood.vec %in% prodFood.vec]))

# What produced foods are not in import data? 

prodOnly.df <- data.frame(prodItem = sort(prodFood.vec[!prodFood.vec %in% impoFood.vec]))

### Clean Production data ###

Prod.df <- faoProd.raw %>% 
  dplyr::rename(Country = Area,
                Country_FAOcode = `Area.Code..FAO.`) %>%
  left_join(CountryCodes.df) %>% 
  left_join(pop.df) %>% 
  left_join(servingSize.df, by = c("Item" = "FAO_CropName")) %>% 
  filter(Item %in% foodProduct.vec) %>% # Drop non-edible crops and animal products
  filter(!is.na(M49.Code)) %>% # drop "China" bc inclusive of SARs :(
  filter(!is.na(Value)) %>% # drop NA production values
  filter(Value != 0) %>% # drop o production values
  mutate(Production_kg = Value * 1000) %>% # convert tonnes to kg
  dplyr::select(Year, 
                Country, Country_FAOcode,
                M49.Code, ISO2.Code, ISO3.Code,
                FAO_CropName = Item, FAO_CropID = `Item.Code..FAO.`,
                Production_kg, servingSize_g, Population) %>% 
  arrange(Country, desc(Production_kg))

## IMPORTANT. To filter import and export crops to those produced locally we create a vector of only those food items produced
prodCrops.vec <- sort(unique(Prod.df$FAO_CropName))

### Clean imports and exports data ###

# Import dataframe
Imports.df <- faoImpExp.raw %>% 
  dplyr::rename(Country = Area,
                Country_FAOcode = `Area.Code..FAO.`) %>%
  # There are a few crop names for import data that dont have matches in production data, and get filtered out below. Need to rename to match prod names
  mutate(Item = ifelse(Item == "Almonds shelled", "Almonds, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Apricots, dry", "Apricots", Item)) %>%
  mutate(Item = ifelse(Item == "Brazil nuts, shelled", "Brazil nuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Cassava dried", "Cassava", Item)) %>%
  mutate(Item = ifelse(Item == "Cashew nuts, shelled", "Cashew nuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Cottonseed", "Seed cotton", Item)) %>%
  mutate(Item = ifelse(Item == "Figs dried", "Figs", Item)) %>%
  mutate(Item = ifelse(Item == "Groundnuts, shelled", "Groundnuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Hazelnuts, shelled", "Hazelnuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Oil, palm", "Oil palm fruit", Item)) %>%
  mutate(Item = ifelse(Item == "Plums dried (prunes)", "Plums and sloes", Item)) %>%
  mutate(Item = ifelse(Item == "Sugar Raw Centrifugal", "Sugar cane", Item)) %>%
  mutate(Item = ifelse(Item == "Walnuts, shelled", "Walnuts, with shell", Item)) %>%
  left_join(CountryCodes.df) %>% 
  left_join(pop.df) %>% 
  left_join(servingSize.df, by = c("Item" = "FAO_CropName")) %>% 
  filter(Element == "Import Quantity") %>% # Isolate import crop foods
  
  #filter(Item %in% foodProduct.vec) %>% # Drop non-edible crops and animal products (create unconstrained imports)
  filter(Item %in% prodCrops.vec) %>%  # Drop those crop foods that are not in production (create global constrained imports)
  
  filter(!is.na(M49.Code)) %>% # drop "China" bc inclusive of SARs 
  filter(!is.na(Value)) %>% # drop NA production values
  filter(Value != 0) %>% # drop 0 production values
  mutate(Import_kg = Value * 1000) %>%  # convert tonnes to kg
  dplyr::select(Year, 
                Country, Country_FAOcode,
                M49.Code, ISO2.Code, ISO3.Code,
                FAO_CropName = Item, FAO_CropID = `Item.Code..FAO.`,
                Import_kg, servingSize_g, Population) %>% 
  arrange(Country, desc(Import_kg))

unique(Imports.df$FAO_CropName)
hist(log(Imports.df$Import_kg))

# Export dataframe
Exports.df <- faoImpExp.raw %>% 
  dplyr::rename(Country = Area,
                Country_FAOcode = `Area.Code..FAO.`) %>%
  # There are a few crop names for import data that dont have matches in production data, and get filtered out below. Need to rename to match prod names
  mutate(Item = ifelse(Item == "Almonds shelled", "Almonds, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Apricots, dry", "Apricots", Item)) %>%
  mutate(Item = ifelse(Item == "Brazil nuts, shelled", "Brazil nuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Cassava dried", "Cassava", Item)) %>%
  mutate(Item = ifelse(Item == "Cashew nuts, shelled", "Cashew nuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Cottonseed", "Seed cotton", Item)) %>%
  mutate(Item = ifelse(Item == "Figs dried", "Figs", Item)) %>%
  mutate(Item = ifelse(Item == "Groundnuts, shelled", "Groundnuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Hazelnuts, shelled", "Hazelnuts, with shell", Item)) %>%
  mutate(Item = ifelse(Item == "Oil, palm", "Oil palm fruit", Item)) %>%
  mutate(Item = ifelse(Item == "Plums dried (prunes)", "Plums and sloes", Item)) %>%
  mutate(Item = ifelse(Item == "Sugar Raw Centrifugal", "Sugar cane", Item)) %>%
  mutate(Item = ifelse(Item == "Walnuts, shelled", "Walnuts, with shell", Item)) %>%
  
  left_join(CountryCodes.df) %>% 
  left_join(pop.df) %>% 
  left_join(servingSize.df, by = c("Item" = "FAO_CropName")) %>% 
  filter(Element == "Export Quantity") %>% # Isolate export crop foods
  
  filter(Item %in% foodProduct.vec) %>% # Drop non-edible crops and animal products
  #filter(Item %in% prodCrops.vec) %>%  # Drop those crop foods that are not in production
  
  filter(!is.na(M49.Code)) %>% # drop "China" bc inclusive of SARs :(
  filter(!is.na(Value)) %>% # drop NA production values
  filter(Value != 0) %>% # drop o production values
  mutate(Export_kg = Value * 1000) %>% # convert tonnes to kg
  dplyr::select(Year, 
                Country, Country_FAOcode,
                M49.Code, ISO2.Code, ISO3.Code,
                FAO_CropName = Item, FAO_CropID = `Item.Code..FAO.`,
                Export_kg, servingSize_g, Population) %>% 
  arrange(Country, desc(Export_kg))



#### COMBINE PRODUCTION & IM/EXPORT & PRODUCTION+IMPORTS DATA

foodSourceWide.df <-Prod.df %>% 
  full_join(Exports.df) %>% 
  full_join(Imports.df) ### TODO check output

foodSourceLong.df <- foodSourceWide.df%>% 
  pivot_longer(
    cols = c("Production_kg", "Export_kg", "Import_kg"),
    names_to = "Source",
    values_to = "AmountCrop_kg")%>% 
  filter(!is.na(AmountCrop_kg)) 


### We also want to evaluate production + imports.
### to do this we create a separate Production + Imports long df and bidn it below
ProductionImportsCountry.df <- foodSourceLong.df %>% 
  filter(str_detect(Source, "Import_kg|Production_kg")) %>%
  filter(FAO_CropName %in% prodCrops.vec) %>%  # Produces an inner constraint on crops considered. Drop those crop foods that are not in local production
  mutate(ISO3.Code = replace(ISO3.Code, ISO2.Code == "CN", "CHN")) %>%  # Add China's ISO3 code, bc somehow it got dropped
  group_by(Year, Country, Country_FAOcode, M49.Code, ISO2.Code, ISO3.Code, 
           FAO_CropName, FAO_CropID, servingSize_g, Population) %>%
  summarise(AmountCrop_kg = sum(AmountCrop_kg, na.rm = T)) %>%
  mutate(Source = "ProductionImport_kg") %>% 
  dplyr::select(Year, Country, 
                M49.Code, ISO2.Code, ISO3.Code, 
                FAO_CropName, Source,
                Population, AmountCrop_kg)

### Rbind the production+import df to the PIE long data
foodSourceLong.df <- foodSourceLong.df %>% 
  bind_rows(ProductionImportsCountry.df)

#### Combine long PIE data with nutrient information
foodNutrientsLong.df <- foodSourceLong.df%>% 
  left_join(foodNames.df, by = "FAO_CropName") %>% 
  left_join(FCT.raw, by = c("GENuS_FoodName", "GENuS_FoodID")) %>% 
  mutate_at(vars(Calories:Refuse), ~.*amount*1000)%>% # raw amount of nutrients in grams
  mutate_at(vars(Calories:Refuse), ~./1000)


# Export this as non-thresholded for graph
#write.csv(foodSourceLong.df, "Data/Data_outputs/ProductionEtc_dataframes/fao1980_2020_Prod_P_I_PI_long.csv")
#write.csv(foodNutrientsLong.df, "Data/Data_outputs/ProductionEtc_dataframes/fao1980_2020_NutrientProd_P_I_PI_long.csv")


#### GENERATE LONG FORMAT SOCIO-ECON-NUTRITION AMOUNT DATAFRAME ####
names(foodSourceLong.df)

### Get MacroEcon data from World Bank
WDIsearch("gdp.*capita.*US\\$")
WDIsearch("life expectancy at birth.*total")
WDIsearch("^mortality.*rate.*infant")

WBEcon.df <- WDI(indicator = c("NY.GDP.PCAP.KD",  # GDP
                               "SP.DYN.LE00.IN", # Lie expectancy
                               "SP.DYN.IMRT.IN"), # Infant mortality
                 #country=c('MX','CA','US'),
                 extra = T,
                 start=1980, end=2020) %>% 
  filter(region != "Aggregates") %>% 
  mutate(GDP = NY.GDP.PCAP.KD,
         life_expectancy = SP.DYN.LE00.IN,
         infant_mortality = SP.DYN.IMRT.IN) %>% 
  dplyr::select(Year = year, ISO3.Code = iso3c,
                income, GDP, life_expectancy, infant_mortality)


### Create df of nutrients, crop production and socio-econ factors
nutriAmountCountry.df <- foodSourceLong.df %>%
  filter(!is.na(amount)) %>% # Drop any entries where a crop was neither produced or imported in a country
  #filter(Source != "Export_kg") %>% 
  mutate(ISO3.Code = replace(ISO3.Code, ISO2.Code == "CN", "CHN")) %>%  # Add China's ISO3 code, bc somehow it got dropped
  group_by(Year, Country, M49.Code, ISO2.Code, ISO3.Code, FAO_CropName, Source, Population) %>%
  summarise(AmountCrop_kg = sum(amount, na.rm = T)) %>%
  left_join(WBEcon.df) %>%
  left_join(foodNames.df) %>%
  left_join(FCT.raw) %>%
  arrange(Country) %>%   
  dplyr::select(-`Omega.3..USDA.only.`) %>%
  mutate_at(vars(Calories:Refuse), ~.*AmountCrop_kg*1000)%>% # raw amount of nutrients in grams
  mutate_at(vars(Calories:Refuse), ~./1000)

  # mutate_at(vars(Calories:Refuse), ~./1000000) %>% # convert mg to kg
  # mutate_at(vars(Calories:Refuse), ~.*AmountCrop_kg) %>%
  pivot_longer(cols = c(Calories:Refuse),
               names_to = "Nutrient",
               values_to = "AmountNutri_kg") %>% 
  group_by(Year, Country, M49.Code, ISO2.Code, ISO3.Code, Source, Nutrient, 
           income, Population, GDP, life_expectancy, infant_mortality) %>%
  summarise(AmountTotalNutri_kg = sum(AmountNutri_kg, na.rm = T),
            AmountTotalCrop_kg = sum(AmountCrop_kg, na.rm = T), 
            CropRichness = n_distinct(FAO_CropName)) %>% 
  pivot_wider(names_from = Nutrient, 
              names_prefix = "Kg_",
              values_from = AmountTotalNutri_kg)


#write.csv(nutriAmountCountry.df, "Data/Data_outputs/ProductionEtc_dataframes/SocioEconNutri.csv")

