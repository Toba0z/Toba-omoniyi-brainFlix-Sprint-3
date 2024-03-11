const { isUtf8 } = require("buffer");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Correct import for uuidv4

const videosFilePath = "./Data/video-details.json";

// Route to get all videos with summary details
router.get("/", (req, res) => {
  const videosDataShortVersion = fs.readFileSync("./Data/video-details.json");
  const videosJson = JSON.parse(videosDataShortVersion);
  res.status(200).send(videosJson);
});

// Route to get a single video's data by its ID
router.get("/:videoid", (req, res) => {
  const { videoid } = req.params;
  console.log("params: ", videoid);
  try {
    const videosDataByIdVersion = fs.readFileSync("./Data/video-details.json");
    const videos = JSON.parse(videosDataByIdVersion);
    const videoIdSelected = videos.find((videoItem) => videoItem.id == videoid);
    console.log("login video data test", videoIdSelected);

    if (videoIdSelected) {
      res.status(200).send(videoIdSelected);
    } else {
      res.status(400).send({ message: "Video not found" });
    }
  } catch (error) {
    console.error("Error reading video data", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Route to post a new comment to a specific video
router.post("/:videoid/comments", (req, res) => {
  const { videoid } = req.params;
  const { name, comment } = req.body;

  try {
    const videoData = fs.readFileSync("./Data/video-details.json");
    const videos = JSON.parse(videoData);
    const videoIndex = videos.findIndex((video) => video.id === videoid); // Consider using strict equality
    if (videoIndex === -1) {
      return res.status(404).send("Video not found");
    }

    const newComment = {
      name,
      comment,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    videos[videoIndex].comments.push(newComment);
    fs.writeFileSync(
      "./Data/video-details.json",
      JSON.stringify(videos, null, 2)
    );

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating new comment:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to delete a specific comment from a video
router.delete("/:videoID/comments/:commentID", (req, res) => {
  const { videoID, commentID } = req.params; // Ensure these match the route definition
  try {
    const videoDataComments = fs.readFileSync("./Data/video-details.json");
    const videos = JSON.parse(videoDataComments);
    const videoIndex = videos.findIndex((video) => video.id === videoID); // Use videoID

    if (videoIndex === -1) {
      return res.status(404).send("Video not found"); // Use return to exit the function
    }
    const commentsArray = videos[videoIndex].comments; // Corrected reference
    const commentIndex = commentsArray.findIndex(
      (comment) => comment.id === commentID
    );
    if (commentIndex === -1) {
      return res.status(404).send("Comment not found"); // Use return here as well
    }
    const [deletedComment] = commentsArray.splice(commentIndex, 1);
    fs.writeFileSync(
      "./Data/video-details.json",
      JSON.stringify(videos, null, 2)
    );
    res.status(200).json(deletedComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Route to upload a new video
router.post("/", (req, res) => {
  try {
    const { title, description } = req.body;
    const videosData = JSON.parse(fs.readFileSync(videosFilePath, "utf8"));
    const newVideo = {
      id: uuidv4(),
      title,
      description,
      channel: "Tobiloba Omoniyi",
      image: "http://localhost:8088/images/img1.jpg",
      views: "100,984",
      likes: "8552",
      duration: "26:52",
      video: "http://localhost:8088/stream",
      timestamp: Date.now(),
      comments: [],
    };
    videosData.push(newVideo);
    fs.writeFileSync(videosFilePath, JSON.stringify(videosData, null, 2));
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("could not post video to json file:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
});

// Route to update likes for a video
router.put("/:videoId/likes", (req, res) => {
  const { videoId } = req.params;
  const videosData = JSON.parse(fs.readFileSync(videosFilePath, "utf8"));
  const videosDataIndex = videosData.findIndex(
    (videoLike) => videoLike.id === videoId
  );
  if (videosDataIndex === -1) {
    return res.status(404).send("video not found");
  }
  videosData[videosDataIndex].likes = String(
    Number(videosData[videosDataIndex].likes.replace(/,/g, " ")) + 1
  );
  fs.writeFileSync(videosFilePath, JSON.stringify(videosData, null, 2));
  res.status(200).json({ likes: videosData[videosDataIndex].likes });
});
module.exports = router;
