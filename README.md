## JS18_ProjectA_Group2

[![Build Status](https://travis-ci.org/Rostlab/JS18_ProjectA_Group2.svg?branch=develop)](https://travis-ci.org/Rostlab/JS18_ProjectA_Group2)

**Open a terminal** on **root** folder. 
Run below command to install all the dependency for both server and ui.
  
  >npm install

Run below command to test if basic functionalities are working fine for server and ui.

  >npm run test:server
  >npm run test:ui
  
Run below command to start server and ui.
server and ui engine runs in watch mode to keep checking changes you do and build simontaneously. 

  >npm run server
  >npm run ui

To start running entire application form a single command, we can try running below command.
  
  >npm start

To start **NLP Engine** follow below url. Go to NLP root folder and run all the query except the query to train the model. 
We already trained a model and saved it in project with name **"igraph_nlp"**. Use this while running the NLP engine for this application.

  >https://nlu.rasa.ai/http.html

### Project Architecture

![Project Architecture](https://github.com/Rostlab/JS18_ProjectA_Group2/blob/develop/mockups/Team%202.%20Project%20Architecture.png)
