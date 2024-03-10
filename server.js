
//server.js
const express = require('express');
const app = express();
const cors = require("cors");
const apiRouters = require("./routes/apiRouters");
require("dotenv").config(); // loads .env variables

const {PORT} = process.env;
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/videos", apiRouters);

// console.log("Loggin api router for testing",apiRouters);

app.get("/", (req, res) => {
    res.send("Confirming id app.get is getting anything");
  });


app.listen(PORT, ()=>{
    console.log(`app is running on PORT: ${PORT || 8088 || 8083}`);
})