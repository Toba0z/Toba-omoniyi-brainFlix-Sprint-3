const express = require ("express");
const router = express.Router();
const fs = require("fs");

//Get all videso Data 
router.get("/", (req, res)=>{

    const videosDataShortVersion = fs.readFileSync("./Data/video-details.json");
    const videosJson = JSON.parse(videosDataShortVersion);
    res.status(200).send(videosJson);
    console.log("login video data test",videosJson);
})

module.exports = router; 