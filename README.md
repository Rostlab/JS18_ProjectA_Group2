## JS18_ProjectA_Group2

[![Build Status](https://travis-ci.org/Rostlab/JS18_ProjectA_Group2.svg?branch=develop)](https://travis-ci.org/Rostlab/JS18_ProjectA_Group2)

### Requirements

Your system must have support for below stuff:

- NodeJS.
- Python 2.7.
- MySQL.
- A Modern Browser.

### Set Up

- Install fresh rasa_nlu instance in the root directory. **JS18_ProjectA_Group2**
   
- Install [Rasa_NLU](https://nlu.rasa.com) from *[here](https://github.com/jyotirmay123/nlp_engine)*
    
  [ Don"t clone Rasa_NLU original git repo as it contains different version than what we use ]
  
  Follow below steps:
  
  - git clone https://github.com/jyotirmay123/nlp_engine.git
  - cd nlp_engine
  - pip install -r requirements.txt
  - pip install -e .
  - cd ..
  - cp -R projects nlp_engine
  
### Database Configuration

- Install MySql server.
- Create a database with name **igraph**
- Import **JS18_ProjectA_Group2/server/sql/config.sql** into igraph.
   
- Provide MySql server credentials in **JS18_ProjectA_Group2/server/config.js**
   
### Starting Project

- Open a terminal on **JS18_ProjectA_Group2** folder. 
Run below command to install all the dependency for both server and ui.
  
      npm install

- Run below command to test if basic functionalities are working fine for server and ui.

      npm test

- Start Mysql server. We use XAMPP PHPMyAdmin to run our mysql server.

- To run the application execute below command.
  
      npm start

- If you want to run server, ui and nlp engine separately and manually, execute below
commands one by one in different terminals from the **JS18_ProjectA_Group2** folder. 

      npm run server

      npm run ui
  
      npm run start:nlp
      
- If any issue running nlp_engine command mentioned above, run below python script from terminal on **JS18_ProjectA_Group2/nlp_engine** folder
  to check the issue.

      python -m rasa_nlu.server -c sample_configs/config_spacy.json
      
### How to use!

- We don't have pre-uploaded dataset in the system, Please upload dataset file. 

- Download sample kaggle datasets from [here](https://www.kaggle.com/rhuebner/human-resources-data-set/data) and 
[here](https://www.kaggle.com/worldbank/world-development-indicators/data).

- Upload sample datasets using the application upload feature. So that necessary features will be processed before
using them for plot.

- We currently don"t support deletion of files uploaded into database. If manually done, make sure to delete corresponding
file from **server/data** and corresponding row from **config table**.

## Proxy Configuration

Proxy configuration has been done on UI to access nlp engine **('/nlp')** and backend **('/api')**.

## Project Architecture

![Project Architecture](https://github.com/Rostlab/JS18_ProjectA_Group2/blob/develop/mockups/Team%202.%20Project%20Architecture.png)
