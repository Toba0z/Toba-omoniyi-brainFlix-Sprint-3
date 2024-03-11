
//server.js
// Initial setup of the Express server with middleware configuration
const express = require('express');
const app = express();
const cors = require("cors");
const apiRouters = require("./routes/apiRouters");
require("dotenv").config();         // loads .env variables

const {PORT} = process.env;         // Destructuring PORT variable from environment
app.use(express.json());            // Middleware for parsing JSON bodies
app.use(express.static("public"));  // Serves static files from the 'public' directory
app.use(cors());                    // Enables CORS to allow cross-origin requests

app.use("/videos", apiRouters);

// Root route to send a simple confirmation message
app.get("/", (req, res) => {
    res.send("Confirming id app.get is getting anything");
  });

// Starts the server on the PORT specified in the .env file, with fallbacks
app.listen(PORT, ()=>{
    console.log(`app is running on PORT: ${PORT || 8088 || 8083}`);
})