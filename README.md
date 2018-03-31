## JS18_ProjectA_Group2

[![Build Status](https://travis-ci.org/Rostlab/JS18_ProjectA_Group2.svg?branch=develop)](https://travis-ci.org/Rostlab/JS18_ProjectA_Group2)

### Set Up

- Install fresh rasa_nlu instance in the root directory. **JS18_ProjectA_Group2/nlp_engine**
   
- Install [Rasa_NLU](https://nlu.rasa.com/installation.html) from *[here](https://nlu.rasa.com/installation.html)*
   
- Copy trained model from **nlp_model/projects** folder to your **rasa_nlu** instance directory(root/nlp_engine).

- Install MySql server and run **project configuration** sql script from **JS18_ProjectA_Group2/server/sql** directory.
   
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
      
- If any issue starting nlp_engine, run below python script from terminal on **JS18_ProjectA_Group2/nlp_engine** folder.

      python -m rasa_nlu.server -c sample_configs/config_spacy.json

## Proxy Configuration

Proxy configuration has been done on UI to access nlp engine **('/nlp')** and backend **('/api')**.

## Project Architecture

![Project Architecture](https://github.com/Rostlab/JS18_ProjectA_Group2/blob/develop/mockups/Team%202.%20Project%20Architecture.png)
