## JS18_ProjectA_Group2

**Open a terminal** on **root** folder. 
Run below command to install all the dependency mentioned in server package.json.
  >npm install

Run below command to test if basic functionalities are working fine.
It will generate covarage report. You can check how good your unit testing coverage is from browser.
  >npm test

Run below command to start the server. The backend.
  >npm start

**Open another terminal** at **UI folder** inside root. 
Run below command to install all UI dependency from its package.json.
  >npm install

Build javascript using webpack from typescript. Follow below command. It will open on watch mode everytime. If you don't want, go to UI/webpack.config.js and disable the watch mode by "watch:false". Good to have it on watch mode while developing new features.
  >npm run build

**Open another terminal** at **UI folder** inside root as previous one will be occupied by webpack build on watch mode.
Test now, if basic functionlities are working in UI by running below command.
  >npm test

If everything is fine till now, then go ahead and execute below command to run the UI server.
And it should open a browser window with pre-defined css loaded into it.
  >npm start

