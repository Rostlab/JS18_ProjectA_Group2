
var cmd = require('node-cmd');

var pyProcess = cmd.get('sh ./.command',
              function(data, err, stderr) {
                if (!err) {
                  console.log("data from python script " + data)
                } else {
                  console.log("python script cmd error: " + err)
                  }
                }
              );