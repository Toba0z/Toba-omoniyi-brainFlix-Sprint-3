const express = require('express');
const app = express();
const cors = require("cors");
const apiRouters = require("./routes/apiRouters");
require("dotenv").config(); // loads .env variables

const {PORT, API_KEY} = process.env;

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/videos", apiRouters);

console.log("Loggin api router for testing",apiRouters);


// app.get("/testing", (req, res)=>{

// })

app.get("/", (req, res) => {
    res.send("Welcome to the dungeon!");
  });


app.listen(PORT, ()=>{
    console.log(`app is running on PORT: ${PORT || 8088}`);
})