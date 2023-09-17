"use strict"
const Environment = require("./src/environment");
const app = require("./src/index");

app.listen(process.env.PORT || Environment.port, (error) => {
    if(error) console.log('Start server unsuccessfully');
    console.log("Start server successfully");
})

